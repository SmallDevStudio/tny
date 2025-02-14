import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { signOut } from 'next-auth/react'

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  console.log(session?.user);
  console.log('account', session?.account);

  if (!session) {
    return (
      <div className="flex flex-col">
        <span>HOME</span>
        <button onClick={() => router.push("/signin")}>Sign In</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <span>THE NEW YOU</span>
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  )
}
