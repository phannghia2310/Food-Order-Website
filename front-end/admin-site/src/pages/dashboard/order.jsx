import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, Typography, Avatar, Chip, Button } from "@material-tailwind/react";
import { getOrderByStatus, changeOrderStatus } from "@/api/orderApi";
import { getAllStatus } from "@/api/statusApi";
import ViewOrderDetailPopup from "@/popup/order/viewOrderDetailPopup";

export function Order() {
    const [orders, setOrders] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isViewDetailOpen, setIsViewDetailOpen] = useState(false);

    useEffect(() => {
        getAllStatus().then((res) => {
            setStatuses(res.data);
            if(res.data.length > 0) {
                setSelectedStatus(res.data[0].statusId);
                fetchOrdersByStatus(res.data[0].statusId);
            }
        }).catch(error => {
            console.error(error);
        });
    }, []);

    const fetchOrdersByStatus = (statusId) => {
        getOrderByStatus(statusId).then((res) => {
            setOrders(res.data);
            setSelectedStatus(statusId);
        }).catch((error) => {
            console.error(error);
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 0:
            case 2:
                return "yellow";
            case 1:
            case 3:
            case 4:
                return "green";
            case 5:
                return "red";
            default:
                return "blue-gray";
        }
    };

    const getStatusDescription = (statusId) => {
        const status = statuses.find((s) => s.statusId === statusId);
        return status ? status.description : "Unknown";
    };

    const openViewOrderDetailPopup = (order) => {
        setSelectedOrder(order)
        setIsViewDetailOpen(true);
    };

    const closeViewOrderDetailPopup = () => {
        setIsViewDetailOpen(false);
    };

    const handleChangeStatus = async (orderId) => {
        try {
            const response = await changeOrderStatus(orderId);
            const updatedOrder = response.data;
            // Update orders list with the updated order
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.orderId === updatedOrder.orderId ? updatedOrder : order
                )
            );
            window.location.assign("/dashboard/order");
        } catch (error) {
            console.error("Error changing order status:", error);
        }
    };

    return (
        <div className="mt-12 mb-8 flex flex-col gap-12">
            <Card>
                <CardHeader variant="gradient" color="gray" className="flex justify-between mb-8 p-6">
                    <Typography variant="h6" color="white">
                        Manage Order
                    </Typography>
                </CardHeader>
                <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
                    <div className="mb-4 flex justify-center gap-4">
                        {statuses.map((status) => (
                            <Button
                                key={status.statusId}
                                color={selectedStatus === status.statusId ? "blue" : "black"}
                                onClick={() => fetchOrdersByStatus(status.statusId)}
                            >
                                {status.description}
                            </Button>
                        ))}
                    </div>
                    <table className="w-full min-w-[640px] table-auto">
                        <thead>
                            <tr>
                                {["Order Id", "User Id", "Order Date", "Delivery Date", "Total", "Payment Method", "Status", ""].map((el) => (
                                    <th
                                        key={el}
                                        className="border-b border-blue-gray-50 py-3 px-5 text-left"
                                    >
                                        <Typography
                                            variant="small"
                                            className="text-[11px] font-bold uppercase text-blue-gray-400"
                                        >
                                            {el}
                                        </Typography>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order, key) => {
                                const className = `py-3 px-5 ${
                                    key === orders.length - 1 ? "" : "border-b border-blue-gray-50"
                                }`;

                                return (
                                    <tr key={order.orderId}>
                                        <td className={className}>
                                            <Typography className="text-xs font-semibold text-blue-gray-600">
                                                {order.orderId}
                                            </Typography>
                                        </td>
                                        <td className={className}>
                                            <Typography className="text-xs font-semibold text-blue-gray-600">
                                                {order.userId}
                                            </Typography>
                                        </td>
                                        <td className={className}>
                                            <Typography className="text-xs font-semibold text-blue-gray-600">
                                                {order.orderDate}
                                            </Typography>
                                        </td>
                                        <td className={className}>
                                            <Typography className="text-xs font-semibold text-blue-gray-600">
                                                {order.deliveryDate}
                                            </Typography>
                                        </td>
                                        <td className={className}>
                                            <Typography className="text-xs font-semibold text-blue-gray-600">
                                                {order.total}
                                            </Typography>
                                        </td>
                                        <td className={className}>
                                            <Typography className="text-xs font-semibold text-blue-gray-600">
                                                {order.payment}
                                            </Typography>
                                        </td>
                                        <td className={className}>
                                            <Chip
                                                variant="gradient"
                                                color={getStatusColor(order.status)}
                                                value={getStatusDescription(order.status)}
                                                className="py-0.5 px-2 text-[11px] font-medium w-fit"
                                            />
                                        </td>
                                        <td className={className}>
                                            <div className="flex items-center gap-4">
                                                <Typography
                                                    as="a"
                                                    href="#"
                                                    onClick={() => openViewOrderDetailPopup(order)}
                                                    className="text-xs font-semibold text-blue-gray-600 hover:text-yellow-800 transition duration-300"
                                                >
                                                    View Details
                                                </Typography>
                                                <Typography
                                                    as="a"
                                                    href="#"
                                                    onClick={() => handleChangeStatus(order.orderId)}
                                                    className="text-xs font-semibold text-blue-gray-600 hover:text-green-800 transition duration-300"
                                                >
                                                    Accept
                                                </Typography>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </CardBody>
            </Card>
            <ViewOrderDetailPopup isOpen={isViewDetailOpen} onClose={closeViewOrderDetailPopup} order={selectedOrder} />
        </div>
    );
};

export default Order;