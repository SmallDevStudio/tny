"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { signUpWithEmail } from "@/services/signUpWithEmail";
import { db } from "@/services/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import useNewLetter from "@/hooks/useNewLetter";

export default function registerPage() {
    const [forms, setForms] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [passwordStrength, setPasswordStrength] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
    });
    const [errors, setErrors] = useState({});

    const { createUserNewsletterSubscription } = useNewLetter();

    const router = useRouter();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForms({
            ...forms,
            [name]: type === "checkbox" ? checked : value,
        });

        // ✅ ตรวจสอบเงื่อนไข Password
        if (name === "password") {
            setPasswordStrength({
                length: value.length >= 8,
                uppercase: /[A-Z]/.test(value),
                lowercase: /[a-z]/.test(value),
                number: /\d/.test(value),
            });
        }
    };

    const validateForm = () => {
        let newErrors = {};

        // ✅ ตรวจสอบ Name
        if (!forms.name.trim()) {
            newErrors.name = "กรุณากรอกชื่อ-นามสกุล";
        }

        // ✅ ตรวจสอบ Email
        if (!forms.email.includes("@")) {
            newErrors.email = "กรุณากรอกอีเมลให้ถูกต้อง";
        }

        // ✅ ตรวจสอบ Password
        if (!passwordStrength.length || !passwordStrength.uppercase || !passwordStrength.lowercase || !passwordStrength.number) {
            newErrors.password = "รหัสผ่านไม่ตรงตามเงื่อนไข";
        }

        if (forms.password !== forms.confirmPassword) {
            newErrors.confirmPassword = "รหัสผ่านไม่ตรงกัน";
        }

        // ✅ ตรวจสอบ Phone (ถ้ามีการกรอก)
        if (forms.phone) {
            if (!/^\d{10}$/.test(forms.phone)) {
                newErrors.phone = "เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก";
            }
        }

        // ✅ ตรวจสอบ Agreement
        if (!forms.agreement) {
            newErrors.agreement = "คุณต้องยอมรับข้อตกลงก่อนสมัครสมาชิก";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            alert("กรุณากรอกข้อมูลให้ครบถ้วน");
            return;
        }

        const { name, email, password, phone, address } = forms;
        const userRegister = await signUpWithEmail(email, password);

        if (userRegister) {
            const userId = userRegister.userId;
            const newUser = {
                userId,
                name,
                email,
                phone,
                address,
                googleId: null,
                lineId: null,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }
            const userRef = doc(db, "users", userId);
            await setDoc(userRef, newUser);
            await createUserNewsletterSubscription(email, userId);
            
            toast.success("สมัครสมาชิกสําเร็จ");
            router.push("/login");
        } else {
            toast.error("สมัครสมาชิกไม่สําเร็จ");
        }
    };

    return (
        <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8 register-container">
            <div className="flex flex-col w-full max-w-md space-y-4">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
                        สมัครสมาชิก
                    </h2>
                </div>
                
                <form className="flex flex-col mt-4 text-black bg-white gap-2 border border-gray-300 p-4 rounded-md shadow-xl" onSubmit={handleSubmit}>
                    <div className="flex flex-col items-center justify-center w-full">
                        <div className="flex bg-gray-100 border border-gray-300 rounded-full w-[100px] h-[100px]">
                            <Image
                                src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                                alt="Default Profile"
                                className="w-full h-full object-cover rounded-full"
                                width={100}
                                height={100}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col text-sm gap-2">
                        <div className="flex flex-col">
                            <label htmlFor="name" className=" text-black font-semibold">
                                ชื่อ-นามสกุล:<span className="text-red-500">*</span>
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                autoComplete="name"
                                placeholder="กรอกชื่อ-นามสกุล"
                                required
                                value={forms.name}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300
                                ${errors && errors.name ? "border-red-500" : "border-gray-300"}`}
                            />
                            {errors && errors.name && <span className="text-xs text-red-500">{errors.name}</span>}
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="email-address" className=" text-black font-semibold">
                                อีเมล:<span className="text-red-500">*</span>
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                placeholder="กรอกอีเมล"
                                required
                                value={forms.email}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300
                                ${errors && errors.email ? "border-red-500" : "border-gray-300"}`}
                            />
                            {errors && errors.email && <span className="text-xs text-red-500">{errors.email}</span>}
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="password" className=" text-black font-semibold">
                                รหัสผ่าน:<span className="text-red-500">*</span>
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                placeholder="กรอกรหัสผ่าน"
                                required
                                value={forms.password}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300
                                ${errors && errors.password ? "border-red-500" : errors.confirmPassword ? "border-red-500" : "border-gray-300"}}`}
                            />
                            <ul className="text-xs">
                                <li style={{ color: passwordStrength.length ? "green" : "red" }}>ความยาว ≥ 8 ตัว</li>
                                <li style={{ color: passwordStrength.uppercase ? "green" : "red" }}>มีตัวอักษรพิมพ์ใหญ่</li>
                                <li style={{ color: passwordStrength.lowercase ? "green" : "red" }}>มีตัวอักษรพิมพ์เล็ก</li>
                                <li style={{ color: passwordStrength.number ? "green" : "red" }}>มีตัวเลข</li>
                            </ul>
                            {errors && errors.password && <span className="text-xs text-red-500">{errors.password}</span>}
                            {errors && errors.confirmPassword && <span className="text-xs text-red-500">{errors.confirmPassword}</span>}
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="confirm-password" className="text-black font-semibold">
                                ยืนยันรหัสผ่าน
                            </label>
                            <input
                                id="confirm-password"
                                name="confirmPassword"
                                type="password"
                                autoComplete="new-password"
                                placeholder="ยืนยันรหัสผ่าน"
                                required
                                value={forms.confirmPassword}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300
                                ${errors && errors.confirmPassword ? "border-red-500" : "border-gray-300"}`}
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="phone-number" className=" text-black font-semibold">
                                เบอร์โทรศัพท์:
                            </label>
                            <input
                                id="phone-number"
                                name="phone-number"
                                type="tel"
                                autoComplete="tel"
                                placeholder="กรอกเบอร์โทรศัพท์"
                                value={forms.phone}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300
                                ${errors && errors.phone ? "border-red-500" : "border-gray-300"}`}
                            />
                            {errors && errors.phone && <span className="text-xs text-red-500">{errors.phone}</span>}
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="address" className=" text-black font-semibold">
                                ที่อยู่:
                            </label>
                            <textarea
                                id="address"
                                name="address"
                                type="text"
                                autoComplete="address"
                                placeholder="กรอกที่อยู่"
                                rows={4}
                                value={forms.address}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
                            />
                        </div>

                        <div className="flex flex-row items-baseline gap-2 text-sm mt-2">
                            <input 
                                type="checkbox"
                                name="agreement"
                                checked={forms.agreement}
                                onChange={handleChange}
                                className={`flex border rounded-md focus:ring ${
                                    errors.agreement ? "border-red-500 ring-red-500" : "border-gray-300 ring-blue-300"
                                }`}
                            />
                            <div className="block flex-col items-baseline">
                                <span className="font-semibold">ยอมรับข้อตกลง และเงื่อนไข</span>
                                <p>คุณต้องยอมรับ
                                    <span className="text-[#FFA500] mx-1 cursor-pointer">ข้อตกลง</span>
                                    และ
                                    <span className="text-[#FFA500] mx-1 cursor-pointer">เงื่อนไขเพื่อสมัครสมาชิก</span>
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-row items-center gap-2 text-sm">
                            <input 
                                type="checkbox"
                                name="newsletter"
                                value={forms.newsletter}
                                onChange={handleChange}
                                className="flex border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
                            />
                            <div className="flex flex-col">
                                <span className="font-light">ต้องการรับข่าวสารจาก <span className="text-[#FFA500] mx-1 font-medium">The New You Academy</span></span>
                            </div>
                        </div>

                    </div>

                    

                    <div className="flex flex-col mt-2">
                        <button
                            type="submit"
                            className="w-full px-4 py-2 text-white bg-[#FFA500] mt-2 font-bold rounded-md hover:bg-[#ff8c00] transition"
                        >
                            สมัครสมาชิก
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
