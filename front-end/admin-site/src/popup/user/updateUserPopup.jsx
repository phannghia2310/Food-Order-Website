import React, { useEffect, useState, useRef } from "react";
import { Typography, Input, Button } from "@material-tailwind/react";
import { updateUser, uploadImage } from "@/api/userApi";
import DefaultLogo from "/img/user/default-user.png";

const UpdateUserPopup = ({ isOpen, onClose, user }) => {
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const [image, setImage] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (user) {
            setFormData(user);
            setImage(user.imageUrl);
        }
    }, [user]);

    const validateUpdate = () => {
        let valid = true;
        const newErrors = {};

        if (!formData.name) {
            newErrors.name = "Name is required";
            valid = false;
        }
        if (!formData.username) {
            newErrors.username = "Username is required";
            valid = false;
        }
        if (!formData.email) {
            newErrors.email = "Email is required";
            valid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email address is invalid";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if(validateUpdate()) {
            try {
                if(selectedFile) {
                    const imageResponse = await uploadImage(selectedFile);
                    console.log(imageResponse);
    
                    if(imageResponse.status !== 200) {
                        throw new Error('Image upload failed');
                    }
    
                    const { imagePath } = imageResponse.data;
    
                    formData.image = imagePath;
                }
                else {
                    formData.image = user.imageUrl;
                }
    
                const response = await updateUser(formData);
                console.log(response.data);
                window.location.reload();
            } catch (err) {
                console.error(err);
                const newErrors = {};
                if(err.response.data === "Username is already in use") {
                    newErrors.username = err.response.data;
                } else {
                    newErrors.email = err.response.data;
                }
                setErrors(newErrors);
            }
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        const newValue = type === 'checkbox' ? checked : files ? files[0] : value;
        setFormData(prevData => ({
            ...prevData,
            [name]: newValue,
        }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
            setSelectedFile(file);
        }
    };

    const handleButtonClick = (e) => {
        e.preventDefault();
        fileInputRef.current.click();
    };

    return (
        <div className={`fixed inset-0 z-50 overflow-y-auto ${isOpen ? "" : "hidden"}`}>
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <form>
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div className="sm:flex sm:items-start">
                                <div className="w-full">
                                    <div className="flex flex-col w-full justify-center items-center">
                                        <img
                                            className="rounded-full w-44 h-44"
                                            src={image ? (image === user.imageUrl ? `/img/user/${image}` : image) : DefaultLogo}
                                            alt="User Image"
                                            style={{ objectFit: "cover" }}
                                        />
                                        <button
                                            className="font-medium my-[10px] p-[4px] border border-2 bg-green-700 hover:bg-green-800 text-white"
                                            onClick={handleButtonClick}
                                        >
                                            Tải ảnh lên
                                        </button>
                                        <input
                                            type="file"
                                            name="imageUrl"
                                            id="imageUrl"
                                            ref={fileInputRef}
                                            onChange={handleImageUpload}
                                            style={{ display: "none" }}
                                            accept="image/*"
                                        />
                                    </div>
                                    <Typography variant="small" color="blue-gray" className="font-medium">Name</Typography>
                                    <Input type="text" name="name" id="name" size="lg" value={formData.name || ''} onChange={handleChange}  error={errors.name}/>
                                    {errors.name && <Typography variant="small" color="red" className="mt-1">{errors.name}</Typography>}

                                    <Typography variant="small" color="blue-gray" className="mt-3 font-medium">Username</Typography>
                                    <Input type="text" name="username" id="username" size="lg" value={formData.username || ''} onChange={handleChange}  error={errors.username}/>
                                    {errors.username && <Typography variant="small" color="red" className="mt-1">{errors.username}</Typography>}

                                    <Typography variant="small" color="blue-gray" className="mt-3 font-medium">Email</Typography>
                                    <Input type="email" name="email" id="email" size="lg" value={formData.email || ''} onChange={handleChange} error={errors.email}/>
                                    {errors.email && <Typography variant="small" color="red" className="mt-1">{errors.email}</Typography>}

                                    <Typography variant="small" color="blue-gray" className="mt-3 font-medium">Phone</Typography>
                                    <Input type="text" name="phone" id="phone" size="lg" value={formData.phone || ''} onChange={handleChange} />
                                    <Typography variant="small" color="blue-gray" className="mt-3 font-medium">Address</Typography>
                                    <Input type="text" name="address" id="address" size="lg" value={formData.address || ''} onChange={handleChange} />
                                    <div className="flex items-center mt-3">
                                        <input className="mr-2" type="checkbox" name="isAdmin" id="isAdmin" checked={formData.isAdmin || ''} onChange={handleChange} />
                                        <Typography variant="small" color="blue-gray" className="font-medium">Is Admin</Typography>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button type="button" onClick={handleUpdate} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm">Update</button>
                            <button type="button" onClick={onClose} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpdateUserPopup;