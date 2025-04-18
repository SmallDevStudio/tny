import { useRouter } from "next/router";
import DynamicPage from "@/components/Pages/DynamicPage";

export default function SubgroupCoursesPage() {
  const router = useRouter();
  const { group, subgroup } = router.query;
  return group && subgroup ? (
    <DynamicPage slugPath={["courses", group, subgroup]} />
  ) : null;
}
