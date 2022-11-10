import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React from "react";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import FriendsPage from "./pages/FriendsPage";
import ProfilePage from "./pages/ProfilePage";
import AccountPage from "./pages/AccountPage";
import InboxPage from "./pages/InboxPage";
import GithubPage from "./pages/GithubPage";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage/>}/>
                <Route path="/register" element={<RegisterPage/>}/>
                <Route path="/homepage" element={<HomePage/>}/>
                <Route path="/profile" element={<ProfilePage/>}/>
                <Route path="/account" element={<AccountPage/>}/>
                <Route path="/inbox" element={<InboxPage/>}/>
                <Route path="/friends" element={<FriendsPage/>}/>
                <Route path="/github" element={<GithubPage/>}/>
            </Routes>
        </Router>
    );
}

export default App;
