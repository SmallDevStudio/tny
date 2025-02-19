import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import useDB from "@/hooks/useDB";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Sections } from "../Layouts/Sections";
import { RiDeleteBinLine } from "react-icons/ri";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Menu, MenuItem } from "@mui/material";

const SortableItem = ({ id, children }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    const style = { transform: CSS.Transform.toString(transform), transition };
    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            {children}
        </div>
    );
};

export default function PageForm() {
    const [selectedSections, setSelectedSections] = useState([]);
    const [form, setForm] = useState({ name: "", title: "", description: "", slug: "" });
    const { data: session } = useSession();
    const router = useRouter();
    const [contextMenu, setContextMenu] = useState(null);

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

    const handleAddSection = (sec) => {
        setSelectedSections((prev) => [...prev, { ...sec, id: `${sec.name}-${Date.now()}` }]);
    };

    const handleRemoveSection = (id) => {
        setSelectedSections((prev) => prev.filter((item) => item.id !== id));
    };

    const handleContextMenu = (event, id) => {
        event.preventDefault();
        setContextMenu({ mouseX: event.clientX - 2, mouseY: event.clientY - 4, id });
    };

    const handleClose = () => {
        setContextMenu(null);
    };

    
    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl">
            <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16">
                <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">เพิ่มหน้า</h2>
                    {/* form */}
                    <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
                        <div className="sm:col-span-2">
                            <label 
                                htmlFor="name"
                                className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
                            >
                                ชื่อหน้า <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="text"
                                name="name"
                                id="name"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                placeholder="กรอกชื่อหน้า"
                                required
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label 
                                htmlFor="title"
                                className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
                            >
                                หัวข้อหน้า <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="text"
                                name="title"
                                id="title"
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                placeholder="กรอกหัวข้อหน้า"
                                required
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label 
                                htmlFor="description"
                                className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
                            >
                                คําอธิบาย
                            </label>
                            <textarea
                                type="text"
                                name="description"
                                id="description"
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                placeholder="กรอกคําอธิบาย"
                                rows={4}
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label 
                                htmlFor="slug"
                                className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
                            >
                                Slug <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="text"
                                name="slug"
                                id="slug"
                                value={form.slug}
                                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                placeholder="กรอก Slug"
                                required
                            />
                        </div>
                    </div>

                    {/* Section And Selected Section */}
                    <div className="gap-1 sm:grid-cols-2 sm:gap-2 mt-4">
                        <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">เลือก Section </h3>
                        <div className="grid gap-2 sm:grid-cols-2 sm:col-span-4">
                            {/* Section */}
                            <div className="w-full gap-2 border border-gray-200 rounded-lg bg-gray-100 p-4 sm:grid-cols-2 sm:gap-4">
                                {Sections.filter(sec => !selectedSections.some(sel => sel.name === sec.name)).map((sec) => (
                                    <div key={sec.id} className="p-2 border bg-white rounded-lg cursor-pointer hover:bg-gray-200"
                                        onClick={(e) => { e.stopPropagation(); handleAddSection(sec); }}>
                                        {sec.name}
                                    </div>
                                ))}
                            </div>
                            {/* Selected Section */}
                            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd} autoScroll={{ enabled: true }}>
                                <SortableContext items={selectedSections.map(sec => sec.id)} strategy={verticalListSortingStrategy}>
                                    <div className="w-full gap-2 border border-gray-200 rounded-lg bg-gray-100 p-4">
                                        {selectedSections.map((sec) => (
                                            <SortableItem key={sec.id} id={sec.id}>
                                                <div className="p-2 border bg-white rounded-lg flex justify-between items-center" onContextMenu={(e) => handleContextMenu(e, sec.id)}>
                                                    {sec.name}
                                                </div>
                                            </SortableItem>
                                        ))}
                                    </div>
                                </SortableContext>
                            </DndContext>
                        </div>
                    </div>
            </div>
            <Menu
                open={contextMenu !== null}
                onClose={handleClose}
                anchorReference="anchorPosition"
                anchorPosition={contextMenu !== null ? { top: contextMenu.mouseY, left: contextMenu.mouseX } : undefined}
            >
                <MenuItem onClick={() => { handleRemoveSection(contextMenu.id); handleClose(); }}>
                    <div className="flex items-center gap-2 hover:text-red-500">
                        <RiDeleteBinLine /> 
                        <span className="text-sm font-bold">ลบ</span>
                    </div>
                </MenuItem>
            </Menu>
        </div>
    );
}
