import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
} from "@nextui-org/react";
import Link from "next/link";
import Order from "@/types/Order";
import { EyeFilledIcon } from "@/icons/EyeFilledIcon";
import { TrashIcon } from "@/icons/TrashIcon";
import { CheckIcon } from "@/icons/CheckIcon";
import { getReadableDateTime } from "@/libs/datetime";
import OrderStatusCell from "./StatusCell";
import { changeStatus } from "@/app/api/orders/route";

interface OrdersTableProps {
  orders?: Order[];
  isAdmin: boolean;
}

const OrdersTable = ({ orders = [], isAdmin }: OrdersTableProps) => {
  const [orderList, setOrderList] = useState(orders);

  useEffect(() => {
    setOrderList(orders);
  }, [orders]);

  const changStatusOrder = async (orderId: any) => {
    try {
      const response = await  changeStatus(orderId);
      const updatedOrder = response.data;
      setOrderList((prevOrders) =>
        prevOrders.map((order) =>
          order.orderId === orderId ? updatedOrder : order
        )
      );
      window.location.assign("/orders");
    } catch (error) {
      console.error("Failed to change order status:", error);
    }
  };

  return (
    <Table
      aria-label="Orders Table"
      isStriped
      topContent={"Total Orders: " + orders.length}
      classNames={{
        th: "text-md text-center",
        td: "text-md text-center text-gray-300",
        table: "gap-4",
      }}
    >
      <TableHeader>
        <TableColumn>Order Number</TableColumn>
        <TableColumn>Order Date</TableColumn>
        <TableColumn>Delivery Date (expected)</TableColumn>
        <TableColumn>Fee</TableColumn>
        <TableColumn>Total</TableColumn>
        <TableColumn>Payment Method</TableColumn>
        <TableColumn>Status</TableColumn>
        <TableColumn>Actions</TableColumn>
      </TableHeader>
      {orderList.length > 0 ? (
        <TableBody>
          {orderList.map((order) => (
            <TableRow key={order.orderId}>
              <TableCell>{order.orderId}</TableCell>
              <TableCell>
                <p className="whitespace-nowrap">
                  {getReadableDateTime(order.orderDate)}
                </p>
              </TableCell>
              <TableCell>
                <p className="whitespace-nowrap">
                  {getReadableDateTime(order.deliveryDate)}
                </p>
              </TableCell>
              <TableCell>{order.fee}</TableCell>
              <TableCell>{order.total}</TableCell>
              <TableCell>{order.payment}</TableCell>
              <TableCell>
                <OrderStatusCell status={order.status} />
              </TableCell>
              <TableCell>
                <div className="relative flex items-center justify-around">
                  <Tooltip content="View order">
                    <Link
                      className="text-lg cursor-pointer active:opacity-50"
                      href={`/orders/${order.orderId}`}
                    >
                      <EyeFilledIcon className={"w-6"} />
                    </Link>
                  </Tooltip>
                  {order.status === 0 && (
                    <Tooltip content="Cancel">
                      <button
                        onClick={() => changStatusOrder(order.orderId)}
                      >
                        <TrashIcon className={"w-6"} />
                      </button>
                    </Tooltip>
                  )}
                  {order.status === 3 && (
                    <Tooltip content="Accept">
                    <button
                      onClick={() => changStatusOrder(order.orderId)}
                    >
                      <CheckIcon className={"w-6"} />
                    </button>
                  </Tooltip>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      ) : (
        <TableBody
          emptyContent={
            isAdmin ? (
              "No orders to display"
            ) : (
              <p>
                You haven&apos;t placed any orders.{" "}
                <Link href={"/menu"} className="text-primary">
                  Start shopping
                </Link>
              </p>
            )
          }
        >
          {[]}
        </TableBody>
      )}
    </Table>
  );
};

export default OrdersTable;
