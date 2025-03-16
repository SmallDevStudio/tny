import React, { useState, useEffect } from "react";
import useDB from "@/hooks/useDB";
import useLanguage from "@/hooks/useLanguage";
import Image from "next/image";
import { DataGrid } from "@mui/x-data-grid";
import { Dialog, Slide, Tooltip } from "@mui/material";
import { toast } from "react-toastify";
import SearchBar from "@/components/Bar/SearchBar";
import TeamForm from "@/components/Teams/TeamForm";
import TeamView from "@/components/Teams/TeamView";
import { RiUserAddLine, RiDeleteBin5Line } from "react-icons/ri";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import { MdOutlinePageview } from "react-icons/md";
import Swal from "sweetalert2";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [toggleLang, setToggleLang] = useState({}); // ✅ เก็บสถานะภาษาแต่ละแถว
  const { lang, language } = useLanguage();
  const { subscribe, update, remove } = useDB("teams"); // ✅ ใช้ onSnapshot เพื่อติดตามการเปลี่ยนแปลงแบบ real-time

  useEffect(() => {
    const unsubscribe = subscribe((teamData) => {
      // ถ้า `order` ไม่มี ให้กำหนดค่าเริ่มต้น
      const updatedTeams = teamData.map((team, index) => ({
        ...team,
        order: team.order ?? index, // ถ้ายังไม่มี `order` ให้ใช้ index เป็นค่าเริ่มต้น
      }));

      // อัปเดตฐานข้อมูลถ้ายังไม่มีค่า `order`
      initializeOrder(updatedTeams);

      // เรียงลำดับก่อนแสดงผล
      setTeams([...updatedTeams].sort((a, b) => a.order - b.order));
    });

    return () => unsubscribe();
  }, []);

  const initializeOrder = async (teamList) => {
    for (const team of teamList) {
      if (team.order === undefined) {
        await update(team.id, { order: teamList.indexOf(team) });
      }
    }
  };

  // ✅ เปลี่ยนภาษาเฉพาะแถวที่คลิก
  const toggleLanguage = (id) => {
    setToggleLang((prev) => ({
      ...prev,
      [id]: prev[id] === "th" ? "en" : "th",
    }));
  };

  console.log("teams", teams);

  const handleMoveRow = async (index, direction) => {
    const newTeams = [...teams];
    const targetIndex = index + direction;

    if (targetIndex < 0 || targetIndex >= newTeams.length) return;

    // ✅ สลับค่า order
    const tempOrder = newTeams[index].order;
    newTeams[index].order = newTeams[targetIndex].order;
    newTeams[targetIndex].order = tempOrder;

    try {
      // ✅ ใช้ Promise.all() เพื่อให้แน่ใจว่าฐานข้อมูลอัปเดตครบทุกตัวก่อนอัปเดต UI
      await Promise.all([
        update(newTeams[index].id, { order: newTeams[index].order }),
        update(newTeams[targetIndex].id, {
          order: newTeams[targetIndex].order,
        }),
      ]);

      // ✅ เรียงลำดับใหม่และอัปเดต UI
      setTeams([...newTeams].sort((a, b) => a.order - b.order));
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error(lang["something_went_wrong"]);
    }
  };

  const columns = [
    {
      field: "move",
      headerName: lang["move"],
      flex: 0.5,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const index = teams.findIndex((team) => team.id === params.row.id);
        return (
          <div className="flex flex-col items-center">
            <button
              className="text-gray-600 hover:text-gray-900"
              onClick={() => handleMoveRow(index, -1)}
              disabled={index === 0}
            >
              ↑
            </button>
            <button
              className="text-gray-600 hover:text-gray-900"
              onClick={() => handleMoveRow(index, 1)}
              disabled={index === teams.length - 1}
            >
              ↓
            </button>
          </div>
        );
      },
    },
    {
      field: "image",
      headerName: lang["image"],
      headerAlign: "center", // ✅ จัดหัวข้อไปตรงกลาง
      align: "center", // ✅ จัดเนื้อหาไปตรงกลาง
      width: 100,
      renderCell: (params) => (
        <div className="flex justify-center items-center">
          <Image
            src={params.value.url || "/default-avatar.png"}
            alt="Team Member"
            width={50}
            height={50}
            className="rounded-full"
          />
        </div>
      ),
    },
    {
      field: "name",
      headerName: lang["name"],
      flex: 1,
      headerAlign: "center", // ✅ จัดหัวข้อไปตรงกลาง
      renderCell: (params) => {
        const currentLang = toggleLang[params.row.id] || language;
        return (
          <div
            onClick={() => toggleLanguage(params.row.id)}
            className="cursor-pointer hover:underline"
          >
            {params.value[currentLang]}
          </div>
        );
      },
    },
    {
      field: "position",
      headerName: lang["position"],
      flex: 1,
      headerAlign: "center", // ✅ จัดหัวข้อไปตรงกลาง
      renderCell: (params) => {
        const currentLang = toggleLang[params.row.id] || language;
        return (
          <div
            onClick={() => toggleLanguage(params.row.id)}
            className="cursor-pointer hover:underline"
          >
            {params.value[currentLang]}
          </div>
        );
      },
    },
    {
      field: "bio",
      headerName: lang["bio"],
      flex: 2,
      headerAlign: "center", // ✅ จัดหัวข้อไปตรงกลาง
      renderCell: (params) => {
        const currentLang = toggleLang[params.row.id] || language;
        return (
          <div
            onClick={() => toggleLanguage(params.row.id)}
            className="cursor-pointer hover:underline truncate"
          >
            {params.value[currentLang] || "-"}
          </div>
        );
      },
    },
    {
      field: "active",
      headerName: lang["active"],
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
      field: "Tools",
      headerName: lang["tools"],
      flex: 0.5,
      headerAlign: "center", // ✅ จัดหัวข้อไปตรงกลาง
      align: "center", // ✅ จัดเนื้อหาไปตรงกลาง
      renderCell: (params) => (
        <div className="flex flex-row justify-center items-center gap-4 w-full h-full">
          <button
            className="flex text-green-500 hover:text-green-700"
            onClick={() => handleViewTeam(params.row)}
          >
            <MdOutlinePageview size={32} />
          </button>
          <button
            className="flex text-blue-500 hover:text-blue-700"
            onClick={() => handleEditTeam(params.row)}
          >
            <FaRegEdit size={25} />
          </button>
          <button
            className="flex text-red-500 hover:text-red-700"
            onClick={() => handleDeleteTeam(params.row.id)}
          >
            <FaRegTrashAlt size={25} />
          </button>
        </div>
      ),
    },
  ];

  const handleOpenForm = () => {
    setSelectedTeam(null);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setSelectedTeam(null);
    setOpenForm(false);
  };

  const handleUpdateActive = async (id) => {
    try {
      await update(id, {
        active: !teams.find((team) => team.id === id).active,
      }); // Toggle active status
      toast.success(lang["team_updated_successfully"]); // Show success toast message
    } catch (error) {
      console.error("Error updating team:", error);
      toast.error(lang["something_went_wrong"]); // Show error toast message
    }
  };

  const handleEditTeam = (team) => {
    setSelectedTeam(team);
    setOpenForm(true);
  };

  const handleDeleteTeam = async (id) => {
    const result = await Swal.fire({
      title: lang["are_you_sure"],
      text: lang["you_wont_be_able_to_revert_this"],
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: lang["yes_delete_it"],
      cancelButtonText: lang["cancel"],
    });

    if (result.isConfirmed) {
      try {
        await remove(id);
        toast.success(lang["team_deleted_successfully"]); // Show success toast message
      } catch (error) {
        console.error("Error deleting team:", error);
        toast.error(lang["something_went_wrong"]); // Show error toast message
      }
    }
  };

  const handleViewTeam = (team) => {
    setSelectedTeam(team);
    setOpenView(true);
  };

  const handleCloseView = () => {
    setOpenView(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800">
      <div className="max-w-screen px-4">
        <div className="px-4 py-2 sm:px-0">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {lang["teams-management"]}
          </h1>
        </div>

        <div className="mt-4">
          {/* Toolbar */}
          <div className="flex flex-row items-center justify-between w-full">
            <Tooltip title={lang["add_team"]} placement="bottom" arrow>
              <button
                className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 p-2 rounded"
                onClick={handleOpenForm}
              >
                <RiUserAddLine className="text-2xl" />
              </button>
            </Tooltip>
            <SearchBar search={search} setSearch={setSearch} />
          </div>

          {/* DataGrid Table */}
          <div className="mt-4">
            <DataGrid
              rows={teams}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10]}
              autoHeight
              disableSelectionOnClick
              className="shadow-md rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Form Dialog */}
      <Dialog
        open={openForm}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseForm}
        aria-describedby="alert-dialog-slide-description"
      >
        <TeamForm teamData={selectedTeam} onClose={handleCloseForm} />
      </Dialog>

      {/* View Dialog */}
      <Dialog
        open={openView}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseView}
        aria-describedby="alert-dialog-slide-description"
      >
        <TeamView teamData={selectedTeam} onClose={handleCloseView} />
      </Dialog>
    </div>
  );
}
