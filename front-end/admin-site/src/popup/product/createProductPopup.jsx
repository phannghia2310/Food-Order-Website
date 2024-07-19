import React, { useEffect, useRef, useState } from "react";
import { Typography, Input } from "@material-tailwind/react";
import { MenuItem, Select } from "@mui/material";
import { createProduct, uploadProductImage } from "@/api/productApi";
import DefaultProduct from "/img/product/default-product.png";
import { getAllCategory } from "@/api/categoryApi";

const CreateProductPopup = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        productName: "",
        categoryId: "",
        description: "",
        price: "",
        quantity: "",
        imageUrl: "",
        isActive: true,
    });
    const [categories, setCategories] = useState([]);
    const [image, setImage] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        getAllCategory().then(res => {
            setCategories(res.data);
        }).catch(error => {
            console.error(error);
        })
    }, []);

    const validateSubmit = () => {
        let valid = true;
        const newErrors = {};

        if(!formData.productName) {
            newErrors.productName = "Product name is required";
            valid = false;
        }
        if(!formData.categoryId) {
            newErrors.categoryId = "Category is required";
            valid = false;
        }
        if(!formData.description) {
            newErrors.description = "Description is required";
            valid = false;
        }
        if(!formData.price || isNaN(formData.price)) {
            newErrors.price = "Price is required and must be a number";
            valid = false;
        }
        if(!formData.quantity || isNaN(formData.quantity)) {
            newErrors.quantity = "Quantity is required and must be a number";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if(validateSubmit()) {
            try {
                if (selectedFile) {
                    const imageResponse = await uploadProductImage(selectedFile);
                    console.log(imageResponse);
    
                    if (imageResponse.status !== 200) {
                        throw new Error("Failed to upload image");
                    }
    
                    const { imagePath } = imageResponse.data;
    
                    formData.imageUrl = imagePath;
                }
    
                const response = await createProduct(formData);
                console.log(response.data);
                onClose();
                window.location.reload();
            } catch (err) {
                console.error(err);
                const newErrors = {};
                newErrors.productName = err.response.data;
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

    const handleDropdownChange = (value) => {
        setFormData(prevData => ({
            ...prevData,
            categoryId: value,
        }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            }
            reader.readAsDataURL(file);
            setSelectedFile(file);
        }
    };

    const handleButtonClick = (e) => {
        e.preventDefault();
        fileInputRef.current.click();
    }

    return (
        <div className={`fixed inset-0 z-50 overflow-y-auto ${isOpen ? "" : "hidden"}`}>
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
                    <form>
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div className="sm:flex sm:items-start">
                                <div className="flex w-full">
                                    <div className="flex flex-col justify-center items-center mr-[50px]">
                                        <img
                                            className="rounded-full w-44 h-44"
                                            src={image ? (image === formData.imageUrl ? `/img/product/${image}` : image) : DefaultProduct}
                                            alt="Product Image"
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
                                    <div className="flex flex-col flex-1">
                                        <Typography variant="small" color="blue-gray" className="font-medium">Product Name</Typography>
                                        <Input type="text" name="productName" id="productName" size="lg" value={formData.productName || ''} onChange={handleChange} error={errors.productName}/>
                                        {errors.productName && 
                                            <Typography variant="small" color="red" className="mt-1">
                                                {errors.productName}
                                            </Typography>
                                        }

                                        <Typography variant="small" color="blue-gray" className="mt-3 font-medium">Category</Typography>
                                        <Select
                                            id="categoryId"
                                            name="categoryId"
                                            value={formData.categoryId}
                                            error={errors.categoryId}
                                            onChange={(event) => handleDropdownChange(event.target.value)}
                                        >
                                            {categories.map(category => (
                                                <MenuItem key={category.categoryId} value={category.categoryId}>
                                                    {category.categoryName}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {errors.categoryId && <Typography color="red" className="mt-1">{errors.categoryId}</Typography>}

                                        <Typography variant="small" color="blue-gray" className="mt-3 font-medium">Description</Typography>
                                        <Input type="text" name="description" id="description" size="lg" value={formData.description || ''} onChange={handleChange} error={errors.description}/>
                                        {errors.description && <Typography color="red" className="mt-1">{errors.description}</Typography>}
                                        
                                        <Typography variant="small" color="blue-gray" className="mt-3 font-medium">Price</Typography>
                                        <Input type="text" name="price" id="price" size="lg" value={formData.price || ''} onChange={handleChange} error={errors.price}/>
                                        {errors.price && <Typography color="red" className="mt-1">{errors.price}</Typography>}
                                        
                                        <Typography variant="small" color="blue-gray" className="mt-3 font-medium">Quantity</Typography>
                                        <Input type="text" name="quantity" id="quantity" size="lg" value={formData.quantity || ''} onChange={handleChange} error={errors.quantity}/>
                                        {errors.quantity && <Typography color="red" className="mt-1">{errors.quantity}</Typography>}

                                        <div className="flex items-center mt-3">
                                            <input className="mr-2" type="checkbox" name="isActive" id="isActive" checked={formData.isActive || false} onChange={handleChange} />
                                            <Typography variant="small" color="blue-gray" className="font-medium">Is Active</Typography>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button type="button" onClick={handleSubmit} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm">Submit</button>
                            <button type="button" onClick={onClose} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateProductPopup;