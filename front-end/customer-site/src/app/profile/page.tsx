"use client";
import { useProfile } from "@/components/hooks/useProfile";
import ProfileForm from "@/components/common/form/ProfileForm";
import UserTabs from "@/components/layout/UserTabs";
import UserProfile from "@/types/UserProfile";
import { redirect } from "next/navigation";
import React, { FormEvent, useEffect } from "react";
import toast from "react-hot-toast";
import Loader from "@/components/common/Loader";

const ProfilePage = () => {
  const { data: profileData, loading } = useProfile();

  useEffect(() => {
    if (!loading && !profileData) {
      redirect("/login");
    }
  }, [loading, profileData]);

  if (loading) {
    return <Loader className={""} />;
  }

  async function handleProfileUpdate(
    event: FormEvent<HTMLFormElement>,
    data: UserProfile
  ) {
    event.preventDefault();

    const savingPromise = new Promise(async (resolve, reject) => {
      try {
        const response = await fetch("/api/users?method=update", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: profileData?.userId, data }),
        });
        if (response.ok) {
          resolve(response);
          console.log(response);
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else {
          reject();
        }
      } catch (error) {
        reject(error);
        console.log(error);
      }
    });

    toast.promise(savingPromise, {
      loading: "Saving...",
      success: "Profile saved!",
      error: "Error saving profile",
    });
  }

  return (
    <section className="pt-10 pb-20">
      {profileData && (
        <>
          <UserTabs
            admin={profileData.isAdmin}
            className={
              profileData.isAdmin ? "max-w-6xl mx-auto" : "max-w-2xl mx-auto"
            }
          />
          <div className="mt-16 max-w-2xl mx-auto">
            <ProfileForm
              user={profileData}
              onSave={(event, data) => handleProfileUpdate(event, data)}
            />
          </div>
        </>
      )}
    </section>
  );
};

export default ProfilePage;
