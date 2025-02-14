export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).end();

    try {
        const { userId, message } = req.body;
        const lineToken = process.env.LINE_ACCESS_TOKEN;

        const response = await fetch("https://api.line.me/v2/bot/message/push", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${lineToken}`
            },
            body: JSON.stringify({
                to: userId,
                messages: [{ type: "text", text: message }]
            })
        });

        if (!response.ok) throw new Error("LINE API Error");

        res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
}
