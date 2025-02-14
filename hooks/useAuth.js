import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSession } from "next-auth/react"; // ถ้าใช้ NextAuth

export default function useAuth(requiredRole) {
    const { data: session, status } = useSession(); // ✅ ใช้ NextAuth
    const router = useRouter();

    useEffect(() => {
        if (status === "loading") return; // รอโหลดข้อมูลก่อน

        // ✅ ถ้าไม่ได้ login หรือ role ไม่ตรง -> ไปหน้า 403
        if (!session || (requiredRole && session.user.role !== requiredRole)) {
            router.replace("/error/403");
        }
    }, [session, status, requiredRole, router]);

    return { session, isAuthenticated: !!session };
}
