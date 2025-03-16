import { db } from "@/services/firebase";
import { doc, getDoc } from "firebase/firestore";
import useLanguage from "@/hooks/useLanguage";
import { useRouter } from "next/router";
import { MaintenancePage, NotFoundPage } from "./error";

export async function getServerSideProps(context) {
  const { slug } = context.params;

  // ✅ ดึงค่าจาก Firestore: settings/app_settings
  const settingsRef = doc(db, "settings", "app_settings");
  const settingsSnap = await getDoc(settingsRef);
  const settingsData = settingsSnap.exists() ? settingsSnap.data() : {};

  // ✅ ถ้า Maintenance Mode เปิด → ไปที่ Maintenance Page
  if (settingsData.maintenance_mode) {
    return {
      redirect: {
        destination: "/error/maintenance",
        permanent: false,
      },
    };
  }

  // ✅ เช็ค `start_page` ถ้ามีค่า → Redirect ไปหน้าแรกที่กำหนด
  if (
    slug === "home" &&
    settingsData.start_page &&
    settingsData.start_page !== "/"
  ) {
    return {
      redirect: {
        destination: `/${settingsData.start_page}`,
        permanent: false,
      },
    };
  }

  // ✅ ดึงข้อมูล Page จาก Firestore
  const pageRef = doc(db, "pages", slug);
  const pageSnap = await getDoc(pageRef);

  if (!pageSnap.exists()) {
    return { notFound: true };
  }

  return { props: { pageData: pageSnap.data() } };
}

export default function DynamicPage({ pageData }) {
  const router = useRouter();
  const { t } = useLanguage(); // ใช้ hook `useLanguage`

  return (
    <div>
      <h1>{t(pageData?.title)}</h1>
      <p>{t(pageData?.content)}</p>
    </div>
  );
}
