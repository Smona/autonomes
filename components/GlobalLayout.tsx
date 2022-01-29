import Link from "next/link";
import { ReactNode } from "react";
import css from "./GlobalLayout.module.scss";

interface Props {
  children: ReactNode;
}

export default function GlobalLayout({ children }: Props) {
  return (
    <>
      <nav className={css.nav}>
        <Link href="/">Home</Link>
        <Link href="/philosophy">Philosophy</Link>
        <Link href="/society">Society</Link>
        <Link href="/utilities">Utilities</Link>
      </nav>
      <main>{children}</main>
    </>
  );
}
