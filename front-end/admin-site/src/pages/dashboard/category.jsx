import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, Typography, Chip, Button } from "@material-tailwind/react";
import { getAllCategory } from "@/api/categoryApi";
import CreateCategoryPopup from "@/popup/category/createCategoryPopup";
import UpdateCategoryPopup from "@/popup/category/updateCategoryPopup";
import DeleteCategoryPopup from "@/popup/category/deleteCategoryPopup";

export function Category() {
    const [categories, setCategories] = useState([]);
    const [isCreateCategoryOpen, setIsCreateCategoryOpen] = useState(false);
    const [isUpdateCategoryOpen, setIsUpdateCategoryOpen] = useState(false);
    const [isDeleteCategoryOpen, setIsDeleteCategoryOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    useEffect(() => {
        getAllCategory().then((response) => {
            setCategories(response.data);
        }).catch(error => {
            console.error(error);
        });
    }, []);

    const openCreateCategoryPopup = () => {
        setIsCreateCategoryOpen(true);
    };

    const closeCreateCategoryPopup = () => {
        setIsCreateCategoryOpen(false);
    };

    const openUpdateCategoryPopup = (Category) => {
        setSelectedCategory(Category);
        setIsUpdateCategoryOpen(true);
      };
  
      const closeUpdateCategoryPopup = () => {
        setIsUpdateCategoryOpen(false);
      };
  
      const openDeleteCategoryPopup = (Category) => {
        setSelectedCategory(Category);
        setIsDeleteCategoryOpen(true);
      };
  
      const closeDeleteCategoryPopup = () => {
        setIsDeleteCategoryOpen(false);
      };
 
    return (
        <div className="mt-12 mb-8 flex flex-col gap-12">
            <Card>
                <CardHeader variant="gradient" color="gray" className="flex justify-between mb-8 p-6">
                    <Typography variant="h6" color="white">
                        Manage Category
                    </Typography>
                    <Button onClick={openCreateCategoryPopup} className="flex items-center transition duration-500" color="green">
                        Create Category
                    </Button>
                </CardHeader>
                <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
                    <table className="w-full min-w-[640px] table-auto">
                        <thead>
                            <tr>
                                {["Id", "Name", "IsActive", ""].map((el) => (
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
                            {categories.map(
                                (category, key) => {
                                    const className = `py-3 px-5 ${key === categories.length - 1
                                            ? ""
                                            : "border-b border-blue-gray-50"
                                        }`;

                                    return (
                                        <tr key={category.categoryId}>
                                            <td className={className}>
                                                <Typography className="text-xs font-semibold text-blue-gray-600">
                                                    {category.categoryId}
                                                </Typography>
                                            </td>
                                            <td className={className}>
                                                <Typography className="text-xs font-semibold text-blue-gray-600">
                                                    {category.categoryName}
                                                </Typography>
                                            </td>
                                            <td className={className}>
                                                <Chip
                                                    variant="gradient"
                                                    color={category.isActive ? "green" : "blue-gray"}
                                                    value={category.isActive ? "active" : "none"}
                                                    className="py-0.5 px-2 text-[11px] font-medium w-fit"
                                                />
                                            </td>
                                            <td className={className}>
                                                <div className="flex items-center gap-4">
                                                    <Typography
                                                        as="a"
                                                        href="#"
                                                        onClick={() => openUpdateCategoryPopup(category)}
                                                        className="text-xs font-semibold text-blue-gray-600 hover:text-yellow-800 transition duration-300"
                                                    >
                                                        Edit
                                                    </Typography>
                                                    <Typography
                                                        as="a"
                                                        href="#"
                                                        onClick={() => openDeleteCategoryPopup(category)}
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
            <CreateCategoryPopup isOpen={isCreateCategoryOpen} onClose={closeCreateCategoryPopup} />
            <UpdateCategoryPopup isOpen={isUpdateCategoryOpen} onClose={closeUpdateCategoryPopup} category={selectedCategory} />
            <DeleteCategoryPopup isOpen={isDeleteCategoryOpen} onClose={closeDeleteCategoryPopup} category={selectedCategory} />
        </div>
    );
};

export default Category;