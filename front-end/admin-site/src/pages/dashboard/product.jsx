import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, Typography, Avatar, Chip, Button } from "@material-tailwind/react";
import { getAllProduct } from "@/api/productApi";
import { getAllCategory } from "@/api/categoryApi";
import DefaultProduct from "/img/product/default-product.png";
import CreateProductPopup from "@/popup/product/createProductPopup";
import UpdateProductPopup from "@/popup/product/updateProductPopup";
import DeleteProductPopup from "@/popup/product/deleteProductPopup";

export function Product() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isCreateProductOpen, setIsCreateProductOpen] = useState(false);
    const [isUpdateProductOpen, setIsUpdateProductOpen] = useState(false);
    const [isDeleteProductOpen, setIsDeleteProductOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        getAllProduct().then(response => {
            setProducts(response.data);
        }).catch(error => {
            console.error(error);
        });
    }, []);

    useEffect(() => {
        getAllCategory().then(response => { 
            setCategories(response.data);
        }).catch(error => {
            console.error(error);
        });
    }, [])

    const openCreateProductPopup = () => {
      setIsCreateProductOpen(true);
    };

    const closeCreateProductPopup = () => {
      setIsCreateProductOpen(false);
    };

    const openUpdateProductPopup = (product) => {
      setSelectedProduct(product);
      setIsUpdateProductOpen(true);
    };

    const closeUpdateProductPopup = () => {
      setIsUpdateProductOpen(false);
    };

    const openDeleteProductPopup = (product) => {
      setSelectedProduct(product);
      setIsDeleteProductOpen(true);
    };

    const closeDeleteProductPopup = () => {
      setIsDeleteProductOpen(false);
    };

    const getCategoryName = (categoryId) => {
        const category = categories.find(cate => cate.categoryId === categoryId);
        return category ? category.categoryName : ""; 
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
                Manage Product
              </Typography>
              <Button onClick={openCreateProductPopup} className="flex items-center transition duration-500" color="green">
                Create Product
              </Button>
            </CardHeader>
            <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
              <table className="w-full min-w-[640px] table-auto">
                <thead>
                  <tr>
                    {["Image", "Product Name", "Category", "Description", "Price", "Quantity", "Is Active", "Create Date", ""].map((el) => (
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
                  {products.map(
                    (product, key) => {
                      const className = `py-3 px-5 ${
                        key === products.length - 1
                          ? ""
                          : "border-b border-blue-gray-50"
                      }`;
    
                      return (
                        <tr key={product.productId}>
                          <td className={className}>
                            <Avatar
                              src={product.imageUrl ? getBlobUrl(product.imageUrl) : DefaultProduct}
                              alt="product-image"
                              size="xl"
                              variant="rounded"
                              className="rounded-lg shadow-lg shadow-blue-gray-500/40"
                            />
                          </td>
                          <td className={className}>
                            <Typography className="text-xs font-semibold text-blue-gray-600">
                              {product.productName}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography className="text-xs font-semibold text-blue-gray-600">
                              {getCategoryName(product.categoryId)}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography className="text-xs font-semibold text-blue-gray-600">
                              {product.description}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography className="text-xs font-semibold text-blue-gray-600">
                              {product.price}$
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography className="text-xs font-semibold text-blue-gray-600">
                              {product.quantity}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Chip
                              variant="gradient"
                              color={product.isActive ? "green" : "blue-gray"}
                              value={product.isActive ? "active" : "none"}
                              className="py-0.5 px-2 text-[11px] font-medium w-fit"
                            />
                          </td>
                          <td className={className}>
                            <Typography className="text-xs font-semibold text-blue-gray-600">
                              {product.createDate}
                            </Typography>
                          </td>
                          <td className={className}>
                            <div className="flex items-center gap-4">
                                <Typography
                                    as="a"
                                    href="#"
                                    onClick={() => openUpdateProductPopup(product)}
                                    className="text-xs font-semibold text-blue-gray-600 hover:text-yellow-800 transition duration-300"
                                >
                                    Edit
                                </Typography>
                                <Typography
                                    as="a"
                                    href="#"
                                    onClick={() => openDeleteProductPopup(product)}
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
          <CreateProductPopup isOpen={isCreateProductOpen} onClose={closeCreateProductPopup} />
          <UpdateProductPopup isOpen={isUpdateProductOpen} onClose={closeUpdateProductPopup} product={selectedProduct} />
          <DeleteProductPopup isOpen={isDeleteProductOpen} onClose={closeDeleteProductPopup} product={selectedProduct} />
        </div>
    );
};

export default Product;