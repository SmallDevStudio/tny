import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const { folder = "", subfolder = "" } = req.body;
    const uploadPath = join(process.cwd(), "public/upload", folder, subfolder);
    
    try {
        await mkdir(uploadPath, { recursive: true });

        const file = req.files.file;
        const filePath = join(uploadPath, file.name);
        await writeFile(filePath, file.data);

        res.status(200).json({ url: `/upload/${folder}/${subfolder}/${file.name}` });
    } catch (error) {
        res.status(500).json({ message: "Upload failed", error: error.message });
    }
}
