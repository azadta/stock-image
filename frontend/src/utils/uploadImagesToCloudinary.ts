import axios from "axios";
export interface UploadedCloudinaryAsset {
  secureUrl: string;
  publicId: string;
}

export const uploadImagesToCloudinary = async (
  files: File[],
): Promise<UploadedCloudinaryAsset[]> => {
  const results: UploadedCloudinaryAsset[] = [];
  try {
    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
      );

      const { data } = await axios.post(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
        }/image/upload`,
        formData,
      );

      results.push({ secureUrl: data?.secure_url, publicId: data?.public?._id });
    }
    console.log("publicId from cloudinary:", results[0].publicId);
    return results;
  } catch (error) {
    throw error;
  }
};
