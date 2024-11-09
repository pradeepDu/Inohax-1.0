import React from "react";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../pages/redux";

const Header = () => {
  const navigate = useNavigate();
  const isAdmin = useAppSelector((store) => store.userInfo.userInfo?.type);
  return (
    <div className="absolute top-0 left-0 w-full flex gap-x-16 items-center p-4 bg-transparent z-10">
      {/* Profile icon */}
      <FaUserCircle
        className="text-4xl text-gray-700 cursor-pointer"
        onClick={() => {
          navigate("/your-profile");
        }}
      />
      {isAdmin === "admin" && (
        <button
          className="btn  "
          onClick={() => {
            navigate("/profiles");
          }}
        >
          Filter{" "}
        </button>
      )}
    </div>
  );
};

export default Header;
