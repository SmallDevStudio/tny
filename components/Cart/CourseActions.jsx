// components/CourseActions.js
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { addToCart, clearCart } from "@/store/slices/cartSlice";
import { FaCartPlus } from "react-icons/fa6";
import { FaCartShopping } from "react-icons/fa6";

export default function CourseActions({ course }) {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        courseId: course.id,
        title: course.name,
        price: course.price,
        image: course.image || "",
      })
    );
  };

  const handleBuyNow = () => {
    dispatch(clearCart()); // ✅ ล้าง cart ก่อน
    dispatch(
      addToCart({
        courseId: course.id,
        title: course.name,
        price: course.price,
        image: course.image || "",
      })
    );
    router.push("/checkout");
  };

  return (
    <div className="flex gap-4">
      <button
        onClick={handleAddToCart}
        className="flex items-center justify-center gap-2 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 h-10"
      >
        <FaCartPlus size={20} /> Add to Cart
      </button>
      <button
        onClick={handleBuyNow}
        className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 h-10"
      >
        <FaCartShopping /> Buy Now
      </button>
    </div>
  );
}
