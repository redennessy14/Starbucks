import React from "react";
import Home from "./pages/Home/Home";
import ProductsContextProvider from "./context/productContext";
import Navbar from "./components/Navbar";
import Routing from "./Routing";
import { BrowserRouter } from "react-router-dom";
import AuthContext from "./context/authContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./components/Footer/Footer";

function App() {
  return (
    <BrowserRouter>
      <AuthContext>
        <ProductsContextProvider>
          <ToastContainer />
          <Navbar />
          <Routing />
          <Footer />
        </ProductsContextProvider>
      </AuthContext>
    </BrowserRouter>
  );
}

export default App;
