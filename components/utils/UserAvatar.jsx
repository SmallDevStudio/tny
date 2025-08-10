import { Avatar } from "@mui/material";
import Image from "next/image";

export default function UserAvatar({ user, size }) {
  return (
    <Image
      src={user?.image || "/default-avatar.png"}
      alt={user.name}
      width={size}
      height={size}
      className="rounded-full"
    />
  );
}
