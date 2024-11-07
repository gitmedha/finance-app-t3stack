
import React, { ChangeEventHandler } from "react";

interface SearchInputProps {
  placeholder?: string;
  className?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}


const SearchInput: React.FC<SearchInputProps> = ({ placeholder = "Search...", className = "", onChange }) => {
    return <div className="border border-gray-300  flex items-center justify-between w-full bg-white rounded-lg disabled:bg-white">
        <div className=" inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
            <svg
                className="w-6 h-6"
                fill="text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                height="48"
                viewBox="0 96 960 960"
                width="48"
            >
                <path d="M782 892 528 638q-29.605 27.077-69.051 41.038Q419.503 693 381 693q-91.812 0-155.406-63.337Q162 566.325 162 474.663 162 383 225.337 319.5 288.675 256 380.11 256t155.662 63.385Q600 382.769 600 474.288 600 515 585 554.5T544 622l254 253-16 17ZM381 671q83.083 0 140.042-56.5Q578 558 578 474.5t-56.958-140Q464.083 278 381 278t-140.042 56.5Q184 391 184 474.5t56.958 140Q297.917 671 381 671Z" />
            </svg>
        </div>
        <input
            autoComplete="off"
            type="search"
            placeholder={placeholder}
            onChange={onChange}
            className={`outlined pl-1 rounded-lg disabled:bg-white placeholder:text-gray-600  text-textSecondary text-sm outline-none focus:ring-0 block w-full ${className}`}
        />
    </div>
}

export default SearchInput;

