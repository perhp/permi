import { cn } from "@/lib/utils";
import Link from "next/link";
import { forwardRef } from "react";

type Props = React.HtmlHTMLAttributes<HTMLLIElement> & {
  children: React.ReactNode;
  href: string;
  target?: string;
};

const NavLink = forwardRef<HTMLLIElement, Props>(
  ({ children, href, target, ...props }, ref) => {
    return (
      <li
        ref={ref}
        className={cn("font-medium text-sm", props.className)}
        {...props}
      >
        <Link
          href={href}
          target={target}
          className="transition-colors hover:text-[#256a8a] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#256a8a]"
        >
          {children}
        </Link>
      </li>
    );
  },
);
NavLink.displayName = "NavLink";

export { NavLink };
