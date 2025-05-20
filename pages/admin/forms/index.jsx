import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import useLanguage from "@/hooks/useLanguage";
import { FaPlus, FaYoutube } from "react-icons/fa";
import { Slide, Dialog, Divider } from "@mui/material";
import Form from "@/components/Form/Form";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AdminForms() {
  const [form, setForm] = useState({
    title: { th: "", en: "" },
    description: { th: "", en: "" },
    form: [],
    active: true,
    status: "open",
  });
  const [OpenForm, setOpenForm] = useState(false);

  const router = useRouter();
  const { t, lang } = useLanguage();

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800">
      <h1 className="text-xl font-bold dark:text-white my-2">
        Forms Managements
      </h1>
      {/* Tools */}
      <div>
        <div>
          <button
            type="button"
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded"
            onClick={() => setOpenForm(true)}
          >
            <FaPlus />
          </button>
        </div>
      </div>

      <Dialog
        fullScreen
        open={OpenForm}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseForm}
      >
        <Form onClose={handleCloseForm} />
      </Dialog>
    </div>
  );
}
