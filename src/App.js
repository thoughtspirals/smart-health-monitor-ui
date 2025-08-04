import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

//user handlers
import Login from "./components/user-handlers/login.jsx";
import SignUp from "./components/user-handlers/signUp.jsx";

//pages
import HomePage from "./components/pages/home.jsx";

//reusables
import Header from "./components/reusable-components/header.jsx";
import Footer from "./components/reusable-components/footer.jsx";
import Sidebar from "./components/reusable-components/sidebar.jsx";

function App() {
  return (
    <div className="App">
      {/* <Header /> */}
      <Sidebar />
      <Routes>
        {/* pages */}
        <Route path="/" element={<HomePage />} />

        {/* user handlers */}
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
