"use client";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import dynamic from "next/dynamic";
import { FaDesktop, FaMobileAlt } from "react-icons/fa";
import { AiOutlineRotateLeft, AiOutlineRotateRight, AiOutlineFullscreen, AiOutlineFullscreenExit } from "react-icons/ai";

export default function Preview({ data, Component, lang }) {
    const [previewMode, setPreviewMode] = useState("desktop");
    const [rotateMode, setRotateMode] = useState(false);
    const [fullScreen, setFullScreen] = useState(false);

    const isMobile = useMediaQuery({ query: "(max-width: 368px)" });

    return (
        <div className="bg-white dark:bg-gray-800">
            <div className="flex flex-col items-center mx-auto max-w-screen-2xl border border-gray-200 dark:border-gray-700 rounded-lg">
                {/* 🔥 ปุ่มเลือกโหมด */}
                <div className="flex flex-row bg-gray-100 dark:bg-gray-800 items-center p-2 w-full">
                    <div className="flex justify-center gap-1">
                        <button
                            className={`px-4 py-2 rounded-md font-bold transition ${
                                previewMode === "desktop" ? "bg-blue-500 text-white" : "bg-gray-300 dark:bg-gray-700"
                            }`}
                            onClick={() => setPreviewMode("desktop")}
                        >
                            <FaDesktop /> 
                        </button>

                        <button
                            className={`px-4 py-2 rounded-md font-bold transition ${
                                fullScreen ? "bg-blue-500 text-white" : "bg-gray-300 dark:bg-gray-700"
                            }`}
                            onClick={() => setFullScreen(true)}
                        >
                            <AiOutlineFullscreen size={24} />
                        </button>

                    </div>
                </div>

                {/* 🔥 Preview Section */}
                <div className="flex justify-center bg-gray-700 items-center w-full overflow-hidden">
                    {previewMode === "desktop" ? (
                        <div className="flex w-full items-center justify-center">
                            <Component data={data} lang={lang} />
                        </div>
                    ): (
                        <div className="flex mx-auto">
                            <Component data={data} lang={lang} />
                        </div>
                    )}
                </div>

            </div>

            {fullScreen && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex justify-center items-center"
                    style={{ zIndex: 9999 }}
                >
                    <div className="bg-white rounded-lg w-[90%] h-[90%] p-4 flex flex-col">
                    {/* Toolbar */}
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex gap-2">
                            {/* Desktop Mode */}
                            <button
                              onClick={() => setPreviewMode("desktop")}
                              className={`p-2 rounded-lg ${previewMode === "desktop" ? "bg-gray-700 text-white" : "bg-gray-500 text-white"}`}
                            >
                              <FaDesktop size={24} />
                            </button>
            
                            {/* Mobile Mode */}
                            <button
                              onClick={() => setPreviewMode("mobile")}
                              className={`p-2 rounded-lg ${previewMode === "mobile" ? "bg-gray-700 text-white" : "bg-gray-500 text-white"}`}
                            >
                              <FaMobileAlt size={24} />
                            </button>
                          </div>
            
                          {/* Exit Fullscreen */}
                          <button
                            onClick={() => setFullScreen(false)}
                            className="p-2 bg-red-500 text-white rounded-lg"
                          >
                            <AiOutlineFullscreenExit size={24} />
                          </button>
                        </div>
            
                        {/* Fullscreen Preview */}
                        <div className="flex-1 overflow-auto border bg-gray-100 p-4 rounded-md">
                          <div
                            className={`border bg-white rounded-md p-4 ${
                              previewMode === "mobile" ? "w-[375px] mx-auto shadow-lg" : "w-full"
                            }`}
                          >
                                <Component data={data} lang={lang} />
                          </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
