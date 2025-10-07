import React, { useState, useEffect, useRef, useMemo } from "react";
import { db } from "@/services/firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot, // ✅ เพิ่ม onSnapshot สำหรับการติดตามแบบ Realtime
  query,
  callback,
} from "firebase/firestore";
import { Divider } from "@mui/material";
import { IoClose } from "react-icons/io5";
import { FaRegAddressCard } from "react-icons/fa";
import { toast } from "react-toastify";
import { nanoid } from "nanoid";
import { set } from "mongoose";

const URLS = {
  PROVINCES:
    "https://raw.githubusercontent.com/kongvut/thai-province-data/refs/heads/master/api/latest/province.json",
  DISTRICTS:
    "https://raw.githubusercontent.com/kongvut/thai-province-data/refs/heads/master/api/latest/district.json",
  SUBDISTRICTS:
    "https://raw.githubusercontent.com/kongvut/thai-province-data/refs/heads/master/api/latest/sub_district.json",
};

const getZipFromSubId = (subDistricts, subId) => {
  const sub = subDistricts.find((s) => s.id === subId);
  return sub?.zip_code ? String(sub.zip_code) : "";
};

export default function AddressForm({ userId, onClose, data }) {
  const [payload, setPayload] = useState({
    id: "",
    type: "personal",
    name: "",
    taxId: "",
    branchType: "headOffice",
    branchNumber: "",
    address: "",
    subdistrict: "",
    district: "",
    province: "",
    postalCode: "",
    remark: "",
    isDefault: false,
    userId: userId,
    createdAt: null,
    updatedAt: null,
  });

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [subDistricts, setSubDistricts] = useState([]);

  // selections (เก็บ id ไว้ใช้ filter, เก็บชื่อไว้โชว์/บันทึก)
  const [selectedProvinceId, setSelectedProvinceId] = useState(null);
  const [selectedDistrictId, setSelectedDistrictId] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (data) {
      setPayload({
        id: data.id,
        type: data.type || "personal",
        name: data.name || "",
        taxId: data.taxId || "",
        branchType: data.branchType || "headOffice",
        branchNumber: data.branchNumber || "",
        address: data.address || "",
        subdistrict: data.subdistrict || "",
        district: data.district || "",
        province: data.province || "",
        postalCode: data.postalCode || "",
        remark: data.remark || "",
        isDefault: data.isDefault || false,
        userId: data.userId || userId,
        createdAt: data.createdAt || null,
        updatedAt: data.updatedAt || null,
      });
    } else {
      setPayload({
        id: "",
        type: "personal",
        name: "",
        taxId: "",
        branchType: "headOffice",
        branchNumber: "",
        address: "",
        subdistrict: "",
        district: "",
        province: "",
        postalCode: "",
        remark: "",
        isDefault: false,
        userId: userId,
        createdAt: null,
        updatedAt: null,
      });
    }
  }, [data]);

  useEffect(() => {
    // ต้องมี datasets ครบ + มี payload จากโหมดแก้ไข
    if (!provinces.length || !districts.length || !subDistricts.length) return;
    if (!payload.province) return;

    // 1) province
    const prov = provinces.find(
      (p) => p.name_th.trim() === String(payload.province).trim()
    );
    if (!prov) return;

    if (selectedProvinceId !== prov.id) {
      setSelectedProvinceId(prov.id);
    }

    // 2) district (ภายใน province เดียวกัน)
    if (!payload.district) return;
    const dist = districts.find(
      (d) =>
        d.name_th.trim() === String(payload.district).trim() &&
        d.province_id === prov.id
    );
    if (!dist) return;

    if (selectedDistrictId !== dist.id) {
      setSelectedDistrictId(dist.id);
    }

    // 3) subdistrict (ภายใน district เดียวกัน) → ไม่จำเป็นต้อง set id แยก
    // เพราะ value ของ <select> ตำบลเรา derive จากชื่ออยู่แล้ว
    // แต่ถ้าอยากกัน zip ว่าง กรอกให้เลย:
    if (payload.subdistrict && !payload.postalCode) {
      const sub = subDistricts.find(
        (s) =>
          s.name_th.trim() === String(payload.subdistrict).trim() &&
          s.district_id === dist.id
      );
      if (sub?.zip_code) {
        setPayload((prev) => ({ ...prev, postalCode: String(sub.zip_code) }));
      }
    }
  }, [
    provinces,
    districts,
    subDistricts,
    payload.province,
    payload.district,
    payload.subdistrict,
  ]);

  // load data ครั้งเดียว
  useEffect(() => {
    let mounted = true;
    (async () => {
      const [pRes, dRes, sRes] = await Promise.all([
        fetch(URLS.PROVINCES),
        fetch(URLS.DISTRICTS),
        fetch(URLS.SUBDISTRICTS),
      ]);
      const [p, d, s] = await Promise.all([
        pRes.json(),
        dRes.json(),
        sRes.json(),
      ]);
      if (!mounted) return;
      // sort ตามชื่อไทยเพื่อ UX ที่ดีขึ้น
      p.sort((a, b) => a.name_th.localeCompare(b.name_th));
      d.sort((a, b) => a.name_th.localeCompare(b.name_th));
      s.sort((a, b) => a.name_th.localeCompare(b.name_th));

      setProvinces(p);
      setDistricts(d);
      setSubDistricts(s);
    })();
    return () => (mounted = false);
  }, []);

  const districtOptions = useMemo(() => {
    if (!selectedProvinceId) return [];
    return districts.filter((x) => x.province_id === selectedProvinceId);
  }, [districts, selectedProvinceId]);

  const subDistrictOptions = useMemo(() => {
    if (!selectedDistrictId) return [];
    return subDistricts.filter((x) => x.district_id === selectedDistrictId);
  }, [subDistricts, selectedDistrictId]);

  // helper: ตรวจว่าเป็นกรุงเทพฯ เพื่อแสดง label เขต/แขวง
  const isBangkok =
    payload.province === "กรุงเทพมหานคร" ||
    provinces.find((p) => p.id === selectedProvinceId)?.name_th ===
      "กรุงเทพมหานคร";

  // เมื่อเปลี่ยนจังหวัด
  const handleProvinceChange = (provIdStr) => {
    const provId = provIdStr ? Number(provIdStr) : null;
    setSelectedProvinceId(provId);
    const prov = provinces.find((p) => p.id === provId);
    setMany(
      {
        province: prov?.name_th || "",
        district: "",
        subdistrict: "",
        postalCode: "",
      },
      ["province"]
    );
    setSelectedDistrictId(null);
  };

  // เมื่อเปลี่ยนอำเภอ/เขต
  const handleDistrictChange = (distIdStr) => {
    const distId = distIdStr ? Number(distIdStr) : null;
    setSelectedDistrictId(distId);
    const dist = districts.find((d) => d.id === distId);
    setMany(
      {
        district: dist?.name_th || "",
        subdistrict: "",
        postalCode: "",
      },
      ["district"]
    );
  };

  // เมื่อเปลี่ยนตำบล/แขวง → ตั้งไปรษณีย์อัตโนมัติ
  const handleSubDistrictChange = (subIdStr) => {
    const subId = subIdStr ? Number(subIdStr) : null;
    const sub = subDistricts.find((s) => s.id === subId);
    setMany(
      {
        subdistrict: sub?.name_th || "",
        postalCode: sub?.zip_code ? String(sub.zip_code) : "",
      },
      ["subdistrict", "postalCode"]
    );
  };

  // เมื่อพิมพ์รหัสไปรษณีย์ → เติมจังหวัด/อำเภอ/ตำบลอัตโนมัติ (ถ้าพบ match)
  const handlePostalChange = (val) => {
    const digits = val.replace(/\D/g, "").slice(0, 5);
    setPayload((prev) => ({ ...prev, postalCode: digits }));

    if (digits.length === 5) {
      const subs = subDistricts.filter((s) => String(s.zip_code) === digits);
      if (subs.length > 0) {
        // เลือกตัวแรกไว้ก่อน (สามารถเปลี่ยนเป็นให้ผู้ใช้เลือกได้)
        const sub = subs[0];
        const dist = districts.find((d) => d.id === sub.district_id);
        const prov = provinces.find((p) => p.id === dist?.province_id);

        setSelectedProvinceId(prov?.id ?? null);
        setSelectedDistrictId(dist?.id ?? null);

        setMany(
          {
            province: prov?.name_th || "",
            district: dist?.name_th || "",
            subdistrict: sub?.name_th || "",
            postalCode: digits,
          },
          ["province", "district", "subdistrict", "postalCode"]
        );
      }
    } else {
      // ถ้ายังไม่ครบ 5 หลัก ไม่ auto
    }
  };

  useEffect(() => {
    if (!selectedDistrictId) return;
    const options = subDistricts.filter(
      (s) => s.district_id === selectedDistrictId
    );
    if (options.length === 1) {
      const only = options[0];
      setMany(
        {
          subdistrict: only.name_th,
          postalCode: only.zip_code ? String(only.zip_code) : "",
        },
        ["subdistrict", "postalCode"]
      );
    }
    // ถ้า options > 1 จะรอให้ user เลือกเอง แล้ว zip จะตั้งอัตโนมัติใน handleSubDistrictChange
  }, [selectedDistrictId, subDistricts]);

  // --- เพิ่ม useEffect นี้: เคลียร์ zip เมื่อเปลี่ยนจังหวัด ---
  // ป้องกัน zip ค้างจากจังหวัดก่อนหน้า
  useEffect(() => {
    setPayload((prev) => ({
      ...prev,
      postalCode: prev.subdistrict ? prev.postalCode : "", // ล้าง zip ถ้ายังไม่เลือกตำบล
    }));
  }, [selectedProvinceId]);

  const getLabel = (key) => {
    const common = {
      type: "ประเภทการขอใบกำกับภาษี",
      name:
        payload.type === "company"
          ? "ชื่อบริษัท หน่วยงาน หรือองค์กร"
          : "ชื่อ-นามสกุล",
      taxId: "เลขประจำตัวผู้เสียภาษี",
      address: "ที่อยู่",
      province: "จังหวัด",
      postalCode: "รหัสไปรษณีย์",
      remark: "หมายเหตุ",
      branchType: "สำนักงานใหญ่/สาขา",
      branchNumber: "เลขที่สาขา",
    };
    if (key === "district") return isBangkok ? "เขต" : "อำเภอ";
    if (key === "subdistrict") return isBangkok ? "แขวง" : "ตำบล";
    return common[key] ?? key;
  };

  const REQUIRED_KEYS = [
    "type",
    "name",
    "taxId",
    "address",
    "subdistrict",
    "district",
    "province",
    "postalCode",
  ];

  const validatePayload = (p) => {
    const e = {};
    for (const k of REQUIRED_KEYS) {
      if (!p[k] || String(p[k]).trim() === "") {
        e[k] = `กรุณากรอก${getLabel(k)}`;
      }
    }

    // ✅ ตรวจสอบเลขประจำตัวผู้เสียภาษี
    if (p.taxId) {
      const taxIdStr = String(p.taxId).trim();
      if (!/^\d+$/.test(taxIdStr)) {
        e.taxId = "เลขประจำตัวผู้เสียภาษีต้องเป็นตัวเลขเท่านั้น";
      } else if (taxIdStr.length !== 13) {
        e.taxId = "เลขประจำตัวผู้เสียภาษีต้องมี 13 หลัก";
      }
    }

    // ✅ ตรวจสอบรหัสไปรษณีย์
    if (p.postalCode) {
      const zipStr = String(p.postalCode).trim();
      if (!/^\d+$/.test(zipStr)) {
        e.postalCode = "รหัสไปรษณีย์ต้องเป็นตัวเลขเท่านั้น";
      } else if (zipStr.length !== 5) {
        e.postalCode = "รหัสไปรษณีย์ต้องมี 5 หลัก";
      }
    } else {
      e.postalCode = "กรุณากรอกรหัสไปรษณีย์";
    }

    // ✅ ตรวจสอบเลขที่สาขา (ถ้าเลือกประเภทสาขา)
    if (
      p.branchType === "branch" &&
      (!p.branchNumber || String(p.branchNumber).trim() === "")
    ) {
      e.branchNumber = "กรุณากรอกเลขที่สาขา";
    }

    return e;
  };

  const buildAddressObject = (p, isCreate) => {
    const now = new Date().toISOString();
    return {
      id: isCreate ? nanoid(10) : p.id,
      type: p.type,
      name: p.name,
      taxId: p.taxId,
      branchType: p.branchType,
      branchNumber: p.branchType === "branch" ? p.branchNumber : "", // เคลียร์ถ้าไม่ใช่สาขา
      address: p.address,
      subdistrict: p.subdistrict,
      district: p.district,
      province: p.province,
      postalCode: String(p.postalCode),
      remark: p.remark || "",
      isDefault: !!p.isDefault,
      userId: p.userId, // redundancy ตาม requirement
      createdAt: isCreate
        ? now
        : p.createdAt && typeof p.createdAt === "string"
        ? p.createdAt
        : now,
      updatedAt: now,
    };
  };

  const onSubmit = async () => {
    try {
      // 1) validate
      const e = validatePayload(payload);
      if (Object.keys(e).length > 0) {
        setErrors(e);
        const labels = Object.keys(e).map((k) => getLabel(k));
        // ลบ label ซ้ำ
        const unique = [...new Set(labels)];
        toast.error(`กรุณากรอกข้อมูลให้ครบ: ${unique.join(", ")}`);
        return;
      }

      const userDocRef = doc(db, "usr_address", String(userId));
      const snap = await getDoc(userDocRef);

      // อ่าน addresses เดิม
      let addresses = [];
      if (snap.exists()) {
        addresses = Array.isArray(snap.data()?.addresses)
          ? [...snap.data().addresses]
          : [];
      }

      const isCreate = !payload.id || String(payload.id).trim() === "";
      const newObj = buildAddressObject(payload, isCreate);

      if (isCreate) {
        // 2) สร้างใหม่: ถ้า set default → เคลียร์ default ตัวอื่น
        if (newObj.isDefault && addresses.length > 0) {
          addresses = addresses.map((a) => ({ ...a, isDefault: false }));
        }
        addresses.push(newObj);
      } else {
        // 3) อัปเดต: หา index
        const idx = addresses.findIndex((a) => a.id === payload.id);
        if (idx === -1) {
          // ถ้าไม่เจอ ให้ถือเป็นสร้างใหม่ (กันข้อมูล mismatch)
          if (newObj.isDefault && addresses.length > 0) {
            addresses = addresses.map((a) => ({ ...a, isDefault: false }));
          }
          addresses.push(newObj);
        } else {
          // ถ้าอัปเดตและติ๊ก default → เคลียร์ตัวอื่นก่อน
          if (newObj.isDefault) {
            addresses = addresses.map((a, i) =>
              i === idx ? a : { ...a, isDefault: false }
            );
          }
          addresses[idx] = { ...addresses[idx], ...newObj };
        }
      }

      // บันทึกกลับ (setDoc merge: false ให้ schema สะอาด)
      await setDoc(
        userDocRef,
        { userId: String(userId), addresses },
        { merge: false }
      );

      setErrors({});
      toast.success("บันทึกที่อยู่สำเร็จ");
      onClose?.();
    } catch (e) {
      console.error(e);
      toast.error("เกิดข้อผิดพลาดในการบันทึกที่อยู่");
    }
  };

  const handleClose = () => {
    setPayload({
      id: "",
      type: "personal",
      name: "",
      taxId: "",
      branchType: "headOffice",
      branchNumber: "",
      address: "",
      subdistrict: "",
      district: "",
      province: "",
      postalCode: "",
      remark: "",
      isDefault: false,
    });
    onClose();
  };

  const setField = (key, value) => {
    setPayload((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const clearErrors = (...keys) => {
    setErrors((prev) => {
      if (!prev) return {};
      const next = { ...prev };
      keys.forEach((k) => {
        if (next[k]) delete next[k];
      });
      return next;
    });
  };

  const setMany = (patchObj, keysToClear = []) => {
    setPayload((prev) => ({ ...prev, ...patchObj }));
    if (keysToClear.length) clearErrors(...keysToClear);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-2 bg-orange-500 text-white p-2">
        <div className="flex items-center gap-2">
          <FaRegAddressCard size={24} />
          <h2>แก้ไขที่อยู่ในการออกใบกำกับภาษี</h2>
        </div>
        <IoClose size={24} className="cursor-pointer" onClick={handleClose} />
      </div>
      {/* Form */}
      <div className="flex flex-col gap-4 p-4">
        {/* Type */}
        <div className="flex flex-col gap-1">
          <div className="flex flex-col">
            <h5 className="font-bold">ประเภทการขอใบกำกับภาษี</h5>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <input
                type="radio"
                name="type"
                value="personal"
                checked={payload.type === "personal"}
                onChange={(e) =>
                  setPayload({ ...payload, type: e.target.value })
                }
              />
              <label>บุคคลธรรมดา</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                name="type"
                value="company"
                checked={payload.type === "company"}
                onChange={(e) =>
                  setPayload({ ...payload, type: e.target.value })
                }
              />
              <label>นิติบุคคล</label>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-col gap-1">
            <h5>
              {payload.type === "personal"
                ? "ชื่อ-นามสกุล"
                : "ชื่อบริษัท หน่วยงาน หรือองค์กร"}
              <span className="text-red-500">*</span>
            </h5>
            <input
              type="text"
              className={`border  rounded-lg p-1 w-64 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              value={payload.name || ""}
              onChange={(e) => setField("name", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <h5>
              เลขประจำตัวผู้เสียภาษี<span className="text-red-500">*</span>
            </h5>
            <input
              type="text"
              inputMode="numeric"
              maxLength={13}
              pattern="[0-9]*"
              className={`border  rounded-lg p-1 w-64 ${
                errors.taxId ? "border-red-500" : "border-gray-300"
              }`}
              value={payload.taxId || ""}
              onChange={(e) => setField("taxId", e.target.value)}
            />
          </div>
          {payload.type === "company" && (
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex flex-col gap-1">
                <h5>
                  สำนักงานใหญ่ / สาขา<span className="text-red-500">*</span>
                </h5>
                <select
                  name="branchType"
                  id="branchType"
                  className="border border-gray-300 rounded-lg p-1 w-64"
                  value={payload.branchType || "headOffice"}
                  onChange={(e) =>
                    setPayload({ ...payload, branchType: e.target.value })
                  }
                >
                  <option value="headOffice">สำนักงานใหญ่</option>
                  <option value="branch">สาขา</option>
                </select>
              </div>
              {payload.branchType === "branch" && (
                <div className="flex flex-col gap-1">
                  <h5>
                    เลขที่สาขา<span className="text-red-500">*</span>
                  </h5>
                  <input
                    type="text"
                    className={`border  rounded-lg p-1 w-64 ${
                      errors.branchNumber ? "border-red-500" : "border-gray-300"
                    }`}
                    value={payload.branchNumber || ""}
                    onChange={(e) =>
                      setPayload({ ...payload, branchNumber: e.target.value })
                    }
                  />
                </div>
              )}
            </div>
          )}
        </div>
        <Divider flexItem sx={{ my: 1 }} />
        {/* Address */}
        <div className="flex flex-col gap-4">
          <h5 className="font-bold">ที่อยู่ในใบกำกับภาษี</h5>
          <div className="flex items-center gap-2">
            {/* Zipcode */}
            <div className="flex flex-col gap-1">
              <label>
                รหัสไปรษณีย์<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={5}
                pattern="[0-9]*"
                className={`border  rounded-lg p-1 w-64 ${
                  errors.postalCode ? "border-red-500" : "border-gray-300"
                }`}
                value={payload.postalCode || ""}
                onChange={(e) => {
                  handlePostalChange(e.target.value);
                  // เคลียร์ error field 'postalCode'
                  setErrors((prev) => {
                    if (!prev.postalCode) return prev;
                    const next = { ...prev };
                    delete next.postalCode;
                    return next;
                  });
                }}
                placeholder="เช่น 10900"
              />
            </div>
            {/* Province */}
            <div className="flex flex-col gap-1">
              <label>จังหวัด</label>
              <select
                name="province"
                className={`border rounded-lg p-1 w-64 ${
                  errors.province ? "border-red-500" : "border-gray-300"
                }`}
                value={selectedProvinceId || ""}
                onChange={(e) => {
                  // logic เดิมของคุณ
                  handleProvinceChange(e.target.value);
                  // เคลียร์ error field 'province'
                  setErrors((prev) => {
                    if (!prev.province) return prev;
                    const next = { ...prev };
                    delete next.province;
                    return next;
                  });
                }}
              >
                <option value="">-- เลือกจังหวัด --</option>
                {provinces.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name_th}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* District */}
            <div className="flex flex-col gap-1">
              <label>อำเภอ / เขต</label>
              <select
                name="district"
                className={`border rounded-lg p-1 w-64 ${
                  errors.district ? "border-red-500" : "border-gray-300"
                }`}
                value={selectedDistrictId || ""}
                onChange={(e) => {
                  handleDistrictChange(e.target.value);
                  // เคลียร์ error field 'district'
                  setErrors((prev) => {
                    if (!prev.district) return prev;
                    const next = { ...prev };
                    delete next.district;
                    return next;
                  });
                }}
                disabled={!selectedProvinceId}
              >
                <option value="">
                  -- {isBangkok ? "เลือกเขต" : "เลือกอำเภอ"} --
                </option>
                {districtOptions.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name_th}
                  </option>
                ))}
              </select>
            </div>
            {/* Sub-district */}
            <div className="flex flex-col gap-1">
              <label>ตำบล / แขวง</label>
              <select
                name="subdistrict"
                className={`border rounded-lg p-1 w-64 ${
                  errors.subdistrict ? "border-red-500" : "border-gray-300"
                }`}
                value={
                  subDistrictOptions.find(
                    (s) => s.name_th === payload.subdistrict
                  )?.id || ""
                }
                onChange={(e) => {
                  handleSubDistrictChange(e.target.value);
                  // เคลียร์ error field 'subdistrict'
                  setErrors((prev) => {
                    if (!prev.subdistrict) return prev;
                    const next = { ...prev };
                    delete next.subdistrict;
                    return next;
                  });
                }}
                disabled={!selectedDistrictId}
              >
                <option value="">
                  -- {isBangkok ? "เลือกแขวง" : "เลือกตำบล"} --
                </option>
                {subDistrictOptions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name_th}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label>ที่อยู่</label>
            <textarea
              className={`border rounded-lg p-1 w-full h-24 ${
                errors.address ? "border-red-500" : "border-gray-300"
              }`}
              value={payload.address || ""}
              onChange={(e) => setField("address", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label>หมายเหตุ</label>
            <textarea
              className="border border-gray-300 rounded-lg p-1 w-full h-24"
              value={payload.remark || ""}
              onChange={(e) =>
                setPayload({ ...payload, remark: e.target.value })
              }
            />
          </div>
        </div>
      </div>
      <Divider flexItem sx={{ my: 1 }} />
      <div className="flex justify-between p-4">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="default"
            className={"cursor-pointer h-5 w-5"}
            checked={payload.isDefault || false}
            onChange={(e) =>
              setPayload({ ...payload, isDefault: e.target.checked })
            }
          />
          <label
            htmlFor="default"
            className={`${payload.isDefault ? "text-black" : "text-gray-400"}`}
          >
            ตั้งค่าที่อยู่เป็นค่าเริ่มต้น
          </label>
        </div>
        <button
          type="submit"
          className="bg-orange-500 text-white px-4 py-2 rounded"
          onClick={onSubmit}
        >
          บันทึกที่อยู่
        </button>
      </div>
    </div>
  );
}
