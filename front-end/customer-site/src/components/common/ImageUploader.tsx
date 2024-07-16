import { ChangeEvent } from "react";
import toast from "react-hot-toast";
import { upload } from "@/app/api/users/route";

interface ImageUploaderProps {
  setImageLink: (imageLink: string) => void;
  children?: React.ReactNode;
}

const ImageUploader = ({ setImageLink, children }: ImageUploaderProps) => {
  async function handleFileChange(
    event: ChangeEvent<HTMLInputElement>
  ): Promise<void> {
    const files = event.target.files;
    if (files && files.length === 1) {
      const formData = new FormData();
      formData.set("file", files[0]);

      const uploadPromise = new Promise<string | undefined>(
        async (resolve, reject) => {
          try {
            const response = await upload(formData);
            if (response.status === 200) {
              console.log(response.data.imagePath);
              const link = response.data.imagePath;
              setImageLink(link);
              resolve(link);
            } else {
              reject("Upload failed");
            }
          } catch (error) {
            reject(error);
          }
        }
      );

      toast.promise(uploadPromise, {
        loading: "Uploading...",
        success: "Upload success",
        error: "Upload failed",
      });
    }
  }

  return (
    <label className="cursor-pointer">
      <input type="file" accept="image/*" onChange={handleFileChange} hidden />
      {children && children}
    </label>
  );
};

export default ImageUploader;
