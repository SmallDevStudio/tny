import React, { useState, useEffect } from "react";
import useDB from "@/hooks/useDB";
import useLanguage from "@/hooks/useLanguage";
import Image from "next/image";
import { DataGrid } from "@mui/x-data-grid";
import { Dialog, Slide, Tooltip } from "@mui/material";
import { toast } from "react-toastify";
import SearchBar from "@/components/Bar/SearchBar";
import Swal from "sweetalert2";
import CoursesForm from "@/components/Courses/CoursesForm";
import moment from "moment";
import 'moment/locale/th';

moment.locale('th');

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function AdminCourses() {
    const [courses, setCourses] = useState([]);
    const [selectedCourses, setSelectedCourses] = useState(null);
    const [filterCourses, setFilterCourses] = useState([]);
    const [search, setSearch] = useState("");
    const [openForm, setOpenForm] = useState(false);
    const { lang, t } = useLanguage();
    const { subscribe, remove } = useDB("courses");

    const handleOpenForm = () => {
        setOpenForm(true);
    };

    const handleCloseForm = () => {
        setSelectedCourses(null);
        setOpenForm(false);
    };

    return (
        <div className="bg-white dark:bg-gray-800">
            <div className="max-w-screen-xl px-2 py-4">
                <span>Courses</span>
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
                        <SearchBar
                            search={search}
                            setSearch={setSearch}
                        />
                    </div>
                </div>

                {/* Table */}
                <div></div>
            </div>

            <Dialog
                open={openForm}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleCloseForm}
                aria-describedby="alert-dialog-slide-description"
            >
                <CoursesForm
                    onClose={handleCloseForm}
                    course={selectedCourses}
                />
            </Dialog>
        </div>
    )
};