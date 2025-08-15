import { useState, useEffect } from "react";
import useDB from "@/hooks/useDB";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { IoClose } from "react-icons/io5";
import { Tooltip } from "@mui/material";

export default function Video({ data, onProcess, onRemove, onClose }) {
  const [video, setVideo] = useState([]);
  const { t, lang } = useDB();
  const router = useRouter();

  const handleUpload = (video) => {
    setVideo((prev) => [...prev, ...video]);
  };

  const handleRemove = (index) => {
    setVideo((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div></div>

      {/* Body */}
      <div></div>
    </div>
  );
}
