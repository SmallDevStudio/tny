import axios from "axios";

export default async function handler(req, res) {
  const { youtubeUrl } = req.body;

  if (!youtubeUrl) {
    return res.status(400).json({ error: "Missing YouTube URL" });
  }

  let videoId;
  let url;

  try {
    url = new URL(youtubeUrl);
  } catch (err) {
    return res.status(400).json({ error: "Invalid YouTube URL format" });
  }

  if (url.hostname.includes("youtube.com")) {
    if (url.pathname.startsWith("/shorts/")) {
      videoId = url.pathname.split("/")[2];
    } else {
      videoId = url.searchParams.get("v");
    }
  } else if (url.hostname === "youtu.be") {
    videoId = url.pathname.slice(1);
  }

  if (!videoId) {
    return res.status(400).json({ error: "Unable to extract video ID" });
  }

  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
  const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${API_KEY}`;

  try {
    const response = await axios.get(apiUrl);
    const videoData = response.data.items[0];

    if (!videoData) {
      return res.status(404).json({ error: "Video not found" });
    }

    const { title, description, thumbnails, channelTitle, publishedAt } =
      videoData.snippet;
    const { duration, dimension, definition } = videoData.contentDetails;
    const thumbnailUrl = thumbnails.high.url;
    const fullUrl = `https://www.youtube.com/watch?v=${videoData.id}`;

    res.status(200).json({
      title,
      description,
      thumbnailUrl,
      url: fullUrl,
      duration,
      videoId: videoData.id,
      channelTitle,
      publishedAt,
      dimension,
      definition,
      thumbnails,
    });
  } catch (error) {
    console.error("YouTube API error:", error?.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch video data" });
  }
}
