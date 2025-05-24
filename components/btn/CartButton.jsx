// components/btn/CartButton.js
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { LuShoppingCart } from "react-icons/lu";
import Badge from "@mui/material/Badge";
import Tooltip from "@mui/material/Tooltip";

export default function CartButton({ size }) {
  const router = useRouter();
  const items = useSelector((state) => state.cart.items);

  return (
    <Tooltip title="Cart">
      <button
        onClick={() => router.push("/checkout")}
        className="text-gray-600 hover:text-orange-500 dark:text-white dark:hover:text-orange-500 relative"
      >
        <Badge badgeContent={items.length} color="primary">
          <LuShoppingCart size={size} />
        </Badge>
      </button>
    </Tooltip>
  );
}
