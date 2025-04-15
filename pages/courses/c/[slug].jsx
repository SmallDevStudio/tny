import { useRouter } from "next/router";
import DynamicPage from "@/components/pages/DynamicPage";

export default function CourseSlugPage() {
  const router = useRouter();
  const { slug } = router.query;
  return slug ? <DynamicPage slugPath={["courses", "c", slug]} /> : null;
}
