import { useState, useEffect } from "react";
import axios from "axios";

export default function Footer() {
    return (
        <footer className="py-4">
            <div className="mx-auto text-center">
                <p>&copy; 2025 The New You Academy. All rights reserved.</p>
            </div>
        </footer>
    );
}