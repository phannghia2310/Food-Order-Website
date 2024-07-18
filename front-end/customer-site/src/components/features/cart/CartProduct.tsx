import { TrashIcon } from "@/icons/TrashIcon";
import type CartProduct from "@/types/CartProduct";
import { Tooltip } from "@nextui-org/react";

interface CartProductProps {
  product: CartProduct;
  productPrice: number;
  onRemove?: () => void;
}

const CartProduct = ({ product, productPrice, onRemove }: CartProductProps) => {
  return (
    <div className="grid grid-cols-8 gap-4 border-b pt-2">
      <div className="col-span-2">
        <div
          style={{
            backgroundImage: `url(/assets/product/${product.product.imageUrl})`,
            borderRadius: "10%",
          }}
          className="bg-cover bg-center bg-no-repeat mb-4 w-[120px] h-[120px]"
        ></div>
      </div>
      <div className="col-span-3 px-4">
        <p className="font-semibold">{product.product.productName}</p>
      </div>
      <div className="items-start text-center">
        <p className="font-semibold">Quantity</p>
        <p>1</p>
      </div>
      <div className="text-right font-semibold">${productPrice.toFixed(2)}</div>
      {!!onRemove && (
        <Tooltip content="Remove">
          <div className="ml-6 cursor-pointer" onClick={onRemove}>
            <TrashIcon className={"w-6"} />
          </div>
        </Tooltip>
      )}
    </div>
  );
};

export default CartProduct;
