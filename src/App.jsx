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

function App() {
  return (
    <div className="App">
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
