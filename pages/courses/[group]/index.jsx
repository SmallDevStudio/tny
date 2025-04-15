import { useRouter } from "next/router";
import DynamicPage from "@/components/pages/DynamicPage";

export default function GroupCoursesPage() {
  const router = useRouter();
  const { group } = router.query;
  return group ? <DynamicPage slugPath={["courses", group]} /> : null;
}
