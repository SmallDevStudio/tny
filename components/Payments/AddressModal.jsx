import React, { useState, useEffect } from "react";
import { db } from "@/services/firebase";
import {
  doc,
  onSnapshot, // ✅ realtime listener
} from "firebase/firestore";
import { FaPlus } from "react-icons/fa";
import { Divider, Slide, Dialog } from "@mui/material";
import AddressForm from "./AddressForm";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function AddressModal({ userId, onProcess }) {
  const [addresses, setAddresses] = useState([]); // ชื่อสื่อความหมายกว่า
  const [selectedAddress, setSelectedAddress] = useState(null); // ถ้าจะทำปุ่มแก้ไข
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!userId) return;
    const ref = doc(db, "usr_address", String(userId));
    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (!snap.exists()) {
          setAddresses([]);
          return;
        }
        const data = snap.data();
        const list = Array.isArray(data.addresses) ? data.addresses : [];

        // จัดเรียง: default มาก่อน แล้วตาม updatedAt ล่าสุด (ถ้ามี)
        list.sort((a, b) => {
          if (a.isDefault && !b.isDefault) return -1;
          if (!a.isDefault && b.isDefault) return 1;
          const ta = a.updatedAt || a.createdAt || "";
          const tb = b.updatedAt || b.createdAt || "";
          return String(tb).localeCompare(String(ta));
        });

        setAddresses(list);
      },
      (err) => {
        console.error("onSnapshot usr_address error:", err);
        setAddresses([]);
      }
    );
    return () => unsub();
  }, [userId]);

  const handleSelectAddress = (addr) => {
    if (selectedAddress && selectedAddress.id === addr.id) {
      setSelectedAddress(null);
      onProcess(null); // ส่งค่า null กลับไปที่ parent ถ้ายกเลิกการเลือก
    } else {
      setSelectedAddress(addr);
      onProcess(addr); // ส่งข้อมูลที่อยู่กลับไปที่ parent ทันทีที่เลือก
    }
  };

  const handleEdit = (addr) => {
    setSelectedAddress(addr);
    setOpen(true);
  };

  return (
    <div>
      <div
        className="flex items-center gap-2 text-sm border rounded-lg p-2 bg-orange-500 mb-2 text-white cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <FaPlus />
        เพิ่มที่อยู่สำหรับใบกำกับภาษี
      </div>

      {addresses.length > 0 ? (
        <div className="space-y-2">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`border p-3 rounded cursor-pointer ${
                selectedAddress?.id === addr.id
                  ? "border-green-500"
                  : "border-gray-300"
              }`}
              onClick={() => handleSelectAddress(addr)}
            >
              <div className="flex items-center gap-2 justify-between text-sm font-bold">
                <div>
                  {addr.name}{" "}
                  {addr.isDefault && (
                    <span className="text-green-600">(ค่าเริ่มต้น)</span>
                  )}
                </div>
                <div
                  className="text-xs text-gray-500 cursor-pointer hover:text-orange-500"
                  onClick={() => handleEdit(addr)}
                >
                  แก้ไข
                </div>
              </div>
              <div className="flex flex-col text-sm">
                {addr.type === "personal" ? (
                  <div>บุคคลธรรมดา</div>
                ) : (
                  <div>นิติบุคคล/บริษัท</div>
                )}
                <div className="text-xs text-gray-500">
                  เลขผู้เสียภาษี: {addr.taxId}{" "}
                  {addr.branchType === "branch" &&
                    ` | สาขา: ${addr.branchNumber}`}
                </div>
                <div className="text-xs">
                  {addr.address}
                  {addr.subdistrict && `, ${addr.subdistrict}`}
                  {addr.district && `, ${addr.district}`}
                  {addr.province && `, ${addr.province}`} {addr.postalCode}
                </div>
              </div>

              {/* ถ้าจะทำปุ่มแก้ไข/ลบ: ส่ง data ให้ AddressForm ได้เลย */}
              {/* <button onClick={() => { setSelectedAddress(addr); setOpen(true); }}>แก้ไข</button> */}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-sm text-gray-500">ยังไม่มีที่อยู่</div>
      )}

      <Dialog
        open={open}
        TransitionComponent={Transition}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {/* ถ้าจะใช้โหมดแก้ไข ส่ง prop data={selectedAddress} */}
        <AddressForm
          userId={userId}
          onClose={() => setOpen(false)}
          data={selectedAddress}
        />
      </Dialog>
    </div>
  );
}
