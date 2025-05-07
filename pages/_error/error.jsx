import Image from "next/image";

export default function ErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Image src="/images/error.jpg" alt="404" width={500} height={500} />
    </div>
  );
}
