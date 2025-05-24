import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  decreaseQuantity,
  removeFromCart,
} from "@/store/slices/cartSlice";

const CourseCartControl = ({ course }) => {
  const dispatch = useDispatch();
  const item = useSelector((state) =>
    state.cart.items.find((i) => i.courseId === course.id)
  );

  return (
    <div className="flex items-center space-x-2">
      {item ? (
        <>
          <button
            onClick={() => dispatch(decreaseQuantity({ courseId: course.id }))}
            className="bg-gray-300 px-2 py-1 rounded"
          >
            -
          </button>
          <span>{item.quantity}</span>
          <button
            onClick={() =>
              dispatch(
                addToCart({
                  courseId: course.id,
                  title: course.title,
                  price: course.price,
                  image: course.image,
                })
              )
            }
            className="bg-gray-300 px-2 py-1 rounded"
          >
            +
          </button>
          <button
            onClick={() => dispatch(removeFromCart({ courseId: course.id }))}
            className="text-red-500 text-sm ml-2"
          >
            ลบ
          </button>
        </>
      ) : (
        <button
          onClick={() =>
            dispatch(
              addToCart({
                courseId: course.id,
                title: course.title,
                price: course.price,
                image: course.image,
              })
            )
          }
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          เพิ่มในตะกร้า
        </button>
      )}
    </div>
  );
};

export default CourseCartControl;
