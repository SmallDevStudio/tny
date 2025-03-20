import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Header from "@/components/Layouts/App/Header";
import Loading from "@/components/utils/Loading";
import Footer from "@/components/Layouts/App/Footer";

const defaultLang = "th";

export default function AppLayout({ children }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const lang = localStorage.getItem("language");
    if (!lang) {
      localStorage.setItem("language", defaultLang);
    }
  }, []);

  if (loading) return <Loading />;

  return (
    <main className="flex-1 bg-white dark:bg-gray-800 text-black dark:text-gray-50 flex-col min-h-screen">
      <Header />
      <div>{children}</div>
      <Footer />
    </main>
  );
}
