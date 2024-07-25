"use client";
import React, { useEffect, useState } from "react";
import HomeMenuItemCard from "./HomeMenuItemCard";
import MenuItem from "@/types/MenuItem";
import SectionHeader from "./SectionHeader";
import { SectionProps } from "@/types/SectionProps";
import { getItemByCategory } from "@/app/api/menu-items/api";

const HomeMenu = ({ className }: SectionProps) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    getItemByCategory(1).then((response) => {
      setMenuItems(response.data);
    }).catch(error => {
      console.log(error);
    });
  }, []);

  return (
    <section className={className}>
      <SectionHeader
        header={"Hot Pizza Meals"}
        description={
          "From classic favorites to innovative creations, our hot pizza meals promise a delightful symphony of flavors that will leave you craving for more."
        }
      />
      <div className="grid md:grid-cols-3 md:gap-0 grid-cols-1 gap-4">
        {menuItems &&
          menuItems.map((menuItem, index) => (
            <HomeMenuItemCard
              key={menuItem.productId}
              menuItem={menuItem}
              index={index}
            />
          ))}
      </div>
    </section>
  );
};

export default HomeMenu;
