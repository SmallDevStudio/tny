import { unlink } from "fs/promises";
import { join } from "path";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const { url } = req.body;
    const filePath = join(process.cwd(), "public", url);

    try {
        await unlink(filePath);
        res.status(200).json({ message: "File deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "File delete failed", error: error.message });
    }
}
