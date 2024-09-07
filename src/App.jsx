import Footer from "./componetnts/Footer";
import Login from "./componetnts/Login";
import Messenger from "./componetnts/Messenger";
import Register from "./componetnts/Register";
import "simplebar/dist/simplebar.min.css";
import "react-toastify/dist/ReactToastify.css";

import "./css/App.css";
import { Route, Routes } from "react-router-dom";
import { Bounce, ToastContainer, toast } from "react-toastify";
import ProtectedRoute from "./componetnts/ProtectedRoute";
import { useRecoilState } from "recoil";
import { LogOutAtom } from "./recoil/atoms/customAtoms";
import LogOutModal from "./componetnts/modals/LogOutModal";

function App() {
  const [seeLogut, setSeeLogout] = useRecoilState(LogOutAtom);

  // log-out logic...
  const toggleModal = () => setSeeLogout(!seeLogut);

  const handleLogout = () => {
    setUserInfo({ token: "" });
    localStorage.removeItem("authToken");
    Cookies.remove("authToken");
    navigate("/login");
    toast.success("See you!");
  };

  return (
    <div className="App relative">
      {/* extra calling */}
      {seeLogut && (
        <LogOutModal
          toggleModal={toggleModal}
          seeLogut={seeLogut}
          handleLogout={handleLogout}
        />
      )}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={true}
        pauseOnHover={false}
        transition={Bounce} // Ensure transition is correctly used here
        limit={3}
      />
      {/* main content of the app */}
      <div className="relative">
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Messenger />} />
          </Route>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
