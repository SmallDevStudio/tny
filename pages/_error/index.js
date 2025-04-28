import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Error({ statusCode }) {
  const router = useRouter();

  const isAdmin = router.pathname.includes("/admin");

  useEffect(() => {
    if (statusCode === 404) {
      router.replace("/_error/404");
    } else if (statusCode === 500) {
      router.replace("/_error/500");
    }
  }, [statusCode, router]);

  useEffect(() => {
    if (isAdmin && statusCode === 404) {
      router.replace("/_error/404");
    } else if (isAdmin && statusCode === 500) {
      router.replace("/_error/500");
    }
  }, [isAdmin, router, statusCode]);

  return <></>;
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};
