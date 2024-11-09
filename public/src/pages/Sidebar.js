import React from "react";

export const Sidebar = ({ children }) => {
  return (
    <div className="w-64 bg-white shadow-lg h-screen p-5">
      <h2 className="text-2xl font-bold text-gray-800 mb-5">Portal</h2>
      <ul className="space-y-2">{children}</ul>
    </div>
  );
};

export const SidebarItem = ({ onClick, children }) => {
  return (
    <li>
      <button
        className="flex flex-row items-center w-full text-left px-4 py-2 hover:bg-gray-200 transition duration-200 rounded text-slate-800 gap-2" 
        onClick={onClick}
      >
        {children}
      </button>
    </li>
  );
};
