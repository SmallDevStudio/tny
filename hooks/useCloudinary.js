import { nanoid } from "nanoid";

const CLOUDINARY_URL = (cloudName) =>
  `https://api.cloudinary.com/v1_1/${cloudName}/upload`;

export const uploadFileToCloudinary = async (
  file,
  cloudName,
  uploadPreset,
  folder = "",
  onProgress
) => {
  if (!file) return null;
  const fileId = nanoid(10);

  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    if (folder) formData.append("folder", folder);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", CLOUDINARY_URL(cloudName));

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable && typeof onProgress === "function") {
        const progress = (e.loaded / e.total) * 100;
        onProgress(progress);
      }
    });

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200 || xhr.status === 201) {
          try {
            const res = JSON.parse(xhr.responseText);
            const data = {
              file_id: fileId,
              url: res.secure_url,
              public_id: res.public_id,
              original_filename: res.original_filename || file.name,
              mime_type: file.type,
              file_size: file.size,
              created_at: res.created_at,
            };
            resolve(data);
          } catch (err) {
            reject(err);
          }
        } else {
          reject(
            new Error(
              "Upload failed with status " +
                xhr.status +
                ": " +
                xhr.responseText
            )
          );
        }
      }
    };

    xhr.onerror = (err) => reject(err);
    xhr.send(formData);
  });
};

// Helper to call server API to delete (server uses API secret)
export const deleteFileOnServer = async (publicId) => {
  const res = await fetch(
    `/api/deleteFileCloudinary?public_id=${encodeURIComponent(publicId)}`,
    {
      method: "DELETE",
    }
  );
  if (!res.ok) throw new Error("Failed to delete on server");
  return res.json();
};
