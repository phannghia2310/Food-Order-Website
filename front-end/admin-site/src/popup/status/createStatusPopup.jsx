import React, { useState } from "react";
import { Typography, Input } from "@material-tailwind/react";
import { createStatus } from "@/api/statusApi";

const CreateStatusPopup = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        description: "",
    });
    const [errors, setErrors] = useState({});

    const validateSubmit = () => {
        let valid = true;
        const newErrors = {};

        if(!formData.description) {
            newErrors.description = "Description is required";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(validateSubmit()) {
            try {
                const response = await createStatus(formData);
                console.log(response.data);
                onClose();
                window.location.reload();
            } catch (err) {
                console.error(err);
                const newErrors = {};
                newErrors.description = err.response.data;
                setErrors(newErrors);
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    return (
        <div className={`fixed inset-0 z-50 overflow-y-auto ${isOpen ? "" : "hidden"}`}>
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <form onSubmit={handleSubmit}>
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div className="sm:flex sm:items-start">
                                <div className="w-full">
                                    <Typography variant="small" color="blue-gray" className="font-medium">
                                        Description
                                    </Typography>
                                    <Input
                                        type="text"
                                        name="description"
                                        id="description"
                                        size="lg"
                                        placeholder="Description"
                                        error={errors.description}
                                        className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                                        value={formData.description}
                                        onChange={handleChange}
                                        labelProps={{
                                            className: "before:content-none after:content-none",
                                        }}
                                    />
                                    {errors.description && 
                                        <Typography variant="small" color="red" className="mt-1">
                                            {errors.description}
                                        </Typography>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm">
                                Create
                            </button>
                            <button type="button" onClick={onClose} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateStatusPopup;