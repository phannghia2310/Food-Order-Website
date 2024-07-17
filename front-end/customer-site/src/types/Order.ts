import CartProduct from "./CartProduct"

type Order = {
  orderId?: string,
  orderDate: string,
  deliveryDate: string,
  fee: string,
  total: string,
  customerName: string,
  address: string,
  phone: string,
  payment: string,
  status: string,
  cartProducts: CartProduct[],
}

export default Order;