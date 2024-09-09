import React, { useEffect, useState } from "react";
import RegisterModal from "./modals/RegisterModal";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useRecoilState } from "recoil";
import { authStatusAtom } from "../recoil/atoms/userAtoms";

const Register = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadImage, setLoadImage] = useState("");
  const navigate = useNavigate();

  const [regForm, setRegForm] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    image: "",
  });

  const [authStatus, setAuthStatus] = useRecoilState(authStatusAtom);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    toggleModal();
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
    setRegForm({
      ...regForm,
      [e.target.name]: e.target.value,
    });
  };

  const fileHanlde = (e) => {
    if (e.target.files.length !== 0)
      setRegForm({
        ...regForm,
        [e.target.name]: e.target.files[0],
      });

    const reader = new FileReader();
    reader.onload = () => {
      setLoadImage(reader.result);
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  return (
    <div className="h-[100vh] flex flex-col items-center justify-center bg-gray-100">
      {isModalOpen && (
        <RegisterModal
          toggleModal={toggleModal}
          loadImage={loadImage}
          userData={regForm}
        />
      )}

      <h1 className="text-4xl md:text-5xl mb-28 md:mb-6 font-extrabold text-gray-500 dark:text-white">
        Chat_With_Me
      </h1>
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-8 space-y-6">
        <h2 className="text-center text-2xl md:text-3xl font-extrabold text-gray-700">
          Create an Account
        </h2>
        <form className="space-y-6" onSubmit={handleRegister}>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              id="name"
              name="userName"
              type="text"
              value={regForm.userName}
              onChange={inputHandle}
              required
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>
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
              value={regForm.email}
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
              value={regForm.password}
              onChange={inputHandle}
              required
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>
          <div>
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              id="confirm-password"
              name="confirmPassword"
              type="password"
              value={regForm.confirmPassword}
              onChange={inputHandle}
              required
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>
          <div>
            <label
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              htmlFor="file_input"
            >
              Upload file
            </label>
            <input
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-sm cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              aria-describedby="file_input_help"
              id="file_input"
              type="file"
              name="image"
              onChange={fileHanlde}
            />
            <p
              style={{ marginTop: "0.5rem" }}
              className="text-xs text-gray-500 dark:text-gray-300"
              id="file_input_help"
            >
              SVG, PNG, JPG or GIF (MAX. 800x400px).
            </p>
          </div>
          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
