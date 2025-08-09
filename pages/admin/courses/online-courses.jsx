import React, { useState, useEffect } from "react";
import useDB from "@/hooks/useDB";
import useLanguage from "@/hooks/useLanguage";
import { useRouter } from "next/router";
import { DataGrid } from "@mui/x-data-grid";
import { Dialog, Slide, Tooltip } from "@mui/material";
import { toast } from "react-toastify";
import SearchBar from "@/components/Bar/SearchBar";
import Swal from "sweetalert2";
import CoursesOnlineForm from "@/components/Courses/CoursesOnlineForm";
import moment from "moment";
import "moment/locale/th";
import { FaEdit, FaTrashAlt, FaEye } from "react-icons/fa";
import { db } from "@/services/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  setDoc,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";

moment.locale("th");

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AdminCoursesOnline() {
  const [courses, setCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState(null);
  const [filterCourses, setFilterCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const { lang, t } = useLanguage();
  const { subscribe, getAll, add, update, remove } = useDB("courses-online");

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = subscribe((coursesData) => {
      if (coursesData) {
        const sorted = coursesData.sort(
          (a, b) => (a.order ?? 9999) - (b.order ?? 9999)
        );
        setCourses(sorted);
        setFilterCourses(sorted);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (search) {
      const filtered = courses.filter(
        (course) =>
          course.name.en.toLowerCase().includes(search.toLowerCase()) ||
          course.name.th.toLowerCase().includes(search.toLowerCase()) ||
          course.description.en.toLowerCase().includes(search.toLowerCase()) ||
          course.description.th.toLowerCase().includes(search.toLowerCase())
      );
      setFilterCourses(filtered);
    } else {
      setFilterCourses(courses);
    }
  }, [search, courses]);

  const handleOpenForm = () => {
    setSelectedCourses(null);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setSelectedCourses(null);
    setOpenForm(false);
  };

  const handleEdit = (course) => {
    setSelectedCourses(course);
    setOpenForm(true);
  };

  const handleUpdateActive = async (active, id) => {
    try {
      await update(id, { active: !active }); // Toggle active status
      toast.success(lang["course_updated_successfully"]); // Show success toast message
    } catch (error) {
      console.error(error);
      toast.error(lang["update_failed"]); // Show error toast message
    }
  };

  const handleDelete = (course) => {
    Swal.fire({
      title: lang["are_you_sure"],
      text: lang["you_wont_be_able_to_revert_this"],
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: lang["yes_delete_it"],
      cancelButtonText: lang["cancel"],
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await remove(course.id.toString());
          toast.success(lang["deleted_successfully"]);
        } catch (error) {
          console.error(error);
          toast.error(lang["delete_failed"]);
        }
      }
    });
  };

  const handleMove = async (id, direction) => {
    const sortedCourses = [...courses].sort(
      (a, b) => (a.order ?? 0) - (b.order ?? 0)
    );
    const currentIndex = sortedCourses.findIndex((c) => c.id === id);

    if (currentIndex === -1) return;

    const targetIndex =
      direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= sortedCourses.length) return;

    const currentCourse = sortedCourses[currentIndex];
    const targetCourse = sortedCourses[targetIndex];

    try {
      await update(currentCourse.id.toString(), { order: targetCourse.order });
      await update(targetCourse.id.toString(), { order: currentCourse.order });
      toast.success("เปลี่ยนลำดับเรียบร้อยแล้ว");
    } catch (error) {
      console.error("Error moving course:", error);
      toast.error("เกิดข้อผิดพลาดในการเปลี่ยนลำดับ");
    }
  };

  const columes = [
    {
      field: "no",
      headerName: "ลำดับที่",
      width: 80,
      renderCell: (params) => (
        <span>
          {filterCourses.findIndex((c) => c.id === params.row.id) + 1}
        </span>
      ),
    },
    {
      field: "order",
      headerName: "Order",
      width: 80,
      renderCell: (params) => (
        <div className="flex flex-col gap-1">
          <button
            className="text-blue-500 hover:text-blue-700 text-sm"
            onClick={() => handleMove(params.row.id, "up")}
          >
            ▲
          </button>
          <button
            className="text-blue-500 hover:text-blue-700 text-sm"
            onClick={() => handleMove(params.row.id, "down")}
          >
            ▼
          </button>
        </div>
      ),
    },
    {
      field: "name",
      headerName: "Name",
      width: 200,
      renderCell: (params) => {
        return t(params.row.name);
      },
    },
    {
      field: "description",
      headerName: "Description",
      width: 200,
      renderCell: (params) => {
        return t(params.row.description);
      },
    },
    { field: "group", headerName: "Group", width: 150 },
    { field: "subgroup", headerName: "SubGroup", width: 150 },
    {
      field: "active",
      headerName: "Active",
      width: 80,
      flex: 0.5,
      headerAlign: "center", // ✅ จัดหัวข้อไปตรงกลาง
      align: "center", // ✅ จัดเนื้อหาไปตรงกลาง
      renderCell: (params) => (
        <span
          className={`px-2 py-1 rounded-lg cursor-pointer ${
            params.value ? "bg-green-500 text-white" : "bg-red-500 text-white"
          }`}
          onClick={() => handleUpdateActive(params.row.id)}
        >
          {params.value ? lang["active"] : lang["inactive"]}
        </span>
      ),
    },
    {
      field: "created_at",
      headerName: "Created At",
      width: 200,
      renderCell: (params) => {
        return moment(params.row.created_at).format("lll");
      },
    },
    {
      field: "updated_at",
      headerName: "Updated At",
      width: 200,
      renderCell: (params) => {
        return moment(params.row.updated_at).format("lll");
      },
    },
    {
      field: "tools",
      headerName: "tools",
      width: 200,
      flex: 0.5,
      headerAlign: "center", // ✅ จัดหัวข้อไปตรงกลาง
      align: "center", // ✅ จัดเนื้อหาไปตรงกลาง
      renderCell: (params) => {
        return (
          <div className="flex flex-row items-center gap-2 h-12 w-full">
            <button
              type="button"
              className="text-green-500 hover:text-green-600"
              onClick={() => router.push(`/courses/${params.row.id}`)}
            >
              <FaEye size={25} />
            </button>

            <button
              type="button"
              className="text-blue-500 hover:tex-blue-600"
              onClick={() => handleEdit(params.row)}
            >
              <FaEdit size={25} />
            </button>
            <button
              type="button"
              className="text-red-500 hover:text-red-600"
              onClick={() => handleDelete(params.row)}
            >
              <FaTrashAlt size={25} />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800">
      <div className="max-w-screen-xl px-2 py-4">
        <span>Courses Online</span>
      </div>

      <div>
        {/* Toolbar */}
        <div className="flex flex-row items-center justify-between gap-4">
          <div>
            <button
              type="button"
              className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600"
              onClick={handleOpenForm}
            >
              <span>{lang["create_course"]}</span>
            </button>
          </div>
          <div>
            <SearchBar search={search} setSearch={setSearch} />
          </div>
        </div>

        {/* Table */}
        <div className="mt-4">
          <DataGrid
            rows={filterCourses}
            columns={columes}
            pageSize={10}
            rowsPerPageOptions={[10]}
            checkboxSelection
            disableSelectionOnClick
            autoHeight
          />
        </div>
      </div>

      <Dialog
        fullScreen
        open={openForm}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseForm}
        aria-describedby="alert-dialog-slide-description"
      >
        <CoursesOnlineForm
          onClose={handleCloseForm}
          course={selectedCourses}
          isNewCourse={!selectedCourses}
        />
      </Dialog>
    </div>
  );
}
