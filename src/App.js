import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React from "react";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import FriendsPage from "./pages/FriendsPage";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/friends" element={<FriendsPage/>}/>
            </Routes>
        </Router>
    );
}

export default App;
