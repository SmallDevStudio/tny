import { useState } from "react";
import axios from "axios";

export async function getStaticProps() {
    return {
        props: {
            title: "Dashboard",
            description: "จัดการคอร์สเรียนและผู้ใช้ผ่านระบบแอดมินของ The New You Academy"
        }
    };
}

export default function Admin() {
    return (
        <div>
            <span>Admin</span>
        </div>
    )
}