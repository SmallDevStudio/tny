import { Sections } from "@/components/Sections";

export default function useComponents() {
    // ฟังก์ชันดึง Component ตามชื่อ
    const getComponent = (name) => {
        const section = Sections.find((s) => s.name.toLowerCase() === name.toLowerCase());
        return section ? section.component : null;
    };

    return { getComponent };
}
