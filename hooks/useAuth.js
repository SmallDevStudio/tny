import { auth, db } from "../services/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../store/slices/userSlice";
import { signIn } from "next-auth/react";

export const useAuth = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);

    // ✅ Login ผ่าน Email & Password
    const loginWithEmail = async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const userData = await getUserData(userCredential.user.uid);

            dispatch(login(userData)); // 🔥 อัปเดต Redux Store
            return userData;
        } catch (error) {
            console.error("Login failed:", error.message);
            return null;
        }
    };

    // ✅ Register (สร้างบัญชีใหม่)
    const registerWithEmail = async (email, password, name) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const userData = {
                userId: user.uid,
                email: user.email,
                name,
                authProvider: "email",
                createdAt: Date.now(),
            };

            await setDoc(doc(db, "users", user.uid), userData);
            dispatch(login(userData)); // 🔥 อัปเดต Redux Store

            return userData;
        } catch (error) {
            console.error("Register failed:", error.message);
            return null;
        }
    };

    // ✅ Login ผ่าน Google
    const loginWithGoogle = async () => {
        const response = await signIn("google", { redirect: false });
        if (response?.error) {
            console.error("Google Login failed:", response.error);
            return null;
        }
    };

    // ✅ Logout
    const logoutUser = async () => {
        await signOut(auth);
        dispatch(logout()); // 🔥 เคลียร์ Redux Store
    };

    // ✅ ดึงข้อมูล User จาก Firestore
    const getUserData = async (userId) => {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);
        return userSnap.exists() ? { id: userSnap.id, ...userSnap.data() } : null;
    };

    return { user, loginWithEmail, registerWithEmail, loginWithGoogle, logoutUser, getUserData };
};
