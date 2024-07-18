import CartProduct from "./CartProduct"

type Order = {
  orderId?: string,
  orderDate: string,
  deliveryDate: string,
  fee: string,
  total: string,
  customerName: string,
  customerEmail: string,
  address: string,
  phone: string,
  payment: string,
  status: number,
  orderDetails: CartProduct[],
}

export default Order;