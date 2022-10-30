import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React from "react";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import FriendsPage from "./pages/FriendsPage";
import Profile from "./pages/Profile";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage/>}/>
                <Route path="/register" element={<RegisterPage/>}/>
                <Route path="/homepage" element={<HomePage/>}/>
                <Route path="/friends" element={<FriendsPage/>}/>
                <Route path="/profile" element={<Profile/>}/>
            </Routes>
        </Router>
    );
}

export default App;
