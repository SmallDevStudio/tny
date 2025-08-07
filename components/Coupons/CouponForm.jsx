import { useState, useEffect } from "react";
import { db } from "@/services/firebase";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import useLanguage from "@/hooks/useLanguage";
import { IoIosArrowBack } from "react-icons/io";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import th from "date-fns/locale/th";
registerLocale("th", th);
import { CiCalendar } from "react-icons/ci";
import { RiDeleteBin5Line } from "react-icons/ri";
import { toast } from "react-toastify";
import { Divider } from "@mui/material";
import { useSession } from "next-auth/react";

export default function CouponForm({ onClose }) {
  const [form, setForm] = useState({
    code: "",
    description: "",
    startDate: new Date(),
    expiryDate: new Date(),
  });
  const [conditions, setConditions] = useState({
    discount: "",
    discountUnit: "percent",
    oneTime: false,
    limitValue: "",
    firstTime: false,
  });
  const [loading, setLoading] = useState(false);
  const [isDiscount, setIsDiscount] = useState(false);
  const [isLimit, setIsLimit] = useState(false);

  const { lang } = useLanguage();
  const { data: session } = useSession();
  const userId = session?.user?.userId;

  const handleChangeCondition = (condition, value) => {
    setConditions((prev) => ({ ...prev, [condition]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newData = {
      ...form,
      startDate: form.startDate.toISOString(),
      expiryDate: form.expiryDate.toISOString(),
      conditions: {
        ...conditions,
        discount: isDiscount ? conditions.discount : null,
        discountUnit: isDiscount ? conditions.discountUnit : null,
        oneTime: conditions.oneTime || false,
        limitValue: isLimit ? conditions.limitValue : null,
      },
      active: true,
    };
    console.log("Submitting coupon data:", newData);
    try {
      setLoading(true);
      const couponRef = doc(collection(db, "coupons"));
      await setDoc(couponRef, {
        ...newData,
        createdBy: userId,
        createdAt: new Date().toISOString(),
      });
      toast.success("coupon_created_successfully");
      onClose();
    } catch (error) {
      console.error("Error creating coupon:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-[60vh] flex flex-col">
      {/* Header */}
      <div className="flex flex-row items-center mb-4 gap-2 bg-orange-500 text-white p-4">
        <IoIosArrowBack size={24} onClick={() => onClose()} />
        <span className="font-bold">{"สร้างคูปองใหม่"}</span>
      </div>
      {/* Form */}
      <div className="flex flex-col p-4 bg-white gap-2">
        <div className="flex items-center gap-2">
          <label htmlFor="code">Code:</label>
          <input
            type="text"
            id="code"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            placeholder="Enter coupon code"
          />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            placeholder="Enter coupon description"
            rows={3}
          />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="startDate">Start Date:</label>
          <DatePicker
            isClearable
            showIcon
            selected={form.startDate}
            onChange={(date) => setForm({ ...form, startDate: date })}
            locale="th"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            minDate={new Date()}
            icon={<CiCalendar />}
            dateFormat={"dd/MM/yyyy"}
          />
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="expiryDate">Expiry Date:</label>
          <DatePicker
            isClearable
            showIcon
            selected={form.expiryDate}
            onChange={(date) => setForm({ ...form, expiryDate: date })}
            locale="th"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            minDate={form.startDate}
            icon={<CiCalendar />}
            dateFormat={"dd/MM/yyyy"}
          />
        </div>

        <div className="flex flex-col gap-2 border rounded-lg p-2">
          <span>Condition</span>
          <Divider />
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="discount"
                id="discount"
                onChange={(e) => setIsDiscount(e.target.checked)}
                checked={isDiscount}
              />
              <label htmlFor="discount">ส่วนลด</label>
              {isDiscount && (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    checked={conditions.discount}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-20 p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    onChange={(e) =>
                      handleChangeCondition("discount", e.target.value)
                    }
                    placeholder="ส่วนลด"
                  />
                  <select
                    name="discountUnit"
                    id="discountUnit"
                    className=" bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-20 p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    onChange={(e) =>
                      handleChangeCondition("discountUnit", e.target.value)
                    }
                    value={conditions.discountUnit || "percent"}
                  >
                    <option value="percent">%</option>
                    <option value="amount">฿</option>
                  </select>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="limit"
                id="limit"
                onChange={() => setIsLimit(!isLimit)}
                checked={isLimit}
              />
              <label htmlFor="limit">จำกัดคูปอง</label>
              {isLimit && (
                <input
                  type="number"
                  value={conditions.limitValue || ""}
                  onChange={(e) =>
                    handleChangeCondition("limitValue", e.target.value)
                  }
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-40 p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="จำนวนคูปองที่ใช้ได้"
                />
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="oneTime"
                id="oneTime"
                checked={conditions.oneTime}
                onChange={(e) =>
                  handleChangeCondition("oneTime", e.target.checked)
                }
              />
              <label htmlFor="oneTime">ใช้ได้ครั้งเดียว</label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="firstTime"
                id="firstTime"
                checked={conditions.firstTime}
                onChange={(e) =>
                  handleChangeCondition("firstTime", e.target.checked)
                }
              />
              <label htmlFor="firstTime">สำหรับลูกค้าใหม่</label>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-4">
          <button
            type="submit"
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
            onClick={handleSubmit}
          >
            {lang["save"]}
          </button>
          <button
            type="button"
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 ml-2"
            onClick={() => onClose()}
          >
            {lang["cancel"]}
          </button>
        </div>
      </div>
    </div>
  );
}
