import React, { FormEvent, useState } from "react";
import ImageUploader from "../ImageUploader";
import { Avatar, Button } from "@nextui-org/react";
import { PencilIcon } from "@/icons/PencilIcon";
import UserProfile from "@/types/UserProfile";


interface ProfileFormProps {
  user: UserProfile | null;
  onSave: (event: FormEvent<HTMLFormElement>, data: UserProfile) => void;
}

const ProfileForm = ({ user, onSave }: ProfileFormProps) => {
  const [userName, setUserName] = useState(user?.name || "");
  const [userImage, setUserImage] = useState(user?.imageUrl || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.address || "");

  const getBlobUrl = (imageUrl: any) => {
    const containerUrl = process.env.NEXT_PUBLIC_AZURE_BLOB_URL;
    return `${containerUrl}/${imageUrl}`;
  };

  return (
    <div className="grid grid-cols-6 gap-4">
      <div className="col-span-2">
        <ImageUploader setImageLink={setUserImage}>
          <div className="relative">
            {userImage ? (
              <Avatar
                src={getBlobUrl(userImage)}
                className="w-[160px] h-[160px]"
              />
            ) : (
              <Avatar src="" showFallback className="w-[160px] h-[160px]" />
            )}
            <div className="bg-primary text-dark rounded-full p-2 absolute right-11 bottom-6 hover:text-white">
              <PencilIcon className={"w-5"} />
            </div>
          </div>
        </ImageUploader>
      </div>
      <form
        className="col-span-4"
        onSubmit={(e) =>
          onSave(e, {
            name: userName,
            imageUrl: userImage,
            phone,
            address,
            isAdmin: false,
          })
        }
      >
        <label> Full name</label>
        <input
          type="text"
          placeholder="Full name"
          value={userName ?? ""}
          onChange={(e) => setUserName(e.target.value)}
          className="input"
        />
        <label> Email</label>
        <input
          type="email"
          placeholder="Email"
          value={user?.email ?? ""}
          disabled
          className="input"
        />
        <label> Phone number</label>
        <input
          type="tel"
          placeholder="Phone number"
          pattern="[0-9]{10}"
          value={phone ?? ""}
          onChange={(e) => setPhone(e.target.value)}
          className="input"
        />
        <label> Address</label>
        <input
          type="text"
          placeholder="Address"
          value={address ?? ""}
          onChange={(e) => setAddress(e.target.value)}
          className="input"
        />
        <Button
          type="submit"
          className="mt-2 font-semibold hover:text-white"
          fullWidth
        >
          Save All Changes
        </Button>
      </form>
    </div>
  );
};

export default ProfileForm;
