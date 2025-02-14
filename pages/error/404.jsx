import Link from "next/link";

export default function NotFoundPage() {
    return (
        <div className="error-container">
            <h1>404</h1>
            <p>ขออภัย! ไม่พบหน้าที่คุณต้องการ</p>
            <Link href="/" className="error-btn">กลับไปหน้าแรก</Link>
        </div>
    );
}
