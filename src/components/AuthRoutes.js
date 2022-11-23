import { Navigate, useLocation } from "react-router-dom";

import AuthService from "../services/AuthService";

export const PublicRoute = ({ children }) => {
    const isLoggedIn = AuthService.getAccessToken() && AuthService.retrieveCurrentAuthor();
    return !isLoggedIn ? children : <Navigate to="/homepage" replace/>
}


export const PrivateRoute = ({ children }) => {
    let location = useLocation();
    const isLoggedIn = AuthService.getAccessToken() && AuthService.retrieveCurrentAuthor();
    return isLoggedIn ? children : <Navigate to="/" state={{ from: location }} replace/>
}