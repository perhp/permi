import { Github, SatelliteDish } from "lucide-react";
import Link from "next/link";
import { NavLink } from "./nav-link";

export default function Header() {
  return (
    <header className="relative border-b border-gray-100 z-10 bg-white">
      <div className="flex items-center justify-between container h-14">
        <Link href="/" className="flex items-center font-bold gap-1.5">
          <SatelliteDish className="w-5 h-5" /> <span className="hidden sm:inline">permi</span>
        </Link>
        <nav>
          <ul className="flex gap-5 items-center">
            <NavLink href="/" className="font-medium text-sm">
              Passes
            </NavLink>
            <NavLink href="/setup" className="font-medium text-sm">
              Setup
            </NavLink>
            <NavLink href="https://github.com/perhp/permi" target="_blank" className="bg-gray-100 hover:bg-gray-100/75 p-2 rounded-full">
              <Github className="w-5 h-5" />
            </NavLink>
          </ul>
        </nav>
      </div>
    </header>
  );
}
