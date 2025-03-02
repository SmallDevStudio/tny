import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

// ✅ สร้าง Middleware สำหรับตรวจสอบการ Login
export async function middleware(req) {
    const token = await getToken({ req });

    const { pathname } = req.nextUrl;

    // ✅ ตรวจสอบเส้นทางที่ต้องการบังคับให้ Login
    const protectedPaths = ["/profile", "/member"];
    const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path));

    // ✅ ตรวจสอบเส้นทางที่ต้องการให้เฉพาะ `admin`
    const adminPaths = ["/admin"];
    const isAdminPath = adminPaths.some((path) => pathname.startsWith(path));

    // ✅ ถ้าเป็นเส้นทางที่ต้อง Login แต่ไม่มี Token -> Redirect ไปหน้า Sign In
    if (isProtectedPath && !token) {
        return NextResponse.redirect(new URL("/signin", req.url));
    }

    // ✅ ถ้าเป็นเส้นทางของ `/admin`
    if (isProtectedPath && !token) {
        return NextResponse.redirect(new URL("/signin", req.url));
    }

        // 🔹 ถ้าเป็นเส้นทางของ `/admin`
    if (isAdminPath && token?.user.role !== "admin") {
        return NextResponse.redirect(new URL("/error/403", req.url));
    }

    // ✅ อนุญาตให้เข้าถึงหน้าปกติได้
    return NextResponse.next();
}

// ✅ ตั้งค่า matcher
export const config = {
    matcher: [
        "/profile",
        "/profile/:path*",
        "/member",
        "/member/:path*",
        "/admin",
        "/admin/:path*",
    ],
};
