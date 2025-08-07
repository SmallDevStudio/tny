// utils/trackUser.js
import { db } from "@/services/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getSession } from "next-auth/react";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { UAParser } from "ua-parser-js";
import { v4 as uuidv4 } from "uuid";

const getSessionId = () => {
  let id = localStorage.getItem("session_id");
  if (!id) {
    id = uuidv4();
    localStorage.setItem("session_id", id);
  }
  return id;
};

// ดึง fingerprint
const getFingerprint = async () => {
  const fp = await FingerprintJS.load();
  const result = await fp.get();
  return result.visitorId;
};

export const trackPageView = async () => {
  const session = await getSession();
  const sessionId = getSessionId();
  const fingerprint = await getFingerprint();

  const parser = new UAParser(navigator.userAgent);
  const os = parser.getOS().name;
  const deviceType = parser.getDevice().type || "desktop"; // default desktop

  await addDoc(collection(db, "user_page_view"), {
    userId: session?.user?.userId || null,
    fingerprint,
    sessionId,
    url: window.location.href,
    timestamp: serverTimestamp(),
    userAgent: navigator.userAgent,
    referrer: document.referrer,
    os,
    deviceType,
  });
};

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

export const trackEvent = async (event) => {
  const session = await getSession();
  await addDoc(collection(db, "user_events"), {
    userId: session?.user?.userId || "anonymous",
    event,
    time: new Date(),
  });
};

export const trackError = async (error) => {
  const session = await getSession();
  await addDoc(collection(db, "user_errors"), {
    userId: session?.user?.userId || "anonymous",
    error,
    time: new Date(),
  });
};

export const trackLogin = async () => {
  const session = await getSession();
  await addDoc(collection(db, "user_logins"), {
    userId: session?.user?.userId || "anonymous",
    time: new Date(),
  });
};

export const handleVideoEnded = async () => {
  const sessionId = getSessionId();
  const fingerprint = await getFingerprint();

  await addDoc(collection(db, "user_video_view"), {
    videoId: "YOUR_VIDEO_ID",
    timestamp: serverTimestamp(),
    sessionId,
    fingerprint,
    durationWatched: watchedSeconds,
    totalDuration: videoDuration,
    completed: true,
  });
};
