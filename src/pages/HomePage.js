import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar/NavBar";
// import axios from 'axios';

function HomePage() {
    const navigate = useNavigate();

    const [accessToken, setAccessToken] = useState(localStorage.getItem('access_token') || sessionStorage.getItem('access_token'));
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refresh_token') || sessionStorage.getItem('refresh_token'));


    useEffect(() => {
        if (!accessToken) {
            navigate('/')
        }
    }, [accessToken, refreshToken, navigate]);

    const handleLogout = () => {
        setAccessToken("");
        setRefreshToken("");
        localStorage.clear();
        sessionStorage.clear();
    };

    return (
        // TEMPORARY HTML USED FOR TESTING
        <>
            <NavBar />
            <div className="container">
                <div style={{width:'450px',wordWrap: 'break-word'}}>
                    Access Token: {accessToken}
                </div>
                <div className="logout-btn-continer">
                    <button className="logout-btn" onClick={handleLogout}>
                        LOGOUT
                    </button>
                </div>
            </div>
        </>
    )
}

export default HomePage;