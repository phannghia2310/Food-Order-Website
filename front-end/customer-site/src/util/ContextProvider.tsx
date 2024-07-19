"use client";
import CartProduct from "@/types/CartProduct";
import type CartContext from "@/types/CartContext";
import MenuItem from "@/types/MenuItem";
import { SessionProvider } from "next-auth/react";
import { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export const CartContext = createContext<CartContext>({} as CartContext);

export function calCartProductPrice(product: CartProduct): number {
  if (product && product.product && product.product.price !== undefined) {
    return (product.product.price as number) * product.quantity;
  }
  return 0;
}

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [cartProducts, setCartProducts] = useState<CartProduct[]>([]);
  const ls = typeof window !== "undefined" ? window.localStorage : null;

  useEffect(() => {
    if (ls && ls.getItem("cart")) {
      setCartProducts(JSON.parse(ls.getItem("cart")!));
    }
  }, [ls]);

  function addToCart(
    product: MenuItem
  ) {
    setCartProducts((prevProducts) => {
      const newProducts = [
        ...prevProducts,
        { product, quantity: 1 },
      ];
      saveCartProductsToLocalStorage(newProducts);
      return newProducts;
    });
    toast.success("Added to cart");
  }

  function clearCart() {
    setCartProducts([]);
    saveCartProductsToLocalStorage([]);
  }

  function removeCartProduct(indexToRemove: number) {
    setCartProducts((prevProducts) => {
      const newProducts = prevProducts.filter(
        (v, index) => index !== indexToRemove
      );
      saveCartProductsToLocalStorage(newProducts);
      return newProducts;
    });
    toast.success("Product removed from cart");
  }

  function saveCartProductsToLocalStorage(cartProducts: CartProduct[]) {
    if (ls) {
      ls.setItem("cart", JSON.stringify(cartProducts));
    }
  }

  return (
    <SessionProvider>
      <CartContext.Provider
        value={{
          cartProducts,
          setCartProducts,
          addToCart,
          clearCart,
          removeCartProduct,
        }}
      >
        {children}
      </CartContext.Provider>
    </SessionProvider>
  );
};
