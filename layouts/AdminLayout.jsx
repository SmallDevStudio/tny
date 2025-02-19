import { useState, useEffect } from "react";
import Sidebar from "@/components/Layouts/Admin/Sidebar";
import HeaderBar from "@/components/Layouts/Admin/HeaderBar";

export default function AdminLayout({ children }) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsCollapsed(true);
            } else {
                setIsCollapsed(false);
            }
        };

        handleResize(); // เรียกใช้งานครั้งแรก
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

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
