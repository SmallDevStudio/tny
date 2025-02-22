import { CircularProgress } from "@mui/material";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Loading() {
  const text = "Loading...";
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayText(text.substring(0, index + 1));
      index = (index + 1) % (text.length + 1);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-4 items-center justify-center h-screen relative">
      {/* Logo */}
      <div className="relative">
        <Image
          src="/images/logo/thenewyou_logo.jpeg"
          alt="Logo"
          width={100}
          height={100}
          className="mb-4 rounded-full animate-bounce"
          priority
        />
        {/* Shadow Effect */}
        <motion.div
          className="absolute bottom-[-10px] left-7 -translate-x-1/2 w-12 h-6 bg-black opacity-30 rounded-full blur-lg"
          animate={{
            scale: [1, 1.2, 1], // ขยับเงาตาม bounce
            opacity: [0.2, 0.3, 0.2], 
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
          }}
        />
      </div>

      {/* Loading Text */}
      <div className="flex text-2xl font-bold">
        {text.split("").map((char, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: index * 0.1,
              repeat: Infinity,
              repeatDelay: 1,
            }}
          >
            {char}
          </motion.span>
        ))}
      </div>
    </div>
  );
}
