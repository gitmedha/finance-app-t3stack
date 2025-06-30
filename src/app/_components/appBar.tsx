'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LuLogOut } from "react-icons/lu";
import {  FaUser } from "react-icons/fa";
import {  GiOfficeChair } from "react-icons/gi";
import { HiBanknotes } from "react-icons/hi2";
import { IoHome } from "react-icons/io5";
import { MdOutlineCategory } from "react-icons/md";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { IconButton } from "@radix-ui/themes";

const AppBar = () => {
  const { data: session } = useSession();
  const pathname = usePathname(); // Get the current path

  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll event
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menus = [
    { menu: "Home", path: "/home", icon: <IoHome /> },
    { menu: "Budget", path: "/budget", icon: <HiBanknotes /> },
    // { menu: "Donors", path: "/donors", icon: <FaHandHoldingHeart /> },
    { menu: "Departments", path: "/departments", icon: <GiOfficeChair /> },
    { menu: "Program Activities", path: "/program-activities", icon: <MdOutlineCategory /> },
    // { menu: "Cost Centers", path: "/cost-centers", icon: <GiMoneyStack /> },
    // { menu: "Expenses", path: "/expenses", icon: <GiExpense /> },
    { menu: "Staff", path: "/staff", icon: <FaUser /> },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all ${isScrolled ? "shadow-lg bg-primary/90" : "bg-primary"
        }`}
    >
      <div className="container mx-auto flex justify-between items-center py-1">
        <div className="flex justify-center items-center">
          <Image
            src="/Medha-white-logo.svg"
            alt="Company Logo"
            width={50}
            height={50}
          />
        </div>

        <ul className="flex justify-start items-center space-x-6">
          {menus.map((menu) => {
            if (session?.user.role != 1 && (menu.menu == "Home" || menu.menu == "Budget" || menu.menu == "Staff" || menu.menu == "Program Activities") )
            {
              return <li key={menu.menu}>
                <Link
                  href={menu.path}
                  className={`text-white space-x-1 flex justify-start items-center ${pathname === menu.path
                    ? "font-semibold border-b-2 border-white"
                    : ""
                    }`}
                >
                  <span>{menu.icon}</span>
                  <span>{menu.menu}</span>
                </Link>
              </li>
            }
            else if (session?.user.role == 1)
            {
              return <li key={menu.menu}>
                <Link
                  href={menu.path}
                  className={`text-white space-x-1 flex justify-start items-center ${pathname === menu.path
                    ? "font-semibold border-b-2 border-white"
                    : ""
                    }`}
                >
                  <span>{menu.icon}</span>
                  <span>{menu.menu}</span>
                </Link>
              </li>
            }
                        
          })}
        </ul>

        <div className="flex justify-start items-center text-white space-x-2">
          <span className="font-medium capitalize">
            Hi, {session?.user.fullName}
          </span>

          <IconButton
            onClick={() => signOut()}
            className="!bg-primary/20 !cursor-pointer rounded-full flex justify-center items-center focus:ring-0 text-primary h-8 w-8"
          >
            <LuLogOut />
          </IconButton>
        </div>
      </div>
    </nav>
  );
};

export default AppBar;
