"use client";
import { Button, Divider, Link } from "@nextui-org/react";
import { FormEvent, useState } from "react";
import ModalContainer from "@/components/common/ModalContainer";
import EmailInput from "@/components/common/form/EmailInput";
import PasswordInput from "@/components/common/form/PasswordInput";
import NameInput from "@/components/common/form/NameInput";
import { useRouter } from "next/navigation";
import { registerUser, signinWithGoogle } from "../api/users/api";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [creatingUser, setCreatingUser] = useState(false);
  const [userCreated, setUserCreated] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreatingUser(true);
    setError("");

    try {
      const response = await registerUser(name, email, password);
      if (response.status === 200) {
        setUserCreated(true);
      }
    } catch (error: any) {
      if(error.response != null) {
        setError(error.response.data);
      }
      else {
        setError("An error occurred while registering. Please try again.");
      }
      console.log(error);
    } finally {
      setCreatingUser(false);
    }
  }

  async function handleGoogleLogin(response: any) {
    setError("");

    try {
      const idToken = response.credential;
      const apiResponse = await signinWithGoogle(idToken);
      if (apiResponse.status === 200) {
        const { token, user } = apiResponse.data;
        localStorage.setItem("token", token);
        localStorage.setItem("customer", JSON.stringify(user));
        window.location.assign("/");
      } else {
        setError(apiResponse.data);
      }
    } catch (err) {
      setError("There's something wrong. Google login failed");
      console.log(err);
    }
  }

  const handleGoogleFailure = () => {
    setError("Google login failed");
  };
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string}>
      <section className="pt-12 pb-20">
        <h1 className="text-center text-primary text-4xl my-4">Sign Up</h1>
        <form
          className="flex flex-col gap-2 max-w-lg mx-auto mt-12"
          onSubmit={handleFormSubmit}
        >
          <NameInput
            nameValue={name}
            setName={setName}
            disabled={creatingUser}
            className={"mb-4"}
          />
          <EmailInput
            emailValue={email}
            setEmail={setEmail}
            disabled={creatingUser}
            className={"mb-4"}
          />
          <PasswordInput
            passwordValue={password}
            setPassword={setPassword}
            disabled={creatingUser}
          />
          <div className="text-danger my-2">{error}</div>
          <Button
            type="submit"
            color="primary"
            fullWidth
            isLoading={creatingUser}
            isDisabled={creatingUser}
            className="font-semibold"
          >
            Sign Up
          </Button>
          <div className="text-center mt-4 text-gray-400">
            Already have an account?{" "}
            <Link href={"/login"} isDisabled={creatingUser}>
              Login
            </Link>
          </div>
          <div className="my-3 text-center grid grid-cols-3 items-center">
            <Divider />
            OR
            <Divider />
          </div>
          <div className="flex justify-center items-center w-full">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={handleGoogleFailure}
              theme="outline"
            />
          </div>
        </form>
        <ModalContainer
          isOpen={userCreated}
          title={"Registration successful"}
          content={"You can now log in."}
          confirmText={"OK"}
          onConfirm={() => setUserCreated(false)}
          closeText="Login"
          onClose={() => router.push("/login")}
        />
      </section>
    </GoogleOAuthProvider>
  );
};

export default RegisterPage;
