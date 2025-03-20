import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { db } from "@/services/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import useLanguage from "@/hooks/useLanguage";
import Image from "next/image";
import Link from "next/link";
import Team from "@/components/Layouts/Sections/Team";

export default function TeamPage() {
  return <Team />;
}
