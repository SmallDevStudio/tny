import React, { useState, useEffect } from "react";
import useDB from "@/hooks/useDB";
import Image from "next/image";
import { db } from "@/services/firebase";
import {
  collection,
  doc,
  updateDoc,
  setDoc,
  where,
  getDocs,
  onSnapshot,
  query,
} from "firebase/firestore";
import { useSession } from "next-auth/react";
import useLanguage from "@/hooks/useLanguage";
import Header from "@/components/utils/Header";
import Loading from "@/components/utils/Loading";
import { Dialog, Slide } from "@mui/material";
import UploadImage from "@/components/btn/UploadImage";
import { MdEdit } from "react-icons/md";
import { toast } from "react-toastify";
import provinceData from "@/services/province.json";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Profile() {
  const [user, setUser] = useState({});
  const [phone, setPhone] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedAmphure, setSelectedAmphure] = useState("");
  const [zipOptions, setZipOptions] = useState([]);
  const [selectedZip, setSelectedZip] = useState("");
  const [hasFetched, setHasFetched] = useState(false);

  const { data: session, status } = useSession();
  const { subscribe, getById, update } = useDB("profile");
  const { t, lang, selectedLang } = useLanguage();

  const userId = session?.user?.userId;

  useEffect(() => {
    if (status !== "authenticated") return;
    if (!userId) return;
    if (hasFetched) return; // ดึงแล้วไม่ต้องดึงซ้ำ

    const fetchUser = async () => {
      const q = query(collection(db, "users"), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      const fetchedUser = querySnapshot.docs[0]?.data();
      if (fetchedUser) {
        setUser(fetchedUser);
        setSelectedProvince(fetchedUser.provinceId || "");
        setSelectedAmphure(fetchedUser.amphureId || "");
        setHasFetched(true); // ✅ กันดึงซ้ำ
      }
    };
    fetchUser();
  }, [status, userId, hasFetched]);

  // provinces เป็น array ทั้งหมด
  const provinces = provinceData;

  // อำเภอ ตามจังหวัดที่เลือก (ถ้าไม่มีจะเป็น [])
  const amphures =
    provinces.find((p) => p.id === Number(selectedProvince))?.amphure || [];

  // อัพเดทรหัสไปรษณีย์เมื่อเปลี่ยน selectedAmphure
  useEffect(() => {
    if (!selectedAmphure) return;

    const province = provinces.find((p) => p.id === Number(selectedProvince));
    if (!province) return;

    const amphureData = province.amphure.find(
      (a) => a.id === Number(selectedAmphure)
    );
    if (!amphureData) return;

    const zips = [...new Set(amphureData.tambon.map((t) => t.zip_code))];
    setZipOptions(zips);

    setSelectedZip((prev) => {
      // ป้องกันไม่ให้ set ถ้าค่าเหมือนเดิม
      if (zips.length === 1 && prev.zipcode !== zips[0]) {
        return { ...prev, zipcode: zips[0] };
      }
      if (zips.length !== 1 && prev.zipcode !== "") {
        return { ...prev, zipcode: "" };
      }
      return prev; // ถ้าไม่มีอะไรเปลี่ยน ให้คืนค่าเดิม
    });
  }, [selectedAmphure, selectedProvince]);

  const handleUpdate = async () => {
    try {
      const data = {
        uid: user.uid,
        phone: phone,
        provinceId: selectedProvince,
        amphureId: selectedAmphure,
        zipcode: selectedZip,
      };
      await updateDoc(doc(db, "users_details", user.uid), user);
      toast.success(lang["user_updated_successfully"]);
    } catch (error) {
      console.error(error);
      toast.error(lang["user_updated_error"]);
    }
  };

  if (!session || !user) return <Loading />;

  console.log(user);
  console.log(selectedProvince, selectedAmphure, zipOptions, selectedZip);

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col items-center">
        <div className="relative">
          <Image
            src={user?.image || "/default-avatar.png"}
            alt="User Avatar"
            width={150}
            height={150}
            className="rounded-full"
          />
          <div className="absolute bottom-0 right-4 bg-white rounded-full p-1 shadow">
            <MdEdit />
          </div>
        </div>
        <div className="mt-[-20px] bg-white border border-gray-300 rounded-lg p-6 w-full max-w-2xl shadow-md">
          <div className="flex flex-col items-center">
            <p className="text-sm text-gray-600">Email: {user?.email}</p>
            <p className="text-sm text-gray-600">User ID: {user?.userId}</p>
          </div>
          <div className="flex flex-col gap-2 mt-4">
            <div className="flex items-center gap-2">
              <label htmlFor="name">{lang["name"]}</label>
              <input
                type="text"
                id="name"
                value={user?.name || ""}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              />
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="phone">{lang["phone"]}</label>
              <input
                type="text"
                id="phone"
                value={phone || ""}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder={lang["phone_placeholder"]}
              />
            </div>
            <div>
              <label htmlFor="address">{lang["address"]}</label>
              <textarea
                name="address"
                id="aaddress"
                value={user?.address || ""}
                onChange={(e) => setUser({ ...user, address: e.target.value })}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                rows={4}
                placeholder={lang["address_placeholder"]}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {/* จังหวัด */}
              <select
                value={selectedProvince}
                onChange={(e) => {
                  setSelectedProvince(e.target.value);
                  setSelectedAmphure("");
                  setZipOptions([]);
                  setUser((prev) => ({ ...prev, zipcode: "" }));
                }}
                className="border p-2 rounded"
              >
                <option value="">เลือกจังหวัด</option>
                {provinces.map((prov) => (
                  <option key={prov.id} value={prov.id}>
                    {selectedLang === "en" ? prov.name_en : prov.name_th}
                  </option>
                ))}
              </select>

              {/* อำเภอ */}
              <select
                value={selectedAmphure}
                onChange={(e) => setSelectedAmphure(e.target.value)}
                disabled={!selectedProvince}
                className="border p-2 rounded"
              >
                <option value="">เลือกอำเภอ</option>
                {amphures.map((dist) => (
                  <option key={dist.id} value={dist.id}>
                    {selectedLang === "en" ? dist.name_en : dist.name_th}
                  </option>
                ))}
              </select>

              {/* รหัสไปรษณีย์ */}
              {zipOptions.length > 1 ? (
                <select
                  value={user.zipcode || ""}
                  onChange={(e) =>
                    setSelectedZip({ ...selectedZip, zipcode: e.target.value })
                  }
                  className="border p-2 rounded"
                >
                  <option value="">เลือกรหัสไปรษณีย์</option>
                  {zipOptions.map((zip) => (
                    <option key={zip} value={zip}>
                      {zip}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={selectedZip.zipcode || ""}
                  readOnly
                  className="border p-2 rounded bg-gray-100"
                />
              )}
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 mt-4">
            <button
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
              onClick={handleUpdate}
            >
              {lang["updated"]}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
