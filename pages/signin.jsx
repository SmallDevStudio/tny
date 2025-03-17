import { useState } from "react";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { Divider } from "@mui/material";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks/useAuth";

export async function getStaticProps() {
    return {
        props: {
            title: "Sign In",
            description: "เข้าสู่ระบบ The New You Academy"
        }
    };
}

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const { loginWithGoogle, loginWithEmail } = useAuth();

    const handleSignIn = async () => {
        await loginWithEmail(email, password);
    };

    const handleGoogleSignIn = async () => {
        await loginWithGoogle();
    };

    return (
        <div className="signin-container max-h-screen">
            <div className="flex flex-col justify-center xl:w-1/4 lg:w-1/4 md:w-1/3 sm:w-1/2">
                {/* Header */}
                <div className="flex flex-col w-full mb-2">
                    <span className="text-3xl text-white font-bold">The New You</span>
                </div>

                {/* Body */}
                <div className="flex flex-col border text-black border-gray-200 rounded-xl w-full text-sm p-4 mt-2 shadow-xl bg-white">
                    <div className="flex flex-col w-full">
                        <span className="flex text-2xl text-black font-bold mb-1">เข้าสู่ระบบ</span>
                        <span className="flex text-xs text-gray-500">เข้าสู่ระบบโดยใช้ชื่อผู้ใช้และรหัสผ่าน หรือ ลงทะเบียน</span>
                        <button 
                            className="flex text-sm text-[#FFA500] font-bold mt-1 cursor-pointer"
                            onClick={() => router.push("/register")}
                        >
                            สมัครสมาชิก
                        </button>
                    </div>

                    <Divider flexItem sx={{ width: "100%", marginBottom: 2, marginTop: 1 }} />

                    <div className="flex flex-col w-full gap-2">
                        <div className="flex flex-col items-start gap-1 w-full">
                            <label htmlFor="username" className="font-bold col-span-1">
                                ชื่อผู้ใช้:
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                placeholder="กรอกชื่อผู้ใช้"
                                className="col-span-3 border border-gray-200 rounded-xl w-full px-4 py-2"
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                            />
                        </div>

                        {/* ✅ Input Password พร้อมปุ่ม Eye */}
                        <div className="flex flex-col items-start gap-1 mt-2 w-full relative">
                            <label htmlFor="password" className="font-bold col-span-1">
                                รหัสผ่าน:
                            </label>
                            <div className="relative w-full">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    placeholder="กรอกรหัสผ่าน"
                                    className="border border-gray-200 rounded-xl w-full px-4 py-2 pr-10"
                                    onChange={(e) => setPassword(e.target.value)}
                                    value={password}
                                />
                                {/* ✅ ปุ่ม Toggle Eye */}
                                <span
                                    className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 mt-2 ml-2 w-full">
                        <div className="flex flex-row justify-between items-center text-sm col-span-3">
                            <div className="flex flex-row items-center gap-2">
                                <input type="checkbox" name="remember" id="remember" />
                                <label htmlFor="remember" className="text-xs text-gray-500">
                                    จดจํา
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col justify-center w-full mt-4">
                        <button 
                            type="submit" 
                            className="bg-[#FFA500] text-white font-bold py-2 px-4 rounded-xl w-full h-12"
                            onClick={handleSignIn}
                        >
                            เข้าสู่ระบบ
                        </button>
                        <div className="flex justify-end mt-1 w-full">
                            <span className="text-[#FFA500] text-xs cursor-pointer">ลืม Password?</span>
                        </div>
                    </div>

                    <Divider variant="middle" flexItem sx={{ my: 2 }} className="text-[#FFA500] font-bold" >
                        OR
                    </Divider>

                    <div className="flex flex-col justify-center w-full mt-4 mb-4 gap-2">
                        <button
                            type="submit"
                            className="bg-white text-black border border-gray-700 font-bold py-2 px-4 rounded-xl w-full"
                            onClick={() => signIn("google")}
                        >
                            <div 
                                className="flex flex-row justify-center items-center gap-2"
                            >
                                <Image src="/images/logo/googlelightx4.png" alt="Google Logo" width={30} height={30} />
                                <span>Sign In with Google</span>
                            </div>
                        </button>

                        
                    </div>
                </div>

                {/* Footer */}
                <div className="flex flex-col justify-center items-center text-xs text-gray-50 letter-spacing-1 w-full mt-5 gap-2">
                    <span className="letter-spacing-1">Copyright &copy; 2025 <strong onClick={() => router.push("/")} className="cursor-pointer">The New You Academy.</strong> All rights reserved.</span>
                    <span className="letter-spacing-1 mt-[-5px]">Version: {process.env.NEXT_PUBLIC_APP_VERSION}</span>
                </div>
            </div>
        </div>
    );
}
