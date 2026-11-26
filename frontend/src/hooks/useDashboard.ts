import { useEffect, useRef, useState } from "react";
import type { StockImage } from "../types";
import axios from "axios";
import { API_ENDPOINTS } from "../constants/apiEndPoints";
import { toast } from "sonner";
import { MESSAGES } from "../constants/messages";
import { uploadImagesToCloudinary } from "../utils/uploadImagesToCloudinary";

export const useDashboard = (token: string) => {
  const [titles, setTitles] = useState<Record<number, string>>({});
  const [images, setImages] = useState<StockImage[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [editingImage, setEditingImage] = useState<StockImage | null>(null);
  const [editTitle, setEditTitle] = useState<string>("");
  const [editFile, setEditFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [hasOrderChanged, setHasOrderChanged] = useState<boolean>(false);

  const fetchImages = async () => {
    try {
      const { data } = await axios<StockImage[]>(API_ENDPOINTS.IMAGES.BASE, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setImages(data);
      setHasOrderChanged(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || MESSAGES.ERROR.TRY_LATER);
      console.error(error);
    }
  };
  useEffect(() => {
    fetchImages();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      if (!selectedFiles.length) return;
      setUploading(true);
      const uploadedAssets = await uploadImagesToCloudinary(selectedFiles);
      const orderedTitles = selectedFiles.map(
        (_, idx) =>
          titles[idx]?.trim() || selectedFiles[idx].name.split(".")[0],
      );
      await axios.post(
        API_ENDPOINTS.IMAGES.UPLOAD,
        { titles: orderedTitles, images: uploadedAssets },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setSelectedFiles([]);
      setTitles({});
      await fetchImages();
      fileInputRef.current?.value && (fileInputRef.current.value = "");
      toast.success(MESSAGES.SUCCESS.UPLOADED);
    } catch (error: any) {
      toast.error(error.response?.data?.message || MESSAGES.ERROR.TRY_LATER);
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      if (!window.confirm("Are you sure want to delete this image?")) return;
      await axios.delete(API_ENDPOINTS.IMAGES.SPECIFIC(id), {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchImages();
      toast.success(MESSAGES.SUCCESS.DELETED);
    } catch (error: any) {
      toast.error(error.response?.data?.message || MESSAGES.ERROR.TRY_LATER);
      console.error(error);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setUpdating(true);
      if (!editingImage) return;
      const payload: {
        title: string;
        imageUrl?: string;
        publicId?: string;
      } = { title: editTitle };
      if (editFile) {
        const [uploaded] = await uploadImagesToCloudinary([editFile]);
        ((payload.imageUrl = uploaded.secureUrl),
          (payload.publicId = uploaded.publicId));
      }
      await axios.put(
        API_ENDPOINTS.IMAGES.SPECIFIC(editingImage._id),
        payload,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setEditingImage(null);

      setEditFile(null);
      fetchImages();
      toast.success(MESSAGES.SUCCESS.UPDATE);
    } catch (error: any) {
      toast.error(error.response?.data?.message || MESSAGES.ERROR.TRY_LATER);
      console.error(error);
    } finally {
      setUpdating(false);
    }
  };

  const handleSaveOrder = async () => {
    try {
      const orderedIds = images.map((img) => img._id);
      await axios.post(
        API_ENDPOINTS.IMAGES.REARRANGE,
        {
          orderedIds,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setHasOrderChanged(false);
      toast.success(MESSAGES.SUCCESS.IMAGE_REARRANGED);
    } catch (error: any) {
      toast.error(error.response?.data?.message || MESSAGES.ERROR.TRY_LATER);
      console.error(error);
    }
  };
  return {
    selectedFiles,
    setSelectedFiles,
    titles,
    setTitles,
    handleDelete,
    handleUpdate,
    handleUpload,
    hasOrderChanged,
    setHasOrderChanged,
    images,
    setImages,
    setEditingImage,
    setEditTitle,
    handleSaveOrder,
    setEditFile,
    editTitle,
    editingImage,
    editFile,
    updating,
    uploading,
    fileInputRef,
  };
};
