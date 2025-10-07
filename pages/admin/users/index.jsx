import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { db } from "@/services/firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import useDB from "@/hooks/useDB";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export default function Users() {
  const [users, setUsers] = useState([]);
  const router = useRouter();
  const { getAll, subscribe } = useDB("users");

  useEffect(() => {
    const fetchUsers = async () => {
      await subscribe((items) => {
        setUsers(items);
      });
    };

    fetchUsers();
  }, []);

  {
    /***************************************** 
     ============ Role Management ============
     *** admin
     *** editor

     *** user
     *** member
    *******************************************/
  }

  const handleUpdateRole = async (id, role) => {
    const confirmResult = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update it!",
    });
    if (confirmResult.isConfirmed) {
      try {
        const userRef = doc(db, "users", id);
        await updateDoc(userRef, { role: role });
        toast.success("Role updated successfully");
      } catch (error) {
        toast.error("Failed to update role");
        console.error("Error updating role:", error);
      }
    }
  };

  const handleDeleteUser = async (id) => {
    const confirmResult = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });
    if (confirmResult.isConfirmed) {
      try {
        const userRef = doc(db, "users", id);
        await deleteDoc(userRef);
        toast.success("User deleted successfully");
      } catch (error) {
        toast.error("Failed to delete user");
        console.error("Error deleting user:", error);
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800">
      <h1 className="text-xl font-bold text-gray-900 dark:text-white">Users</h1>
      {/* toolbar */}
      <div></div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full mt-4 text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-2">
                Name
              </th>
              <th scope="col" className="px-6 py-2">
                Email
              </th>
              <th scope="col" className="px-6 py-2">
                Role
              </th>
              <th scope="col" className="px-6 py-2">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 overflow-y-auto">
            {users.map((user) => (
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <th
                  scope="row"
                  className="px-6 py-1 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {user.name}
                </th>
                <td className="px-6 py-1">{user.email}</td>
                <td className="px-6 py-1">
                  <select
                    name="role"
                    className="px-2 py-1 border rounded-md"
                    onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                    value={user.role}
                  >
                    <option value="admin">Admin</option>
                    <option value="editor">Editor</option>
                    <option value="user">User</option>
                    <option value="member">Member</option>
                  </select>
                </td>
                <td className="px-6 py-1">
                  <a
                    href="#"
                    className="font-medium text-red-600 dark:text-red-500 hover:underline ml-4"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    Delete
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
