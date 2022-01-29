import type { AppProps /*, AppContext */ } from "next/app";
import { MDXProvider } from "@mdx-js/react";
import Link from "next/link";
import "../styles/global.scss";
import GlobalLayout from "../components/GlobalLayout";

const components = {
  a: Link,
};

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MDXProvider components={components}>
      <GlobalLayout>
        <Component {...pageProps} />
      </GlobalLayout>
    </MDXProvider>
  );
}
