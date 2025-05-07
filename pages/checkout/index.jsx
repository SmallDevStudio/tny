import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { db } from "@/services/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

export default function Checkout() {
  return (
    <div>
      <h1>Checkout</h1>
    </div>
  );
}
