import "@/styles/globals.css";
import "@/styles/admin.css";
import Header from "@/components/utils/Header";
import AdminLayout from "@/layouts/AdminLayout";
import AppLayout from "@/layouts/AppLayout";
import { useRouter } from "next/router";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SessionProvider } from "next-auth/react";

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  const router = useRouter();
  const isAdminRoute = router.pathname.startsWith("/admin");
  const isErrorPage = router.pathname.startsWith("/error");
  const isSigninPage = router.pathname === "/signin";
  const isRegisterPage = router.pathname === "/register";
  
  if (isErrorPage || isSigninPage || isRegisterPage) {
    return (
      <SessionProvider session={session}>
        <Header title={pageProps.title || "The New You Academy"} />
        <ThemeProvider>
          <Component {...pageProps} />
          <ToastContainer position="top-right" autoClose={3000} />
        </ThemeProvider>
      </SessionProvider>
    );
  }

  const Layout = isAdminRoute ? AdminLayout : AppLayout;

  return (
    <SessionProvider session={session}>
      <Header title={pageProps.title || ""} />
      <ThemeProvider>
        <Layout>
          <Component {...pageProps} />
          <ToastContainer position="top-right" autoClose={3000} />
        </Layout>
      </ThemeProvider>
    </SessionProvider>
  );
}
