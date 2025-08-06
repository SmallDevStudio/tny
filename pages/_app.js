import "@/styles/globals.css";
import "@/styles/admin.css";
import "@/styles/tiptap.css";
import { useEffect, useState } from "react";
import { db } from "@/services/firebase";
import { doc, getDoc } from "firebase/firestore";
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
import { trackPageTime, trackClick, trackPageView } from "@/utils/analytics";
import dynamic from "next/dynamic";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const CookieConsent = dynamic(() => import("@/components/CookieConsent"), {
  ssr: false,
});

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const [consentGiven, setConsentGiven] = useState(false);
  const router = useRouter();
  const isAdminRoute = router.pathname.startsWith("/admin");
  const isErrorPage = router.pathname.startsWith("/error");
  const isSigninPage = router.pathname === "/signin";
  const isRegisterPage = router.pathname === "/register";
  const isLoading = router.pathname === "/loading";
  const isPolicy = router.pathname === "/privacy-policy";

  useEffect(() => {
    const fetchSettings = async () => {
      const settingsRef = doc(db, "settings", "app_settings");
      const settingsSnap = await getDoc(settingsRef);
      if (settingsSnap.exists()) {
        const settings = settingsSnap.data();
        if (settings.maintenance_mode) {
          router.replace("/error/maintenance");
        }
      }
    };
    fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleClick = (e) => trackClick(e.target.outerHTML);
    document.addEventListener("click", handleClick);
    trackPageTime();
    trackPageView();
    return () => document.removeEventListener("click", handleClick);
  }, []);

  if (isErrorPage || isSigninPage || isRegisterPage || isLoading || isPolicy) {
    return (
      <SessionProvider session={session}>
        <Header />
        <ThemeProvider>
          <Provider store={store}>
            {stripePromise && (
              <Elements stripe={stripePromise}>
                <Component {...pageProps} />
              </Elements>
            )}
            <CookieConsent />
            <ToastContainer position="top-right" autoClose={3000} />
          </Provider>
        </ThemeProvider>
      </SessionProvider>
    );
  }

  const Layout = isAdminRoute ? AdminLayout : AppLayout;

  return (
    <SessionProvider session={session}>
      <Header />
      <ThemeProvider>
        <Provider store={store}>
          {/* ✅ ตรวจสอบว่า stripePromise ถูกโหลดก่อน */}
          {stripePromise && (
            <Elements stripe={stripePromise}>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </Elements>
          )}
          <CookieConsent />
          <ToastContainer position="top-right" autoClose={3000} />
        </Provider>
      </ThemeProvider>
    </SessionProvider>
  );
}
