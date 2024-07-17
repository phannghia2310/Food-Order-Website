import MenuItem from "./MenuItem";

type CartProduct = {
  productId?: string;
  menuItem: MenuItem;
  quantity: number;
};

export default CartProduct;
