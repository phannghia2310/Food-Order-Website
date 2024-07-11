"use client";
import Loader from "@/components/common/Loader";
import CategoryTag from "@/components/features/categories/CategoryTag";
import MenuItemCard from "@/components/features/menuItems/MenuItemCard";
import SectionHeader from "@/components/layout/SectionHeader";
import Category from "@/types/Category";
import MenuItem from "@/types/MenuItem";
import React, { useEffect, useState } from "react";
import { getAllCategory } from "../api/categories/route";
import { getAllItem } from "../api/menu-items/route";

const MenuPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [tag, setTag] = useState("");
  const [loading, setLoading] = useState(true);

  const filteredCategories = categories.filter((category) =>
    category.categoryName.includes(tag)
  );


  useEffect(() => {
    getAllCategory().then((res) => {
      setCategories(res.data); 
      setTag(res.data[0].categoryName);
    });

    getAllItem().then((res) => {
      setMenuItems(res.data);
    });
    setLoading(false);
  }, []);

  if (loading) {
    return <Loader className={""} />;
  }
  
  return (
    <section className="py-12">
      {categories && menuItems && (
        <>
          <SectionHeader
            header={"Our Menu"}
            description={
              "From classic favorites to innovative creations, our hot pizza meals promise a delightful symphony of flavors that will leave you craving for more."
            }
          />
          <div className="flex gap-3 justify-center mb-12">
            {categories.map((category) => (
              <CategoryTag
                key={category.categoryId}
                name={category.categoryName}
                onClick={(name: string) => setTag(name)}
                isSelected={tag === category.categoryName}
              />
            ))}
          </div>
          <div className='grid grid-cols-4 gap-6'>
            {filteredCategories.map(category => (
              menuItems.filter(item => item.categoryId === category.categoryId).map((item, index) => (
                <div className='p-4' key={item.productId}>
                  <MenuItemCard menuItem={item} />
                </div>
              ))
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default MenuPage;
