import MenuItem from "@/types/MenuItem";
import { useContext, useState } from "react";
import { CartContext } from "../../../util/ContextProvider";
import { useSession } from "next-auth/react";
import { Button, Link } from "@nextui-org/react";

interface MenuItemCardProps {
  menuItem: MenuItem;
}

const MenuItemCard = ({ menuItem }: MenuItemCardProps) => {
  const { data: session } = useSession();
  const { addToCart } = useContext(CartContext);

  function handleAddToCartClick() {
      addToCart(menuItem);
  }

  return (
    <>
      <div className="flex flex-col gap-3 justify-center text-center items-center">
        <div
          style={{
            backgroundImage: `url(/assets/product/${menuItem.imageUrl})`,
            borderRadius: "50%",
          }}
          className="bg-cover bg-center bg-no-repeat mb-4 w-[200px] h-[200px]"
        ></div>
        <div className="flex flex-col gap-4">
          <h3>{menuItem.productName}</h3>
          <p className="text-gray-400 line-clamp-3">{menuItem.description}</p>
          <div className="flex items-center justify-center gap-6">
            <p className="text-primary">
              ${(menuItem.price as number).toFixed(2)}
            </p>
            {session ? (
              <button
                className="border-2 bg-dark hover:bg-primary hover:text-dark rounded-full transition-all whitespace-nowrap px-4 py-2"
                onClick={handleAddToCartClick}
              >
                Add to cart
              </button>
            ) : (
              <Button
                as={Link}
                href="/login"
                radius="none"
                size="sm"
                className="bg-transparent border hover:bg-primary hover:text-dark"
              >
                Order
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MenuItemCard;
