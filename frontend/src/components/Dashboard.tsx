import { useRef, useState } from "react";
import { useDashboard } from "../hooks/useDashboard";

interface DashboardProps {
  token: string;
  setToken: (token: string) => void;
}

const Dashboard = ({ token, setToken }: DashboardProps) => {
  const {
    selectedFiles,
    setSelectedFiles,
    titles,
    setTitles,
    handleDelete,
    handleUpdate,
    handleUpload,
    images,
    setImages,
    setHasOrderChanged,
    hasOrderChanged,
    handleSaveOrder,
    setEditTitle,
    setEditingImage,
    setEditFile,
    editTitle,
    editingImage,
    editFile,
    updating,
    uploading,
    fileInputRef,
  } = useDashboard(token);

  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);
    setSelectedFiles((prev) => {
      const updatedFiles = [...prev, ...newFiles];
      setTitles((prevTitles) => {
        const updatedTitles = { ...prevTitles };
        newFiles.forEach((file, index) => {
          const titleIndex = prev.length + index;
          updatedTitles[titleIndex] = file.name.split(".")[0];
        });
        return updatedTitles;
      });
      return updatedFiles;
    });
  };

  const handleDragStart = (index: number) => setDraggedItemIndex(index);
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) =>
    e.preventDefault();
  const handleDrop = (targetIndex: number) => {
    if (draggedItemIndex === null || draggedItemIndex === targetIndex) return;
    const updatedImages = [...images];
    const [draggedItem] = updatedImages.splice(draggedItemIndex, 1);
    updatedImages.splice(targetIndex, 0, draggedItem);
    setImages(updatedImages);
    setDraggedItemIndex(null);
    setHasOrderChanged(true);
  };
  const previewImage = editFile
    ? URL.createObjectURL(editFile)
    : editingImage
      ? editingImage.imageUrl
      : "";

  return (
    <div className="p-6 max-w-6xl mx-auto flex flex-col gap-10">
      <div className="flex w-full items-center  gap-3.5 rounded-xl bg-linear-to-r from-slate-900 via-blue-900 to-indigo-800 px-5 py-3 text-white shadow-md ">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10 font-mono text-sm font-bold tracking-wider text-cyan-300 ring-1 ring-white/20">
          IMG
        </span>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight leading-tight">
            Stock Image Platform
          </h1>
          <p className="text-xs text-slate-300">
            Organize ,edit & arrange your gallery
          </p>
        </div>
        <button
          onClick={() => setToken("")}
          className="bg-sky-500 text-white px-2 py-1 rounded cursor-pointer ml-auto "
        >
          Logout
        </button>
      </div>

      <form
        onSubmit={handleUpload}
        className="bg-white p-4  rounded shadow mb-8 space-y-4  max-w-md mr-auto"
      >
        <h2 className="text-lg font-semibold ">Bulk Upload Images</h2>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full border p-2 rounded"
        />
        {selectedFiles.length > 0 && (
          <div className="space-y-4">
            <h3>Preview and Assign Titles:</h3>
            {selectedFiles.map((file, idx) => (
              <div
                key={`${file.name}-${idx}`}
                className="flex items-center gap-4 border rounded-lg p-3"
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="w-24 h-24 object-cover rounded"
                />
                <div className="flex-1 space-y-2">
                  <p className="text-sm text-gray-500 truncate">{file.name}</p>
                  <input
                    type="text"
                    value={titles[idx] || ""}
                    onChange={(e) =>
                      setTitles({ ...titles, [idx]: e.target.value })
                    }
                    className="w-full p-2 border rounded"
                    placeholder="Enter image title"
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFiles((prev) =>
                      prev.filter((_, index) => index !== idx),
                    );
                    setTitles((prev) => {
                      const updated = { ...prev };
                      delete updated[idx];
                      return Object.fromEntries(
                        Object.entries(updated).map(([key, value]) => [
                          Number(key) > idx ? Number(key) - 1 : Number(key),
                          value,
                        ]),
                      );
                    });
                  }}
                  className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {uploading ? "Uploading..." : "Upload All"}
            </button>
          </div>
        )}
      </form>
      <div className="flex gap-10 items-center mb-4">
        <div className="inline-flex flex-wrap items-center gap-2.5 rounded-xl bg-sky-100 px-3.5 py-2 border border-slate-200">
          <h2 className="text-base sm:text-lg font-semibold text-slate-900">
            Your uploads
          </h2>
          <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
            {images.length}
          </span>
          <span className="text-xs text-slate-500">
            Drag & drop to rearrange
          </span>
        </div>
        {hasOrderChanged && (
          <button
            onClick={handleSaveOrder}
            className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700"
          >
            Save Rearranged Order
          </button>
        )}
      </div>
      {images.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((img, idx) => (
            <div
              key={img._id}
              draggable
              onDragStart={() => handleDragStart(idx)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(idx)}
              className="bg-white border rounded shadow p-4 cursor-move flex flex-col justify-between hover:shadow-md transition"
            >
              <div>
                <img
                  src={img.imageUrl}
                  alt={img.title}
                  className="w-full h-40 object-cover rounded mb-4"
                />
                <h3 className="font-bold text-center truncate ">{img.title}</h3>
              </div>
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => {
                    setEditingImage(img);
                    setEditTitle(img.title);
                  }}
                  className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
                >
                  {updating ? "Updating..." : "Edit"}
                </button>
                <button
                  onClick={() => {
                    handleDelete(img._id);
                  }}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 text-center">
          <div className="text-5xl mb-4">🖼️</div>
          <h3 className="text-lg font-semibold text-gray-700">
            No Images Found
          </h3>
          <p className="text-sm text-gray-500 mt-2">
            Your gallery is empty. Upload some images to get started!
          </p>
        </div>
      )}

      {editingImage && (
        <div className="fixed inset-0 bg-black/50  flex items-center justify-center p-4">
          <form
            onSubmit={handleUpdate}
            className="bg-white p-6 rounded shadow max-w-md w-full space-y-4"
          >
            <h2>Edit Image & Title</h2>

            <div>
              <label className="block text-sm font-medium mb-1 ">Title</label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Current Image
              </label>
              <img
                src={previewImage}
                alt={editingImage.title}
                className="w-full h-48 object-cover rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 ">
                Replace Image (Optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setEditFile(e.target.files ? e.target.files[0] : null)
                }
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => {
                  setEditFile(null);
                  setEditingImage(null);
                }}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                {updating ? "Updating..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
