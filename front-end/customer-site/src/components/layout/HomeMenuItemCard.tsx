"use client";
import MenuItem from "@/types/MenuItem";
import { Button, Link } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface HomeMenuItemCardProps {
  menuItem: MenuItem;
  index: number;
}

const HomeMenuItemCard = ({ menuItem, index }: HomeMenuItemCardProps) => {
  const { data: session } = useSession();
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    const customerData = localStorage.getItem("customer");
    if(customerData) {
      setCustomer(JSON.parse(customerData));
    }
  }, []);

  if (index % 6 < 3) {
    return (
      <div className="grid grid-cols-2 ">
        <div
          style={{ backgroundImage: `url(/assets/product/${menuItem.imageUrl})` }}
          className="bg-cover bg-center bg-no-repeat"
        ></div>
        <div
          className="flex items-center"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0, 0, 0, 0.3),rgba(0, 0, 0, 0.3))",
          }}
        >
          <div className="flex flex-col gap-4 p-10">
            <h3>{menuItem.productName}</h3>
            <p className="text-gray-400 line-clamp-3">{menuItem.description}</p>
            <div className="flex items-center gap-4">
              <p className="text-primary">
                {(menuItem.price as number).toFixed(2)}$
              </p>
              <Button
                as={Link}
                href={customer ? "/menu" : "/login"}
                radius="none"
                size="sm"
                className="bg-transparent border hover:bg-primary hover:text-dark"
              >
                Order
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="grid grid-cols-2 ">
        <div
          className="flex items-center"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0, 0, 0, 0.3),rgba(0, 0, 0, 0.3))",
          }}
        >
          <div className="flex flex-col gap-4 p-10 text-end ">
            <h3>{menuItem.productName}</h3>
            <p className="text-gray-400 line-clamp-3">{menuItem.description}</p>
            <div className="flex items-center gap-4 justify-end">
              <p className="text-primary">
                {(menuItem.price as number).toFixed(2)}$
              </p>
              <Button
                as={Link}
                href={session ? "/menu" : "/login"}
                radius="none"
                size="sm"
                className="bg-transparent border hover:bg-primary hover:text-dark"
              >
                Order
              </Button>
            </div>
          </div>
        </div>
        <div
          style={{ backgroundImage: `url(/assets/product/${menuItem.imageUrl})` }}
          className="bg-cover bg-center bg-no-repeat"
        ></div>
      </div>
    );
  }
};

export default HomeMenuItemCard;
