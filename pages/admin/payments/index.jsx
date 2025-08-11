import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import useLanguage from "@/hooks/useLanguage";
import Upload from "@/components/utils/Upload";
import YoutubeModal from "@/components/modal/YoutubeModal";
import { FaPlus, FaYoutube } from "react-icons/fa";
import { FiUpload } from "react-icons/fi";
import { Slide, Dialog, Divider, Switch } from "@mui/material";
import { styled } from "@mui/material/styles";
import useDB from "@/hooks/useDB";
import { toast } from "react-toastify";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: "#65C466",
        opacity: 1,
        border: 0,
        ...theme.applyStyles("dark", {
          backgroundColor: "#2ECA45",
        }),
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color: theme.palette.grey[100],
      ...theme.applyStyles("dark", {
        color: theme.palette.grey[600],
      }),
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: 0.7,
      ...theme.applyStyles("dark", {
        opacity: 0.3,
      }),
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 22,
    height: 22,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: "#E9E9EA",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
    ...theme.applyStyles("dark", {
      backgroundColor: "#39393D",
    }),
  },
}));

export default function AdminPayments() {
  const [form, setForm] = useState({
    isUsePayment: false,
    includeVat: true,
  });

  const [video, setVideo] = useState(null);
  const [handleOpenForm, setHandleOpenForm] = useState(null);
  const [toggleMenu, setToggleMenu] = useState(false);
  const { subscribe, getById, update } = useDB("appdata");

  const router = useRouter();
  const { t, lang } = useLanguage();

  const handleCloseForm = () => {
    setHandleOpenForm(null);
  };

  const handleUpload = (video) => {
    setVideo(video[0]);
  };

  const handleUpdate = async (name, value) => {
    const data = { ...form, [name]: value };
    await update("app", data);
    toast.success("บันทึกข้อมูลสำเร็จแล้ว!");
  };

  return (
    <div className="bg-white dark:bg-gray-800">
      <h1 className="text-xl font-bold dark:text-white my-2">
        Payments Managements
      </h1>
      {/* Tools */}
      <div>
        <div className="flex flex-col gap-2">
          <Divider flexItem textAlign="left">
            <span className="font-bold">Payment Setting</span>
          </Divider>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <IOSSwitch
                name="isUsePayment"
                checked={form.isUsePayment}
                onChange={(e) => {
                  setForm({ ...form, isUsePayment: e.target.checked });
                  handleUpdate("isUsePayment", e.target.checked);
                }}
              />
              <label>Payment</label>
            </div>
            <div className="flex items-center gap-2">
              <IOSSwitch
                checked={form.includeVat}
                onChange={(e) => {
                  setForm({ ...form, includeVat: e.target.checked });
                  handleUpdate("includeVat", e.target.checked);
                }}
              />
              <label>Include Vat</label>
            </div>
          </div>
        </div>
        <Divider flexItem textAlign="left" sx={{ my: 4 }}>
          <span className="font-bold">Payment</span>
        </Divider>
      </div>

      <Dialog
        open={handleOpenForm}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setHandleOpenForm(null)}
      >
        <div></div>
      </Dialog>
    </div>
  );
}
