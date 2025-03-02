import { createUserWithEmailAndPassword } from "firebase/auth";
import { db, auth } from "./firebase";
import { collection, addDoc } from "firebase/firestore";
import generateId from "./generateId";

export async function signUpWithEmail(email, password) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const newUserId = await generateId();
    const userProviderRef = collection(db, "userProviders");

    await addDoc(userProviderRef, {
        userId: newUserId,
        credentialId: user.uid,
        provider: "email",
        createdAt: new Date().toISOString()
    });

    return { user, userId: newUserId };
};