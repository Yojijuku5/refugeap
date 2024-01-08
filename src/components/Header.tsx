import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link, { type LinkProps } from "next/link";
import { useRouter } from "next/router";
import {
  type ReactNode,
  useState,
  useEffect,
  type PropsWithChildren,
} from "react";
import { createPortal } from "react-dom";

export const links = [
  { href: "/items", text: "items" },
  { href: "/events", text: "events" },
  { href: "/blog", text: "blog" },
  { href: "/contact", text: "contact us" },
  { href: "/about-us", text: "about us" },
  { href: "/englang-prov", text: "opportunities" },
];

const HeaderLink = (props: NonNullable<PropsWithChildren> & LinkProps) => {
  const { children, ...linkProps } = props;
  const router = useRouter();

  return (
    <Link
      aria-current={router.asPath === linkProps.href ? "page" : "false"}
      className="capitalize aria-[current=page]:underline aria-[current=page]:underline-offset-4"
      {...linkProps}
    >
      {children}
    </Link>
  );
};

type MobileMenuProps = { closeMobileMenuHandler: () => void };

const MobileNav = ({ closeMobileMenuHandler }: MobileMenuProps) => {
  const [startCloseAnimation, setStartCloseAnimation] = useState(false);
  const container = document.getElementById("__next");
  const router = useRouter();

  const triggerCloseAnimation = () => setStartCloseAnimation(() => true);

  const onAnimationEndHandler = () => {
    if (startCloseAnimation) {
      closeMobileMenuHandler();
    }
  };

  useEffect(() => {
    const handleRouteChange = () => triggerCloseAnimation();

    router.events.on("routeChangeStart", handleRouteChange);

    return () => router.events.off("routeChangeStart", handleRouteChange);
  }, [router.events]);

  if (!container) {
    return null;
  }

  return createPortal(
    <div
      aria-expanded={!startCloseAnimation ? true : false}
      className="fixed inset-0 z-50 animate-fade-in bg-black/40 text-white backdrop-blur-lg aria-[expanded=false]:animate-fade-out"
      onAnimationEnd={onAnimationEndHandler}
    >
      <nav className="flex h-full flex-col items-center justify-center gap-8 uppercase">
        <button onClick={triggerCloseAnimation}>
          <svg
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            className={"aspect-square h-6 fill-current"}
          >
            <path d="m12 10.93 5.719-5.72c.146-.146.339-.219.531-.219.404 0 .75.324.75.749 0 .193-.073.385-.219.532l-5.72 5.719 5.719 5.719c.147.147.22.339.22.531 0 .427-.349.75-.75.75-.192 0-.385-.073-.531-.219l-5.719-5.719-5.719 5.719c-.146.146-.339.219-.531.219-.401 0-.75-.323-.75-.75 0-.192.073-.384.22-.531l5.719-5.719-5.72-5.719c-.146-.147-.219-.339-.219-.532 0-.425.346-.749.75-.749.192 0 .385.073.531.219z" />
          </svg>
        </button>
        {links.map(({ href, text }) => (
          <HeaderLink key={href} href={href}>
            {text}
          </HeaderLink>
        ))}
      </nav>
    </div>,
    container
  );
};

type MobileMenuButtonProps = { openMobileMenuHandler: () => void };

const MobileMenuButton = ({ openMobileMenuHandler }: MobileMenuButtonProps) => {
  return (
    <button
      aria-label="open-menu"
      onClick={openMobileMenuHandler}
      className="rounded-md border border-white/20 bg-emerald-700 p-2 duration-300 hover:bg-emerald-600 lg:hidden"
    >
      <svg
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        className="aspect-square h-6 fill-white"
      >
        <path d="m22 16.75c0-.414-.336-.75-.75-.75h-18.5c-.414 0-.75.336-.75.75s.336.75.75.75h18.5c.414 0 .75-.336.75-.75zm0-5c0-.414-.336-.75-.75-.75h-18.5c-.414 0-.75.336-.75.75s.336.75.75.75h18.5c.414 0 .75-.336.75-.75zm0-5c0-.414-.336-.75-.75-.75h-18.5c-.414 0-.75.336-.75.75s.336.75.75.75h18.5c.414 0 .75-.336.75-.75z" />
      </svg>
    </button>
  );
};

const SessionButton = () => {
  const { data: session } = useSession();

  const signOutHandler = () => {
    void signOut({ redirect: true, callbackUrl: "/" });
  };

  if (!session) {
    return (
      <Link href={"/sign-in"} className="button-primary">
        sign-in
      </Link>
    );
  }

  return (
    <button onClick={signOutHandler} className="button-primary">
      sign out
    </button>
  );
};

const MainNav = () => {
  return (
    <nav className="hidden gap-5 capitalize lg:flex">
      {links.map(({ href, text }) => (
        <HeaderLink key={href} href={href}>
          {text}
        </HeaderLink>
      ))}
    </nav>
  );
};

const Title = () => {
  return (
    <Link href={"/"} className="mr-auto">
      <Image
        src="/logo.png"
        alt="logo"
        width={100}
        height={56}
        className="hue-rotate-[300deg]"
        priority
      />
    </Link>
  );
};

const MaxWidthWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <div className="mx-auto flex max-w-7xl items-center gap-5 p-5">
      {children}
    </div>
  );
};
const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const openMobileMenu = () => setIsMobileMenuOpen(() => true);
  const closeMobileMenu = () => setIsMobileMenuOpen(() => false);

  return (
    <header className="fixed top-0 z-40 w-full bg-emerald-700/10 backdrop-blur-lg">
      <MaxWidthWrapper>
        <Title />

        <MainNav />

        <SessionButton />

        <MobileMenuButton openMobileMenuHandler={openMobileMenu} />
      </MaxWidthWrapper>

      {isMobileMenuOpen && (
        <MobileNav closeMobileMenuHandler={closeMobileMenu} />
      )}
    </header>
  );
};

export default Header;
