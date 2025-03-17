import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import useLanguage from "@/hooks/useLanguage";
import { IoDesktopOutline } from "react-icons/io5";
import { CiMobile1 } from "react-icons/ci";
import { AiOutlineFullscreen, AiOutlineFullscreenExit } from "react-icons/ai";
import useDB from "@/hooks/useDB";

const TiptapEditor = dynamic(() => import("@/components/Tiptap/TiptapEditor"), { ssr: false });

export default function EditForm({ component, contentId }) {
  const [fullScreen, setFullScreen] = useState(false);
  const [previewMode, setPreviewMode] = useState("desktop"); // "desktop" หรือ "mobile"
  const { lang } = useLanguage();
  const [content, setContent] = useState(`<p>${lang["write_text"]}</p>`);
  const [loading, setLoading] = useState(false);
  const { update, getById} = useDB("components");

  useEffect(() => {
    const fetchData = async () => {
      if (!component) return;
      setLoading(true);
      try {
        const componentData = await getById(component);
        if (componentData) {
          // ถ้ามี `contentId` ใช้ path `contentId.content` 
          if (contentId && componentData[contentId]) {
            setContent(componentData[contentId].content || "");
          } else {
            setContent(componentData.content || "");
          }
        }
      } catch (err) {
        console.error("Error loading content:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [component, contentId]);

  const handleSave = async () => {
    if (!component) return;

    setLoading(true);
    try {
      const updatePath = contentId ? `${contentId}.content` : "content";
      await update(component, { [updatePath]: content });
      alert(lang["save_success"]);
    } catch (err) {
      console.error("Error saving content:", err);
      alert(lang["save_failed"]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen p-4">
      {/* Editor Section */}
      <div className="flex-1 overflow-auto max-h-[50%] border rounded-md p-2 shadow-md">
      {loading ? (
          <p className="text-center">{lang["loading"]}...</p>
        ) : (
          <>
            <TiptapEditor content={content} onChange={(newContent) => setContent(newContent)} />
            <div className="flex flex-row justify-end mt-4 gap-4">
              <button
                type="button"
                onClick={handleSave}
                disabled={loading}
                className={`px-4 py-2 rounded-md ${loading ? "bg-gray-400" : "bg-orange-500 hover:bg-orange-600"} text-white`}
              >
                {loading ? lang["saving"] : lang["save"]}
              </button>

              <button
                type="button"
                onClick={() => setContent("")}
                disabled={loading}
                className={`px-4 py-2 rounded-md ${loading ? "bg-gray-400" : "bg-red-500 hover:bg-red-600"} text-white`}
              >
                {loading ? lang["clearing"] : lang["clear"]}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Preview Section */}
      <div className="flex-1 overflow-auto max-h-[50%] mt-4 border rounded-md shadow-md bg-gray-600">
        {/* Toolbar */}
        <div className="flex justify-between items-center bg-white p-2 mb-2">
          <div className="flex gap-2">
            {/* Desktop Mode */}
            <button
              onClick={() => setPreviewMode("desktop")}
              className={`p-2 rounded-lg ${previewMode === "desktop" ? "bg-gray-700 text-white" : "bg-gray-500 text-white"}`}
            >
              <IoDesktopOutline size={24} />
            </button>

            {/* Mobile Mode */}
            <button
              onClick={() => setPreviewMode("mobile")}
              className={`p-2 rounded-lg ${previewMode === "mobile" ? "bg-gray-700 text-white" : "bg-gray-500 text-white"}`}
            >
              <CiMobile1 size={24} />
            </button>
          </div>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setFullScreen(true)}
            className="p-2 bg-gray-500 text-white rounded-lg"
          >
            <AiOutlineFullscreen size={24} />
          </button>
        </div>

        {/* Preview Content */}
        <div className="px-2">
            <div
            className={`border bg-white p-4 min-h-screen ${
                previewMode === "mobile" ? "w-[375px] mx-auto shadow-lg" : "w-full"
            }`}
            >
            <div dangerouslySetInnerHTML={{ __html: content }} />
            </div>
        </div>
      </div>

      {/* Fullscreen Popup */}
      {fullScreen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg w-[90%] h-[90%] p-4 flex flex-col">
            {/* Toolbar */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-2">
                {/* Desktop Mode */}
                <button
                  onClick={() => setPreviewMode("desktop")}
                  className={`p-2 rounded-lg ${previewMode === "desktop" ? "bg-gray-700 text-white" : "bg-gray-500 text-white"}`}
                >
                  <IoDesktopOutline size={24} />
                </button>

                {/* Mobile Mode */}
                <button
                  onClick={() => setPreviewMode("mobile")}
                  className={`p-2 rounded-lg ${previewMode === "mobile" ? "bg-gray-700 text-white" : "bg-gray-500 text-white"}`}
                >
                  <CiMobile1 size={24} />
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
                <div dangerouslySetInnerHTML={{ __html: content }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
