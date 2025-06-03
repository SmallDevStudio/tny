import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Loading from "@/components/utils/Loading";
import useLanguage from "@/hooks/useLanguage";
import moment from "moment";
import "moment/locale/th";
import dynamic from "next/dynamic";

const ClientOnlyContent = dynamic(
  () => import("@/components/utils/ClientOnlyContent"),
  { ssr: false }
);

moment.locale("th");
export default function Contents({ pageData }) {
  const [content, setContent] = useState({});
  const router = useRouter();
  const { t, lang } = useLanguage();

  useEffect(() => {
    if (pageData) {
      setContent(pageData.content);
      return;
    } else {
      setContent({});
      return;
    }
  }, [pageData]);

  return (
    content && (
      <div className="px-4 py-6 mb-4">
        <div className="mx-auto max-w-screen-sm lg:max-w-screen-lg">
          <ClientOnlyContent className="preview-box" html={t(content)} />
        </div>
      </div>
    )
  );
}
