import { cn } from "@/lib/utils";
import Link from "next/link";
import { forwardRef } from "react";

type Props = React.HtmlHTMLAttributes<HTMLLIElement> & {
  children: React.ReactNode;
  href: string;
  target?: string;
};

const NavLink = forwardRef<HTMLLIElement, Props>(({ children, href, target, ...props }, ref) => {
  return (
    <li ref={ref} className={cn("font-medium text-sm hover:text-gray-600", props.className)} {...props}>
      <Link href={href} target={target}>
        {children}
      </Link>
    </li>
  );
});
NavLink.displayName = "NavLink";

export { NavLink };
