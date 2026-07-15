import { subMonths } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

import { createServiceClient } from "@/lib/supabase";

const PASSES_PER_BATCH = 100;
const ITEMS_PER_OPERATION = 100;
const STORAGE_BUCKET = "passes";
const STORAGE_PREFIX = "images";

type ExpiredPass = {
  id: number;
  images: { id: number; path: string }[] | null;
};

function storagePath(path: string) {
  const pathWithoutLeadingSlashes = path.replace(/^\/+/, "");

  return pathWithoutLeadingSlashes.startsWith(`${STORAGE_PREFIX}/`)
    ? pathWithoutLeadingSlashes
    : `${STORAGE_PREFIX}/${pathWithoutLeadingSlashes}`;
}

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    console.error("CRON_SECRET is not configured");
    return NextResponse.json(
      { error: "Cron job is not configured" },
      { status: 500 },
    );
  }

  if (request.headers.get("authorization") !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createServiceClient();
  const cutoff = subMonths(new Date(), 1).toISOString();
  let deletedPasses = 0;
  let deletedImages = 0;

  try {
    while (true) {
      const { data, error: fetchError } = await supabase
        .from("passes")
        .select("id, images:passes_images(id, path)")
        .lt("pass_start", cutoff)
        .order("pass_start", { ascending: true })
        .limit(PASSES_PER_BATCH);

      if (fetchError) {
        throw new Error(
          `Could not fetch expired passes: ${fetchError.message}`,
        );
      }

      const expiredPasses = (data ?? []) as ExpiredPass[];

      if (expiredPasses.length === 0) {
        break;
      }

      const images = expiredPasses.flatMap((pass) => pass.images ?? []);
      const imagePaths = Array.from(
        new Set(images.map((image) => storagePath(image.path))),
      );

      for (
        let index = 0;
        index < imagePaths.length;
        index += ITEMS_PER_OPERATION
      ) {
        const { error: storageError } = await supabase.storage
          .from(STORAGE_BUCKET)
          .remove(imagePaths.slice(index, index + ITEMS_PER_OPERATION));

        if (storageError) {
          throw new Error(
            `Could not delete pass images: ${storageError.message}`,
          );
        }
      }

      const imageIds = images.map((image) => image.id);

      for (
        let index = 0;
        index < imageIds.length;
        index += ITEMS_PER_OPERATION
      ) {
        const { error: imageDeleteError } = await supabase
          .from("passes_images")
          .delete()
          .in("id", imageIds.slice(index, index + ITEMS_PER_OPERATION));

        if (imageDeleteError) {
          throw new Error(
            `Could not delete pass image records: ${imageDeleteError.message}`,
          );
        }
      }

      const passIds = expiredPasses.map((pass) => pass.id);
      const { error: deleteError } = await supabase
        .from("passes")
        .delete()
        .in("id", passIds);

      if (deleteError) {
        throw new Error(
          `Could not delete expired passes: ${deleteError.message}`,
        );
      }

      deletedPasses += passIds.length;
      deletedImages += imagePaths.length;
    }

    return NextResponse.json({ cutoff, deletedPasses, deletedImages });
  } catch (error) {
    console.error("Expired pass cleanup failed", error);
    return NextResponse.json(
      {
        error: "Expired pass cleanup failed",
        cutoff,
        deletedPasses,
        deletedImages,
      },
      { status: 500 },
    );
  }
}
