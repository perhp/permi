import { Github, SatelliteDish } from "lucide-react";
import { NavLink } from "./nav-link";

export default function Header() {
  return (
    <header className="flex items-center border-b border-gray-100 justify-between">
      <div className="flex items-center font-bold p-5 gap-1.5">
        <SatelliteDish className="w-5 h-5" /> permi
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
    </header>
  );
}
