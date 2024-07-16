"use client";
import { Button, Divider, Link } from "@nextui-org/react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { FormEvent, useState } from "react";
import EmailInput from "@/components/common/form/EmailInput";
import PasswordInput from "@/components/common/form/PasswordInput";
import { signin, signinWithGoogle } from "../api/users/route";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginInProgress, setLoginInProgress] = useState(false);
  const [error, setError] = useState("");

  async function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoginInProgress(true);
    setError("");

    try {
      const response = await signin({ email, password });
      if (response.status === 200) {
        const { token, user } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("customer", JSON.stringify(user));
        window.location.assign("/");
      } else {
        setError(response.data);
      }
    } catch (err) {
      setError("There's something wrong. Login failed");
      console.log(err);
    }

    setLoginInProgress(false);
  }

  async function handleGoogleLogin(response: any) {
    setLoginInProgress(true);
    setError("");

    try {
      const idToken = response.credential;
      const apiResponse = await signinWithGoogle(idToken);
      console.log(apiResponse);
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

    setLoginInProgress(false);
  }

  const handleGoogleFailure = () => {
    setError("Google login failed");
  };

  return (
    <GoogleOAuthProvider
      clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string}
    >
      <section className="pt-12 pb-20">
        <h1 className="text-center text-primary text-4xl my-4">Login</h1>
        <form
          className="flex flex-col justify-center gap-2 max-w-lg mx-auto mt-12"
          onSubmit={handleFormSubmit}
        >
          <EmailInput
            emailValue={email}
            setEmail={setEmail}
            disabled={loginInProgress}
            className="mb-4"
          />
          <PasswordInput
            passwordValue={password}
            setPassword={setPassword}
            disabled={loginInProgress}
          />
          <div className="text-danger my-2">{error}</div>
          <Button
            type="submit"
            fullWidth
            isLoading={loginInProgress}
            isDisabled={loginInProgress}
            className="font-semibold"
          >
            Login
          </Button>
          <div className="text-center mt-4 text-gray-400">
            dont&apos;t have an account?{" "}
            <Link href={"/register"} isDisabled={loginInProgress}>
              Sign Up
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
      </section>
    </GoogleOAuthProvider>
  );
};

export default LoginPage;
