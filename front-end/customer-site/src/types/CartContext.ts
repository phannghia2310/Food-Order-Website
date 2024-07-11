import { Dispatch, SetStateAction } from "react";
import CartProduct from "./CartProduct";
import MenuItem from "./MenuItem";

type CartContext = {
  cartProducts: CartProduct[];
  setCartProducts: Dispatch<SetStateAction<CartProduct[]>>;
  addToCart: (menuItem: MenuItem) => void;
  clearCart: () => void;
  removeCartProduct: (index: number) => void;
};

export default CartContext;
