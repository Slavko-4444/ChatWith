import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useRecoilState } from "recoil";
import { authStatusAtom, userAtom } from "../recoil/atoms/userAtoms";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const [authForm, setAuthForm] = useState({
    email: "",
    password: "",
  });
  const [authStatus, setAuthStatus] = useRecoilState(authStatusAtom);
  const [userInfo, setUserInfo] = useRecoilState(userAtom);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const { email, password } = authForm;

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      let response = await axios.post(
        "/api/api/chat-with/user-login",
        formData,
        config
      );
      let token = response.data.token;
      localStorage.removeItem("authToken");
      localStorage.setItem("authToken", token);

      const decoded = jwtDecode(token);
      setUserInfo({
        token: token,
        userName: decoded.userName,
        id: decoded.id,
        email: decoded.email,
        image: decoded.image,
      });

      setAuthStatus({
        successMessage: response.data.successMessage,
        errorMessage: null,
        isAuthenticated: true,
      });
    } catch (error) {
      setAuthStatus({
        successMessage: null,
        errorMessage: error.response.data.error.errorMessage,
        isAuthenticated: false,
      });
    }
  };

  useEffect(() => {
    if (authStatus.errorMessage) {
      authStatus.errorMessage.forEach((msg) => {
        toast.error(msg);
      });

      if (authStatus.errorMessage.length > 3) toast.clearWaitingQueue();
      setAuthStatus({ ...authStatus, errorMessage: null });
    } else if (authStatus.successMessage) {
      toast.success(authStatus.successMessage);
      navigate("/");
      setAuthStatus({ ...authStatus, successMessage: null });
    }
  }, [authStatus]);

  const inputHandle = (e) => {
    setAuthForm({
      ...authForm,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="h-[100vh]  w-full flex  flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl md:text-5xl mb-28 md:mb-6 font-extrabold text-gray-500 dark:text-white">
        Chat_With_Me
      </h1>
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-8 space-y-6">
        <h2 className="text-center text-2xl md:text-3xl font-extrabold text-gray-700">
          Login to Your Account
        </h2>
        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={authForm.email}
              onChange={inputHandle}
              required
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={authForm.password}
              onChange={inputHandle}
              required
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
