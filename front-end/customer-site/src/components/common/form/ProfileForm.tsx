import React, { FormEvent, useState } from "react";
import ImageUploader from "../ImageUploader";
import { Avatar, Button, Checkbox } from "@nextui-org/react";
import { PencilIcon } from "@/icons/PencilIcon";
import UserProfile from "@/types/UserProfile";
import { useProfile } from "../../hooks/useProfile";
import AddressInputs from "./AddressInputs";

interface ProfileFormProps {
  user: UserProfile | null;
  onSave: (event: FormEvent<HTMLFormElement>, data: UserProfile) => void;
}

const ProfileForm = ({ user, onSave }: ProfileFormProps) => {
  const [userName, setUserName] = useState(user?.name || "");
  const [userImage, setUserImage] = useState(user?.imageUrl || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.address || "");
  const [isAdmin, setIsAdmin] = useState(user?.isAdmin || false);
  const { data: loggedInUserData } = useProfile();

  function handleAddressChange(propName: string, value: string): void {
    if (propName === "phone") setPhone(value);
    if (propName === "address") setAddress(value);
  }

  return (
    <div className="grid grid-cols-6 gap-4">
      <div className="col-span-2">
        <ImageUploader setImageLink={setUserImage}>
          <div className="relative">
            {userImage ? (
              <Avatar
                src={`/assets/user/${userImage!}`}
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
            isAdmin,
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
        <AddressInputs
          addressProps={{ phone, address }}
          setAddressProps={(propName: string, value: string) =>
            handleAddressChange(propName, value)
          }
          disabled={false}
        />
        {loggedInUserData?.isAdmin && (
          <div className="my-2">
            <Checkbox
              checked={isAdmin}
              defaultSelected={isAdmin}
              value={"1"}
              onChange={(e) => setIsAdmin(e.target.checked)}
            >
              Admin
            </Checkbox>
          </div>
        )}
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
