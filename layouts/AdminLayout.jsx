import { useState, useEffect } from "react";
import Sidebar from "@/components/Layouts/Admin/Sidebar";
import HeaderBar from "@/components/Layouts/Admin/HeaderBar";

export default function AdminLayout({ children }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true); // เมื่อ Component ถูกโหลดใน Client
    }, []);

    useEffect(() => {
        if (!isMounted) return; // หลีกเลี่ยงการทำงานใน Server

        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsCollapsed(true);
            } else {
                setIsCollapsed(false);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, [isMounted]);

    if (!isMounted) return null; // ป้องกัน Hydration Error โดยไม่แสดง UI จนกว่าจะโหลด Client

    return (
        <div className="admin-layout">
            <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
            <div className="main-container">
                <HeaderBar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
                <main className={`${isCollapsed ? "collapsed" : ""} main-content overflow-y-auto overflow-x-hidden p-4`}>
                    {children}
                </main>
            </div>
        </div>
    );
}
