import React from "react";
import "../../css/css-modals/registerModal.css";
import axios from "axios";
import { useRecoilState } from "recoil";
import { authStatusAtom, userAtom } from "../../recoil/atoms/userAtoms";

const RegisterModal = (props) => {
  const { toggleModal, loadImage, userData } = props;
  const [authStatus, setAuthStatus] = useRecoilState(authStatusAtom);
  const [token, setToken] = useRecoilState(userAtom);

  const doRegistration = async () => {
    const { userName, email, password, confirmPassword, image } = userData;

    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("confirmPassword", confirmPassword);
    formData.append("image", image);
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      let response = await axios.post(
        "/api/api/chat-with/user-register",
        formData,
        config
      );

      localStorage.setItem("authToken", response.data.token);

      setToken({
        token: response.data.token,
      });
      setAuthStatus({
        successMessage: response.data.successMessage,
        errorMessage: null,
        isAuthenticated: true,
      });
    } catch (error) {
      console.log("sta je greska", error);
      setAuthStatus({
        successMessage: null,
        errorMessage: error.response.data.error.errorMessage,
        isAuthenticated: false,
      });
    }
  };
  return (
    <div className="flex justify-center items-center mt-6s">
      <div
        id="static-modal"
        className="fixed inset-0 overflow-y-auto overflow-x-hidden bg-gray-800 bg-opacity-75 z-50 flex justify-center"
        data-modal-backdrop="static"
        tabIndex="-1"
        onClick={toggleModal}
      >
        <div className="relative p-4 mt-40 w-full max-w-2xl">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Final step
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-hide="static-modal"
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            {/* Modal body */}
            <div className="p-4 md:p-5 space-y-4">
              <div className="flex">
                <div className="mr-auto">
                  <h1 className="my-3 text-2xl md:text-4xl">
                    {userData.userName}
                  </h1>
                  <h3 className="text-xl md:text-4xl">{userData.email}</h3>
                </div>
                {loadImage ? (
                  <img className="image" src={loadImage} alt="No_img" />
                ) : (
                  ""
                )}
              </div>
            </div>
            {/* Modal footer */}
            <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
              <button
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                data-modal-hide="static-modal"
                onClick={doRegistration}
              >
                I accept
              </button>
              <button
                type="button"
                className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                data-modal-hide="static-modal"
                onClick={toggleModal}
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;
