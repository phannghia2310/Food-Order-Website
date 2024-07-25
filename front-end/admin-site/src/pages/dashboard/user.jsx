import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Avatar,
    Chip,
    Button
  } from "@material-tailwind/react";
import { getAllUser } from "@/api/userApi";
import { useEffect, useState } from "react";
import UserImage from "/img/user/default-user.png";
import CreateUserPopUp from "@/popup/user/createUserPopup";
import UpdateUserPopup from "@/popup/user/updateUserPopup";
import DeleteUserPopup from "@/popup/user/deleteUserPopup";

export function User() {
    const [users, setUsers] = useState([]);
    const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
    const [isUpdateUserOpen, setIsUpdateUserOpen] = useState(false);
    const [isDeleteUserOpen, setIsDeleteUserOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        getAllUser().then(response => {
            setUsers(response.data);
        }).catch(error => {
            console.error(error);
        });
    }, []);

    const openCreateUserPopup = () => {
      setIsCreateUserOpen(true);
    };

    const closeCreateUserPopup = () => {
      setIsCreateUserOpen(false);
    };

    const openUpdateUserPopup = (user) => {
      setSelectedUser(user);
      setIsUpdateUserOpen(true);
    };

    const closeUpdateUserPopup = () => {
      setIsUpdateUserOpen(false);
    };

    const openDeleteUserPopup = (user) => {
      setSelectedUser(user);
      setIsDeleteUserOpen(true);
    };

    const closeDeleteUserPopup = () => {
      setIsDeleteUserOpen(false);
    };

    const getBlobUrl = (imageUrl) => {
      const containerUrl = import.meta.env.VITE_AZURE_BLOB_URL;
      return imageUrl ? `${containerUrl}/${imageUrl}` : DefaultProduct;
  };

    return (
        <div className="mt-12 mb-8 flex flex-col gap-12">
          <Card>
            <CardHeader variant="gradient" color="gray" className="flex justify-between mb-8 p-6">
              <Typography variant="h6" color="white">
                Manage User
              </Typography>
              <Button onClick={openCreateUserPopup} className="flex items-center transition duration-500" color="green">
                Create User
              </Button>
            </CardHeader>
            <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
              <table className="w-full min-w-[640px] table-auto">
                <thead>
                  <tr>
                    {["Image", "Name", "UserName", "Email", "Phone", "Address", "IsAdmin", ""].map((el) => (
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
                  {users.map(
                    (user, key) => {
                      const className = `py-3 px-5 ${
                        key === users.length - 1
                          ? ""
                          : "border-b border-blue-gray-50"
                      }`;
    
                      return (
                        <tr key={user.userId}>
                          <td className={className}>
                            <Avatar
                              src={user.imageUrl ? getBlobUrl(user.imageUrl) : UserImage}
                              alt="user-image"
                              size="xl"
                              variant="rounded"
                              className="rounded-lg shadow-lg shadow-blue-gray-500/40"
                            />
                          </td>
                          <td className={className}>
                            <Typography className="text-xs font-semibold text-blue-gray-600">
                              {user.name}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography className="text-xs font-semibold text-blue-gray-600">
                              {user.username}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography className="text-xs font-semibold text-blue-gray-600">
                              {user.email}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography className="text-xs font-semibold text-blue-gray-600">
                              {user.phone}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography className="text-xs font-semibold text-blue-gray-600">
                              {user.address}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Chip
                              variant="gradient"
                              color={user.isAdmin ? "green" : "blue-gray"}
                              value={user.isAdmin ? "admin" : "none"}
                              className="py-0.5 px-2 text-[11px] font-medium w-fit"
                            />
                          </td>
                          <td className={className}>
                            <div className="flex items-center gap-4">
                                <Typography
                                    as="a"
                                    href="#"
                                    onClick={() => openUpdateUserPopup(user)}
                                    className="text-xs font-semibold text-blue-gray-600 hover:text-yellow-800 transition duration-300"
                                >
                                    Edit
                                </Typography>
                                <Typography
                                    as="a"
                                    href="#"
                                    onClick={() => openDeleteUserPopup(user)}
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
          <CreateUserPopUp isOpen={isCreateUserOpen} onClose={closeCreateUserPopup} />
          <UpdateUserPopup isOpen={isUpdateUserOpen} onClose={closeUpdateUserPopup} user={selectedUser} />
          <DeleteUserPopup isOpen={isDeleteUserOpen} onClose={closeDeleteUserPopup} user={selectedUser} />
        </div>
    );
}

export default User;