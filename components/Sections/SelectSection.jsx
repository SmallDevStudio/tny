import React, { useState, useEffect } from "react";
import useDB from "@/hooks/useDB";
import useLanguage from "@/hooks/useLanguage";
import Image from "next/image";
import { Sections } from "@/components/Layouts/Sections";
import { toast } from "react-toastify";
import { nanoid } from "nanoid"; // ✅ ใช้ nanoid เพื่อสร้าง id ที่ไม่ซ้ำ
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Menu, MenuItem } from "@mui/material";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { RiDeleteBinLine } from "react-icons/ri";

const SortableItem = ({ id, children }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    const style = { transform: CSS.Transform.toString(transform), transition };
    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            {children}
        </div>
    );
};

export default function SelectSections({ page, sections }) {
    const [selectedSections, setSelectedSections] = useState([]);
    const [contextMenu, setContextMenu] = useState(null);
    const { lang } = useLanguage();
    const { update } = useDB("pages");

    useEffect(() => {
        if (sections.length > 0) {
            setSelectedSections(sections);
        }
    }, [sections]);

    // ✅ ฟังก์ชันเลือก Section และป้องกันการเลือกซ้ำ
    const handleSelectedSection = (section) => {
        if (!selectedSections.some((s) => s.component === section.name)) {
            setSelectedSections((prev) => [
                ...prev,
                { id: nanoid(), component: section.name, contentId: "" }, // ✅ เพิ่ม id และ contentId
            ]);
        }
    };

    // ✅ ฟังก์ชันลบ Section ออกจาก `selectedSections`
    const handleRemoveSection = (id) => {
        setSelectedSections((prev) => prev.filter((s) => s.id !== id));
    };

    // ✅ ฟังก์ชันจัดการลากเปลี่ยนตำแหน่ง
    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            setSelectedSections((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    // ✅ คลิกขวาเพื่อเปิด Context Menu
    const handleContextMenu = (event, id) => {
        event.preventDefault();
        setContextMenu({ mouseX: event.clientX - 2, mouseY: event.clientY - 4, id });
    };

    const handleCloseContextMenu = () => {
        setContextMenu(null);
    };

    const handleSubmit = async () => {
        console.log(selectedSections);
        if (selectedSections.length > 0) {
            try {
                await update(page, { sections: selectedSections });
                toast.success("บันทึกข้อมูลสำเร็จแล้ว!");
            } catch (error) {
                console.error(error);
                toast.error("บันทึกข้อมูลไม่สำเร็จ!");
            }
        }
    }

    return (
        <div className="bg-white dark:bg-gray-800 p-4">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                
                {/* รายการ Sections ที่สามารถเลือกได้ */}
                <div className="flex flex-col px-4 w-1/2 gap-2">
                    <h2 className="text-lg font-bold">{lang["available_sections"]}</h2>
                    <span className="text-sm text-gray-500 mb-2">{lang["available_sections_desc"]}</span>
                    {Sections.filter(section => !selectedSections.some(s => s.component === section.name))
                        .map((section, index) => (
                            <div
                                key={index}
                                className="flex flex-row items-center gap-6 border border-gray-400 p-4 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                                onClick={() => handleSelectedSection(section)}
                            >
                                <Image src={section?.thumbnail} alt={section.name} width={80} height={80} />
                                <div className="font-semibold">{section.name}</div>
                            </div>
                        ))}
                </div>

                {/* รายการ Sections ที่เลือกแล้ว */}
                <div className="flex flex-col px-4 w-1/2 gap-2">
                    <h2 className="text-lg font-bold">{lang["select_section"]}</h2>
                    <span className="text-sm text-gray-500 mb-2">{lang["select_section_desc"]}</span>

                    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={selectedSections.map(sec => sec.id)} strategy={verticalListSortingStrategy}>
                            <div className="w-full gap-2">
                                {selectedSections.length > 0 && selectedSections.map((sec) => (
                                    <SortableItem key={sec.id} id={sec.id}>
                                        <div 
                                            className="flex border border-gray-200 rounded-lg bg-gray-100 p-4 items-center cursor-move"
                                            onContextMenu={(e) => handleContextMenu(e, sec.id)}
                                        >
                                            {sec.component}
                                        </div>
                                    </SortableItem>
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                </div>
                
            </div>
            <div className="flex justify-center gap-6 mt-5 w-full">
                    <button
                        className={`bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-md ${selectedSections.length === 0 && "opacity-50 cursor-not-allowed"}`}
                        disabled={selectedSections.length === 0}
                        onClick={handleSubmit}
                    >
                        {lang["save"]}
                    </button>
                    <button
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md"
                    >
                        {lang["cancel"]}
                    </button>
            </div>

            {/* Context Menu สำหรับลบ Section */}
            <Menu
                open={contextMenu !== null}
                onClose={handleCloseContextMenu}
                anchorReference="anchorPosition"
                anchorPosition={contextMenu !== null ? { top: contextMenu.mouseY, left: contextMenu.mouseX } : undefined}
            >
                <MenuItem onClick={() => { handleRemoveSection(contextMenu.id); handleCloseContextMenu(); }}>
                    <div className="flex items-center gap-2 hover:text-red-500">
                        <RiDeleteBinLine /> 
                        <span className="text-sm font-bold">ลบ</span>
                    </div>
                </MenuItem>
            </Menu>
        </div>
    );
}
