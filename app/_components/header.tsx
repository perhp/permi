import { Github, SatelliteDish } from "lucide-react";
import { NavLink } from "./nav-link";

export default function Header() {
  return (
    <header className="border-b border-gray-100">
      <div className="flex items-center justify-between container h-14">
        <div className="flex items-center font-bold gap-1.5">
          <SatelliteDish className="w-5 h-5" /> <span className="hidden sm:inline">permi</span>
        </div>
        <nav className="pr-5">
          <ul className="flex gap-5 items-center">
            <NavLink href="/">Latest pass</NavLink>
            <NavLink href="/all-passes">All passes</NavLink>
            <NavLink href="https://github.com/perhp/permi" target="_blank" className="bg-gray-100 hover:bg-gray-100/75 p-2 rounded-full">
              <Github className="w-5 h-5" />
            </NavLink>
          </ul>
        </nav>
      </div>
    </header>
  );
}
