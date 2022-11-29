import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import { PublicRoute as Pub, PrivateRoute as Priv } from "./components/AuthRoutes";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import InboxPage from "./pages/InboxPage";
import GithubPage from "./pages/GithubPage";
import FollowersPage from "./pages/FollowersPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Pub><LoginPage/></Pub>}/>
                <Route path="/register" element={<Pub><RegisterPage/></Pub>}/>
                <Route path="*" element={<NotFoundPage/>}/>

                <Route path="/homepage" element={<Priv><HomePage/></Priv>}/>
                <Route path="/profile/:authorID" element={<Priv><ProfilePage/></Priv>}/>
                <Route path="/inbox" element={<Priv><InboxPage/></Priv>}/>
                <Route path="/followers" element={<Priv><FollowersPage/></Priv>}/>
                <Route path="/github" element={<Priv><GithubPage/></Priv>}/>
            </Routes>
        </Router>
    );
}

export default App;
