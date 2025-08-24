import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Product from "./pages/Product";

import { UserProvider } from "./contexts/UserContext"; //For sharing context


function App() {
  return (
    <UserProvider>
      <Router>
        <div className="App">
          <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/product" element={<Product />} />
        </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
