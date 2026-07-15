import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { SatelliteDish } from "lucide-react";
import Link from "next/link";
import { NavLink } from "./nav-link";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#d9e4e3]/80 bg-[#f7faf9]/90 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-bold tracking-[-0.02em] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#256a8a]"
        >
          <span className="flex size-8 items-center justify-center rounded-full bg-[#10212b] text-white">
            <SatelliteDish className="size-4" />
          </span>
          <span>permi</span>
          <span className="hidden font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-[#5c6f76] md:inline">
            Ground station
          </span>
        </Link>
        <nav>
          <ul className="flex items-center gap-4 sm:gap-6">
            <NavLink href="/#passes" className="font-medium text-sm">
              Passes
            </NavLink>
            <NavLink href="/setup" className="font-medium text-sm">
              Setup
            </NavLink>
            <NavLink
              href="https://github.com/perhp/permi"
              target="_blank"
              aria-label="View permi on GitHub"
              className="rounded-full bg-[#e7efef] p-2 transition-colors hover:bg-[#d9e4e3]"
            >
              <GitHubLogoIcon className="w-5 h-5" />
            </NavLink>
          </ul>
        </nav>
      </div>
    </header>
  );
}
