import React, { useEffect, useState } from "react";
import { Typography, Button } from "@material-tailwind/react";
import { getDetailByOrder } from "@/api/orderApi";

const ViewOrderDetailPopup = ({ isOpen, onClose, order }) => {
    const [details, setDetails] = useState([]);

    useEffect(() => {
        if (order) {
            getDetailByOrder(order.orderId).then(res => {
                setDetails(res.data);
            }).catch(err => {
                console.log(err);
            });
        }
    }, [order]);

    return (
        <div className={`fixed inset-0 z-50 overflow-y-auto ${isOpen ? "" : "hidden"}`}>
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
                    <div className="flex justify-between items-center px-6 py-4 bg-gray-200">
                        <Typography variant="h6" color="gray" className="font-bold">
                            Order Details
                        </Typography>
                        <Button
                            color="red"
                            type="button"
                            size="regular"
                            rounded={true}
                            onClick={onClose}
                        >
                            Close
                        </Button>
                    </div>
                    <table className="w-full table-auto">
                        <thead>
                            <tr>
                                {["Order Id", "Order Detail Id", "Product Name", "Price", "Quantity", "Image"].map((el) => (
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
                            {details.map((detail, key) => {
                                const className = `py-3 px-5 ${key === details.length - 1 ? "" : "border-b border-blue-gray-50"
                                    }`;

                                return (
                                    <tr key={detail.orderDetailId}>
                                        <td className={className}>
                                            <Typography className="text-xs font-semibold text-blue-gray-600">
                                                {detail.orderId}
                                            </Typography>
                                        </td>
                                        <td className={className}>
                                            <Typography className="text-xs font-semibold text-blue-gray-600">
                                                {detail.orderDetailId}
                                            </Typography>
                                        </td>
                                        <td className={className}>
                                            <Typography className="text-xs font-semibold text-blue-gray-600">
                                                {detail.productName}
                                            </Typography>
                                        </td>
                                        <td className={className}>
                                            <Typography className="text-xs font-semibold text-blue-gray-600">
                                                {detail.price}
                                            </Typography>
                                        </td>
                                        <td className={className}>
                                            <Typography className="text-xs font-semibold text-blue-gray-600">
                                                {detail.quantity}
                                            </Typography>
                                        </td>
                                        <td className={className}>
                                            <img
                                                src={`/img/product/${detail.imageUrl}`}
                                                alt={detail.productName}
                                                className="w-20 h-20 object-cover"
                                            />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ViewOrderDetailPopup;
