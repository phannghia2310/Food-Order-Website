"use client";
import { Button, Input, Textarea } from "@nextui-org/react";
import { FormEvent, LegacyRef, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";

const ContactUsForm = () => {
  const [submitting, setSubmitting] = useState(false);
  const [emailValue, setEmailValue] = useState("");
  const validateEmail = (email: string) => {
    return email.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);
  };

  const isInvalid = useMemo(() => {
    if (emailValue === "") return false;
    return validateEmail(emailValue) ? false : true;
  }, [emailValue]);

  const form = useRef<HTMLFormElement>();

  const sendEmail = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (form.current) {
        const formData = new FormData(form.current);
        const contactModel = {
          firstName: formData.get("firstName") as string,
          lastName: formData.get("lastName") as string,
          email: formData.get("fromEmail") as string,
          phone: formData.get("phoneNumber") as string,
          message: formData.get("message") as string,
        };

        await fetch('/api/contact?method=send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(contactModel),
        })
          .then((response) => {
            if (response.ok) {
              toast.success("Inquiry sent successfully");
            } else {
              toast.error("Inquiry sent fail");
              console.log(response);
            }
          })
          .catch((error) => {
            console.log("Error: ", error);
          });
      }
    }
    catch (error) {
      toast.error("Error sending inquiry");
      console.log(error);
    }
    finally {
      (e.target as HTMLFormElement).reset();
      setSubmitting(false);
    }

  };

  return (
    <form
      className="flex flex-col gap-8"
      ref={form as LegacyRef<HTMLFormElement>}
      onSubmit={sendEmail}
    >
      <div className="grid grid-cols-2 gap-4">
        <Input
          isRequired
          label="First Name"
          labelPlacement="outside"
          name="firstName"
          placeholder=" "
          type="text"
        />
        <Input
          isRequired
          label="Last Name"
          labelPlacement="outside"
          name="lastName"
          placeholder=" "
          type="text"
        />
      </div>
      <div className="grid grid-cols-1 gap-4">
        <Input
          isRequired
          label="Email"
          labelPlacement="outside"
          name="fromEmail"
          placeholder=" "
          type="email"
          isInvalid={isInvalid}
          value={emailValue}
          onChange={(e) => setEmailValue(e.target.value)}
          errorMessage={isInvalid && "Please enter a valid email"}
        />
        <Input
          label="Phone Number"
          labelPlacement="outside"
          name="phoneNumber"
          placeholder=" "
          type="tel"
        />
      </div>
      <Textarea
        isRequired
        label="Message"
        labelPlacement="outside"
        name="message"
        placeholder="Enter your inquiry..."
        rows={3}
      />
      <div>
        <Button type="submit" radius="sm" size="md" isLoading={submitting}>
          Send Inquiry
        </Button>
        <p className="text-gray-400 mt-3">
          We&apos;ll get back to you in 1-2 business days. Please check your
          email.
        </p>
      </div>
    </form>
  );
};

export default ContactUsForm;
