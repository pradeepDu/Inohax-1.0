import axios from "axios";
import React, { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { setUserType, useAppDispatch } from "./redux";

const apiUrl = process.env.REACT_APP_API;

const AdministratorLogin = () => {
  const [admindata, setadmindata] = useState({ adminName: "", password: "" });
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${apiUrl}/authAdmin`, {
        adminName: admindata.adminName,
        password: admindata.password,
      });
      if (data.success) {
        dispatch(setUserType({ type: "admin" }));
        navigate("/portal/admin");
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 via-white to-blue-100">
      <div className="card w-full max-w-md bg-white shadow-xl rounded-lg p-8">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-6">
          Admin Login
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="form-control">
            <input
              type="text"
              value={admindata.adminName}
              onChange={(e) =>
                setadmindata({ ...admindata, adminName: e.target.value })
              }
              placeholder="Admin Name"
              className="input input-primary input-bordered bg-white w-full max-w-md focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <div className="form-control">
            <input
              type="password"
              value={admindata.password}
              onChange={(e) =>
                setadmindata({ ...admindata, password: e.target.value })
              }
              placeholder="Password"
              className="input input-primary input-bordered bg-white w-full max-w-md focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <button
            type="submit"
            className="btn btn-info w-full text-lg font-semibold py-3 rounded-md hover:bg-blue-600 hover:scale-105 transition-all duration-300 ease-in-out focus:ring-4 focus:ring-blue-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdministratorLogin;
