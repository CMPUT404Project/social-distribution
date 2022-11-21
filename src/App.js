import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { PublicRoute as Pub, PrivateRoute as Priv } from "./components/AuthRoutes";

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
                <Route path="/" element={<Pub><LoginPage/></Pub>}/>
                <Route path="/register" element={<Pub><RegisterPage/></Pub>}/>

                <Route path="/homepage" element={<Priv><HomePage/></Priv>}/>
                <Route path="/profile" element={<Priv><ProfilePage/></Priv>}/>
                <Route path="/account" element={<Priv><AccountPage/></Priv>}/>
                <Route path="/inbox" element={<Priv><InboxPage/></Priv>}/>
                <Route path="/friends" element={<Priv><FriendsPage/></Priv>}/>
                <Route path="/github" element={<Priv><GithubPage/></Priv>}/>
            </Routes>
        </Router>
    );
}

export default App;
