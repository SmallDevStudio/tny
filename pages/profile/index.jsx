import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function Profile() {
    const { data: session, status, trigger } = useSession();
    return (
        <div>
            <h1>Profile</h1>
        </div>
    );
}