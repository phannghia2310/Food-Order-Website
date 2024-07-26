"use client";

import { useEffect, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { CartContext } from "@/util/ContextProvider";
import toast from "react-hot-toast";

const SuccessPage = () => {
  const router = useRouter();
  const { clearCart } = useContext(CartContext);
  const [token, setToken] = useState<string | null>(null);
  const [orderModel, setOrderModel] = useState<any | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const queryParams = new URLSearchParams(window.location.search);
      const token = queryParams.get("token");
      if (token) {
        setToken(token);
      }

      const savedOrderModel = localStorage.getItem("orderModel");
      if (savedOrderModel) {
        setOrderModel(JSON.parse(savedOrderModel));
      }
    }
  }, []);

  useEffect(() => {
    if (token && orderModel) {
      fetch(`/api/checkout?method=capture-paypal-order&orderId=${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderModel),
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((error) => {
              throw new Error(error.error || "Failed to capture PayPal order");
            });
          }
          return response.json();
        })
        .then(() => {
          toast.success("Payment success!");
          clearCart();
          setToken(null);
          localStorage.removeItem("orderModel");
          setTimeout(() => {
            router.push("/");
          }, 2000);
        })
        .catch(() => {
          toast.error("Something went wrong, please try again later.");
        });
    }
  }, [token, orderModel, clearCart, router]);

  return (
    <section className="max-w-2xl mx-auto my-16">
      <div className="my-4 flex flex-col gap-4 items-center">
        <p className="text-3xl font-semibold">Processing your payment...</p>
      </div>
    </section>
  );
};

export default SuccessPage;
