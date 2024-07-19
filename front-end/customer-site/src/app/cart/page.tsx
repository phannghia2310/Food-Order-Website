"use client";
import AddressInputs from "@/components/common/form/AddressInputs";
import CartProduct from "@/components/features/cart/CartProduct";
import OrderSummary from "@/components/features/cart/OrderSummary";
import { useProfile } from "@/components/hooks/useProfile";
import { CartContext, calCartProductPrice } from "@/util/ContextProvider";
import { ChevronLeftIcon } from "@/icons/ChevronLeftIcon";
import { Button, Link } from "@nextui-org/react";
import React, { FormEvent, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  codPayment,
  createPayPalOrder,
} from "../api/checkout/route";

interface ProfileInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
}

const CartPage = () => {
  const { cartProducts, removeCartProduct, clearCart } =
    useContext(CartContext);
  const [info, setInfo] = useState<Partial<ProfileInfo>>({});
  const { data: profileData } = useProfile();
  const [isSubmit, setIsSubmit] = useState(false);

  useEffect(() => {
    if (profileData) {
      const { name, email, phone, address } = profileData;
      setInfo({ name, email, phone, address });
    }
  }, [profileData]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.location.href.includes("canceled=1")) {
        toast.error("Payment failed 🙁");
      }
    }
  }, [clearCart]);

  let subtotal = 0;
  cartProducts.forEach((cartProduct) => {
    subtotal += calCartProductPrice(cartProduct) as number;
  });

  function handleInfoChange(propName: string, value: string): void {
    setInfo((prevInfo) => ({ ...prevInfo, [propName]: value }));
  }

  async function proceedToCheckOut(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmit(true);

    const orderDetails = cartProducts.map((product) => ({
      productId: product.product.productId,
      price: product.product.price,
      quantity: 1,
    }));

    const orderModel = {
      userId: profileData?.userId,
      fee: 5,
      total: subtotal + 5,
      customerName: info.name,
      customerEmail: info.email,
      address: info.address,
      phone: info.phone,
      details: orderDetails,
    };

    try {
      const orderResponse = await codPayment(orderModel);
      toast.success("Payment success!");
      clearCart();
      setTimeout(() => {
        window.location.assign("/");
      }, 2000);
    } catch (error) {
      toast.error("Something went wrong, please try again later.");
      console.log(error);
    } finally {
      setIsSubmit(false);
    }
  }

  async function proceedToPayPal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmit(true);

    const orderDetails = cartProducts.map((product) => ({
      productId: product.product.productId,
      price: product.product.price,
      quantity: 1,
    }));

    const orderModel = {
      userId: profileData?.userId,
      fee: 5,
      total: subtotal + 5,
      customerName: info.name,
      customerEmail: info.email,
      address: info.address,
      phone: info.phone,
      details: orderDetails,
    };

    localStorage.setItem("orderModel", JSON.stringify(orderModel));

    try {
      const response = await createPayPalOrder(orderModel);
      const { approvalUrl } = response.data;
      window.location.assign(approvalUrl);
    } catch (error) {
      toast.error("Something went wrong, please try again later.");
      console.log(error);
    } finally {
      setIsSubmit(false);
    }
  }

  if (cartProducts.length === 0) {
    return (
      <section className="max-w-2xl mx-auto my-16">
        <div className="my-4 flex flex-col gap-4 items-center">
          <p className="text-3xl font-semibold">Your Shopping Cart is Empty</p>
          <a href="/menu" className="text-primary font-semibold">
            <span>Continue shopping</span>
          </a>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-10 pb-20 max-w-6xl mx-auto">
      <a href="/menu" className="text-primary font-semibold">
        <ChevronLeftIcon className={"w-4 mr-2"} />
        <span>Continue shopping</span>
      </a>
      {cartProducts.length > 0 && (
        <div className="grid grid-cols-5 mt-8 gap-12">
          <div className="col-span-3">
            <h2 className="border-b-1 font-semibold py-3 text-primary">Cart</h2>
            <div>
              {cartProducts.map((product, index) => (
                <CartProduct
                  key={index}
                  product={product}
                  onRemove={() => removeCartProduct(index)}
                  productPrice={calCartProductPrice(product)}
                />
              ))}
            </div>
            <OrderSummary
              subtotal={subtotal}
              deliveryFee={5}
              discount={0}
              status={1}
            />
          </div>
          <div className="col-span-2">
            <h2 className="font-semibold py-3 text-primary">Check Out</h2>
            <div className="rounded-xl p-6 bg-gray-800">
              <form
                className="flex flex-col gap-3 mt-3"
                onSubmit={proceedToCheckOut}
              >
                <div>
                  <AddressInputs
                    addressProps={info}
                    setAddressProps={handleInfoChange}
                    disabled={false}
                  />
                </div>
                <Button type="submit" color="primary" fullWidth disabled={isSubmit}>
                  Cash on Delivery
                </Button>
              </form>
              <form
                className="flex flex-col gap-3 mt-3"
                onSubmit={proceedToPayPal}
              >
                <Button type="submit" color="primary" fullWidth disabled={isSubmit}>
                  Pay with PayPal
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CartPage;
