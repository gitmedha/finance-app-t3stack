'use client';

// import { IconButton } from "@radix-ui/themes";
import Link from "next/link";
import { LuLogOut } from "react-icons/lu";
import { FaHandHoldingHeart, FaUser } from "react-icons/fa";
import { GiExpense } from "react-icons/gi";
import { BiSolidReport } from "react-icons/bi";
import { HiBanknotes } from "react-icons/hi2";
import { IoHome } from "react-icons/io5";
import Image from "next/image";

const AppBar = () => {
  let menus = [
    { menu: 'Home', path: '/', icon: <IoHome /> },
    { menu: 'Budget', path: '/budget', icon: <HiBanknotes /> },
    { menu: 'Donors', path: '/donors', icon: <FaHandHoldingHeart /> },
    { menu: 'Expenses', path: '/expenses', icon: <GiExpense /> },
    { menu: 'Staff', path: '/staff', icon: <FaUser /> },
    { menu: 'Reports', path: '/reports', icon: <BiSolidReport /> }]

  return (
    <nav className="shadow-lg bg-primary">
      <div className="container mx-auto flex justify-between items-center py-1 ">
        <div className="flex justify-center items-center">
          <Image
            src="/Medha-white-logo.svg"
            alt="Company Logo"
            width={50}
            height={50}
            className=""
          />
        </div>

        <ul className="flex justify-start items-center space-x-6">
          {menus.map((menu) => {
            return <li key={menu?.menu}>
              <Link href={menu.path} className="text-white space-x-1 flex justify-start items-center ">
                <span>{menu?.icon}</span>
                <span>{menu?.menu}</span>
              </Link>
            </li>
          })}
        </ul>
        <div className="flex justify-start items-center text-white space-x-2">
          <span className="font-medium">Hi, Praveen K</span>
          <button className='cursor-pointer rounded-full flex justify-center items-center focus:ring-0  text-primary bg-white h-8 w-8' >
            <LuLogOut />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default AppBar;
