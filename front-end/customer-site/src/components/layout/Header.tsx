"use client";
import { CartIcon } from "@/icons/CartIcon";
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import Link from "next/link";
import React, { useContext } from "react";
import { ChevronDownIcon } from "@/icons/ChevronDownIcon";
import { UserIcon } from "@/icons/UserIcon";
import { ShoppingBagIcon } from "@/icons/ShoppingBagIcon";
import { SignOutIcon } from "@/icons/SignOutIcon";
import { usePathname } from "next/navigation";
import { CartContext } from "../../util/ContextProvider";
import { useProfile } from "../hooks/useProfile";

const Header = () => {
  const { cartProducts } = useContext(CartContext);
  const pathname = usePathname();
  const { data: profileData } = useProfile();

  const handleSignOut = () => {
    localStorage.removeItem("token");
    window.location.assign("/login");
  };

  const getBlobUrl = (imageUrl: any) => {
    const containerUrl = process.env.NEXT_PUBLIC_AZURE_BLOB_URL;
    return `${containerUrl}/${imageUrl}`;
  };

  return (
    <Navbar
      className="font-semibold bg-dark py-3"
      classNames={{ item: "data-[active=true]:text-primary" }}
    >
      <NavbarBrand>
        <Link href="/" className="text-primary text-2xl font-josefin">
          Fly Pizza
        </Link>
      </NavbarBrand>
      <NavbarContent className="gap-8" justify="center">
        <NavbarItem isActive={pathname === "/"}>
          <Link href="/" aria-current="page" className="hover:text-primary">
            Home
          </Link>
        </NavbarItem>
        <NavbarItem isActive={pathname === "/menu"}>
          <Link href="/menu" className="hover:text-primary">
            Menu
          </Link>
        </NavbarItem>
        <NavbarItem isActive={pathname === "/services"}>
          <Link href="/services" className="hover:text-primary">
            Services
          </Link>
        </NavbarItem>
        <NavbarItem isActive={pathname === "/about"}>
          <Link href="/about" className="hover:text-primary">
            About
          </Link>
        </NavbarItem>
        <NavbarItem isActive={pathname === "/contact"}>
          <Link href="/contact" className="hover:text-primary">
            Contact
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        {profileData ? (
          <div className="flex items-center h-full">
            <Dropdown className="text-gray-300">
              <DropdownTrigger>
                <Button
                  className="bg-transparent h-full"
                  startContent={
                    <Avatar
                      src={getBlobUrl(profileData?.imageUrl)}
                      isBordered
                      color="primary"
                      size="sm"
                    />
                  }
                  endContent={
                    <ChevronDownIcon className={"w-4 stroke-white"} />
                  }
                  disableAnimation
                />
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Link Actions"
                color="primary"
                variant="flat"
              >
                <DropdownItem
                  key="profile"
                  href="/profile"
                  startContent={<UserIcon className={"w-6"} />}
                >
                  My Profile
                </DropdownItem>
                <DropdownItem
                  key="orders"
                  href="/orders"
                  startContent={<ShoppingBagIcon className={"w-6"} />}
                >
                  Orders
                </DropdownItem>
                <DropdownItem
                  key="signOut"
                  startContent={<SignOutIcon className={"w-6"} />}
                  onClick={handleSignOut}
                >
                  Sign Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <Button
              as={Link}
              href="/cart"
              className="bg-transparent relative min-w-10"
              startContent={<CartIcon className={"w-8 stroke-white"} />}
            >
              {cartProducts.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-primary text-dark text-xs text-center absolute right-1 top-0">
                  {cartProducts.length}
                </span>
              )}
            </Button>
          </div>
        ) : (
          <div className="flex gap-6 items-center">
            <Link href={"/login"} className="hover:text-primary">
              Login
            </Link>
            <Button
              as={Link}
              color="primary"
              href={"/register"}
              className="font-semibold rounded-full px-6 py-2 text-dark"
            >
              Sign Up
            </Button>
          </div>
        )}
      </NavbarContent>
    </Navbar>
  );
};

export default Header;
