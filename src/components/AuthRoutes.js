import { Navigate, useLocation } from "react-router-dom";

import {retrieveCurrentAuthor, getAccessToken} from "../utils/index"

export const PublicRoute = ({ children }) => {
    const isLoggedIn = getAccessToken() && retrieveCurrentAuthor();
    return !isLoggedIn ? children : <Navigate to="/homepage" replace/>
}


export const PrivateRoute = ({ children }) => {
    let location = useLocation();
    const isLoggedIn = getAccessToken() && retrieveCurrentAuthor();
    return isLoggedIn ? children : <Navigate to="/" state={{ from: location }} replace/>
}