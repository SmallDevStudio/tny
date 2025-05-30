import React, { useState, useEffect } from "react";
import useDB from "@/hooks/useDB";
import useLanguage from "@/hooks/useLanguage";
import { DataGrid } from "@mui/x-data-grid";
import { Dialog, Slide, Tooltip } from "@mui/material";
import { toast } from "react-toastify";
import SearchBar from "@/components/Bar/SearchBar";
import Swal from "sweetalert2";
import BlogForm from "@/components/Blog/BlogForm";
import moment from "moment";
import "moment/locale/th";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

moment.locale("th");

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AdminBlog() {
  const [blog, setBlog] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [filterBlog, setFilterBlog] = useState([]);
  const [search, setSearch] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const { lang, t } = useLanguage();
  const { subscribe, getAll, add, update, remove } = useDB("blogs");

  useEffect(() => {
    const unsubscribe = subscribe((blogData) => {
      if (blogData) {
        setBlog(blogData);
        setFilterBlog(blogData);
      }
    });

    return () => unsubscribe(); // ✅ หยุดฟังเมื่อ component unmount
  }, []); // ✅ ทำให้ useEffect รันแค่ครั้งเดียว

  useEffect(() => {
    if (search) {
      const filtered = blog.filter(
        (blog) =>
          blog.name.en.toLowerCase().includes(search.toLowerCase()) ||
          blog.name.th.toLowerCase().includes(search.toLowerCase()) ||
          blog.description.en.toLowerCase().includes(search.toLowerCase()) ||
          blog.description.th.toLowerCase().includes(search.toLowerCase())
      );
      setFilterBlog(filtered);
    } else {
      setFilterBlog(blog);
    }
  }, [search, blog]);

  const handleOpenForm = () => {
    setSelectedBlog(null);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setSelectedBlog(null);
    setOpenForm(false);
  };

  const handleEdit = (blog) => {
    setSelectedBlog(blog);
    setOpenForm(true);
  };

  const handleUpdateActive = async (active, id) => {
    try {
      await update(id, { active: !active }); // Toggle active status
      toast.success(lang["blog_updated_successfully"]); // Show success toast message
    } catch (error) {
      console.error(error);
      toast.error(lang["update_failed"]); // Show error toast message
    }
  };

  const handleDelete = (blog) => {
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
          await remove(blog.id.toString());
          toast.success(lang["deleted_successfully"]);
        } catch (error) {
          console.error(error);
          toast.error(lang["delete_failed"]);
        }
      }
    });
  };

  const columes = [
    { field: "id", headerName: "code", width: 150 },
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
        <span className="text-2xl font-semibold text-gray-900 dark:text-white">
          {lang["blog"]}
        </span>
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
              <span>{lang["create_blog"]}</span>
            </button>
          </div>
          <div>
            <SearchBar search={search} setSearch={setSearch} />
          </div>
        </div>

        {/* Table */}
        <div className="mt-4">
          <DataGrid
            rows={filterBlog}
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
        <BlogForm
          onClose={handleCloseForm}
          blog={selectedBlog}
          isNewBlog={!selectedBlog}
        />
      </Dialog>
    </div>
  );
}
