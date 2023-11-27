import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import Cart from "./pages/Cart";
import Product from "./pages/Product";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
        </Route>
        <Route path="/cart" element={<Layout />}>
          <Route index element={<Cart />} />
        </Route>
        <Route path="/products/:groupId/:isbn" element={<Layout />}>
          <Route index element={<Product />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
