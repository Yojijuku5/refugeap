import Link from "next/link";
import { links } from "./Header";

export const Footer = () => {
  return (
    <footer className="flex flex-col items-center justify-around gap-5 bg-emerald-700 p-10 text-white lg:flex-row">
      <nav className="flex gap-5">
        {links.map(({ href, text }) => (
          <Link key={href} href={href} className={"uppercase"}>
            {text}
          </Link>
        ))}
      </nav>

      <p>© {new Date().getFullYear()} Apply. All rights reserved.</p>

      <p>Terms · Privacy Policy</p>
    </footer>
  );
};
