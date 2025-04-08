// utils/trackUser.js
import { db } from "@/services/firebase";
import { collection, addDoc } from "firebase/firestore";
import { getSession } from "next-auth/react";

export const trackClick = async (element) => {
  const session = await getSession();
  await addDoc(collection(db, "user_clicks"), {
    userId: session?.user?.userId || "anonymous",
    element,
    time: new Date(),
  });
};

export const trackPageTime = () => {
  const start = Date.now();
  const beforeUnload = async () => {
    const session = await getSession();
    const duration = Date.now() - start;
    await addDoc(collection(db, "user_page_time"), {
      userId: session?.user?.userId || "anonymous",
      duration, // ms
      url: window.location.href,
      time: new Date(),
    });
  };
  window.addEventListener("beforeunload", beforeUnload);
};
