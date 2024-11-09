import React from "react";
import { useNavigate } from "react-router-dom";
import { setUserType, useAppDispatch } from "./redux";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 via-white to-blue-100 p-10">
      <div className="card w-96  shadow-xl bg-white">
        <div className="card-body">
          <h2 className="card-title text-3xl font-bold text-center mb-8 text-gray-800">
            Login as
          </h2>

          <div className="flex flex-col space-y-4">
            {/* Student Button */}
            <button
              className="btn btn-info btn-lg text-white"
              onClick={() => navigate("/UserLogin")}
            >
              Student
            </button>

            {/* Administrator Button */}
            <button
              className="btn btn-success btn-lg text-white"
              onClick={() => {
                dispatch(setUserType({ type: "admin" }));
                navigate("/AdministratorLogin");
              }}
            >
              Administrator
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
