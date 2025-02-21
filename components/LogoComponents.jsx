import { useRouter } from "next/router";
import Image from "next/image";

export default function LogoComponents({ size }) {
    const router = useRouter();
    return (
        <div className="flex flex-col items-center">
            <Image 
                src="/images/logo/thenewyou_logo.jpeg" 
                alt="Logo" 
                width={size} 
                height={size}
                onClick={() => router.push("/")}
                className="cursor-pointer rounded-full"
                priority
            />
            {/*
            <span className="self-center text-orange-500 text-xl font-semibold whitespace-nowrap">The New You</span>
            <span className="self-center text-xl whitespace-nowrap dark:text-white">Academy</span>
            */}
        </div>
    );
}