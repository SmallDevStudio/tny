import Link from "next/link";

export default function ServerErrorPage() {
    return (
        <div className="error-container">
            <h1>500</h1>
            <p>เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์</p>
            <Link href="/" className="error-btn">กลับไปหน้าแรก</Link>
        </div>
    );
}
