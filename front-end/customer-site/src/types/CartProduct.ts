import MenuItem from "./MenuItem";

type CartProduct = {
  productId?: string;
  product: MenuItem;
  quantity: number;
};

export default CartProduct;
