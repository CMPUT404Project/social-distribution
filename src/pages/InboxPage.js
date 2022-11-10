import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar/NavBar";

// import axios from 'axios';

function InboxPage() {
    const navigate = useNavigate();

    const [accessToken, setAccessToken] = useState(localStorage.getItem('access_token') || sessionStorage.getItem('access_token'));
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refresh_token') || sessionStorage.getItem('refresh_token'));

    useEffect(() => {
    }, []);


    return (
        <>
        <NavBar />
            <div className="container">
                Inbox Page
            </div>
        </>
    )
}

export default InboxPage;