import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, Typography, Avatar, Chip, Button } from "@material-tailwind/react";
import { getAllStatus } from "@/api/statusApi";
import CreateStatusPopup from "@/popup/status/createStatusPopup";
import UpdateStatusPopup from "@/popup/status/updateStatusPopup";
import DeleteStatusPopup from "@/popup/status/deleteStatusPopup";

export function Status() {
    const [statuses, setStatuses] = useState([]);
    const [isCreateStatusOpen, setIsCreateStatusOpen] = useState(false);
    const [isUpdateStatusOpen, setIsUpdateStatusOpen] = useState(false);
    const [isDeleteStatusOpen, setIsDeleteStatusOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(null);

    useEffect(() => {
        getAllStatus().then((response) => {
            setStatuses(response.data);
        }).catch(error => {
            console.error(error);
        });
    }, []);

    const openCreateStatusPopup = () => {
        setIsCreateStatusOpen(true);
    };

    const closeCreateStatusPopup = () => {
        setIsCreateStatusOpen(false);
    };

    const openUpdateStatusPopup = (status) => {
        setSelectedStatus(status);
        setIsUpdateStatusOpen(true);
    }

    const closeUpdateStatusPopup = () => {
        setIsUpdateStatusOpen(false);
    };

    const openDeleteStatusPopup = (status) => {
        setSelectedStatus(status)
        setIsDeleteStatusOpen(true);
    };

    const closeDeleteStatusPopup = () => {
        setIsDeleteStatusOpen(false);
    };

    return (
        <div className="mt-12 mb-8 flex flex-col gap-12">
          <Card>
            <CardHeader variant="gradient" color="gray" className="flex justify-between mb-8 p-6">
              <Typography variant="h6" color="white">
                Manage Status
              </Typography>
              <Button onClick={openCreateStatusPopup} className="flex items-center transition duration-500" color="green">
                Create Status
              </Button>
            </CardHeader>
            <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
              <table className="w-full min-w-[640px] table-auto">
                <thead>
                  <tr>
                    {["Status Id", "Description", ""].map((el) => (
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
                  {statuses.map(
                    (status, key) => {
                      const className = `py-3 px-5 ${
                        key === statuses.length - 1
                          ? ""
                          : "border-b border-blue-gray-50"
                      }`;
    
                      return (
                        <tr key={status.statusId}>
                          <td className={className}>
                            <Typography className="text-xs font-semibold text-blue-gray-600">
                              {status.statusId}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography className="text-xs font-semibold text-blue-gray-600">
                              {status.description}
                            </Typography>
                          </td>  
                          <td className={className}>
                            <div className="flex items-center gap-4">
                                <Typography
                                    as="a"
                                    href="#"
                                    onClick={() => openUpdateStatusPopup(status)}
                                    className="text-xs font-semibold text-blue-gray-600 hover:text-yellow-800 transition duration-300"
                                >
                                    Edit
                                </Typography>
                                <Typography
                                    as="a"
                                    href="#"
                                    onClick={() => openDeleteStatusPopup(status)}
                                    className="text-xs font-semibold text-blue-gray-600 hover:text-red-800 transition duration-300"
                                >
                                    Delete
                                </Typography>
                            </div>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </CardBody>
          </Card>
          <CreateStatusPopup isOpen={isCreateStatusOpen} onClose={closeCreateStatusPopup} />
          <UpdateStatusPopup isOpen={isUpdateStatusOpen} onClose={closeUpdateStatusPopup} status={selectedStatus} />
          <DeleteStatusPopup isOpen={isDeleteStatusOpen} onClose={closeDeleteStatusPopup} status={selectedStatus} />
        </div>
    );
 }; 

export default Status;