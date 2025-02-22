import "@/styles/globals.css";
import "@/styles/admin.css";
import "@/styles/tiptap.css";
import { useEffect } from "react";
import Header from "@/components/utils/Header";
import AdminLayout from "@/layouts/AdminLayout";
import AppLayout from "@/layouts/AppLayout";
import { useRouter } from "next/router";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";
import { store } from "@/store/store";

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  const router = useRouter();
  const isAdminRoute = router.pathname.startsWith("/admin");
  const isErrorPage = router.pathname.startsWith("/error");
  const isSigninPage = router.pathname === "/signin";
  const isRegisterPage = router.pathname === "/register";
  const isLoading = router.pathname === "/loading";

  if (isErrorPage || isSigninPage || isRegisterPage || isLoading) {
    return (
      <SessionProvider session={session}>
        <Header title={pageProps.title || "The New You Academy"} />
        <ThemeProvider>
          <Provider store={store}>
            <Component {...pageProps} />
            <ToastContainer position="top-right" autoClose={3000} />
          </Provider>
        </ThemeProvider>
      </SessionProvider>
    );
  }

  const Layout = isAdminRoute ? AdminLayout : AppLayout;

  return (
    <SessionProvider session={session}>
      <Header title={pageProps.title || ""} />
      <ThemeProvider>
        <Provider store={store}>
          <Layout>
            <Component {...pageProps} />
            <ToastContainer position="top-right" autoClose={3000} />
          </Layout>
        </Provider>
      </ThemeProvider>
    </SessionProvider>
  );
}
