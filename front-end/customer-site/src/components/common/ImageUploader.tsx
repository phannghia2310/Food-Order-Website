import { ChangeEvent } from "react";
import toast from "react-hot-toast";

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
      formData.append("file", files[0]);

      const uploadPromise = new Promise<string | undefined>(
        async (resolve, reject) => {
          try {
            console.log("File to upload:", files[0]);
            console.log("FormData object:", formData.get('file'));
            
            const response = await fetch('/api/users?method=upload', {
              method: 'POST',
              body: formData,
              headers: {
                //
              },
            });
            if (response.ok) {
              const result = await response.json();
              console.log(result);
              const link = result.imagePath;
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
