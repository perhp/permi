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
      <li ref={ref} className={cn("text-nav", props.className)} {...props}>
        <Link
          href={href}
          target={target}
          className="transition-colors hover:text-accent-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          {children}
        </Link>
      </li>
    );
  },
);
NavLink.displayName = "NavLink";

export { NavLink };
