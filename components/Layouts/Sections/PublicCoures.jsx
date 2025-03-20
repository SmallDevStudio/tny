import { useState, useEffect } from "react";
import useDB from "@/hooks/useDB";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { IoClose } from "react-icons/io5";
import { Tooltip } from "@mui/material";

export default function PublicCoures() {
  const [courses, setCourses] = useState([]);
  const router = useRouter();
  const { course } = useDB();

  return (
    <section className="bg-white dark:bg-gray-800">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center lg:mb-16 mb-8">
          <h2 className="mb-4 text-3xl lg:text-4xl tracking-tight font-extrabold text-gray-900 dark:text-orange-500">
            Public Courses
          </h2>
          {/*<p className="font-light text-gray-500 sm:text-xl dark:text-gray-400">We use an agile approach to test assumptions and connect with the needs of your audience early and often.</p>*/}
        </div>
      </div>
    </section>
  );
}
