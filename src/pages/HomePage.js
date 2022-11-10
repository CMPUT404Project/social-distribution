import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar/NavBar";

import Stream from "../components/Stream/Stream";
// import axios from 'axios';

function HomePage() {
    const navigate = useNavigate();

    const [accessToken, setAccessToken] = useState(localStorage.getItem('access_token') || sessionStorage.getItem('access_token'));
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refresh_token') || sessionStorage.getItem('refresh_token'));

    useEffect(() => {
    }, []);


    return (
        <>
        <NavBar />
            <div className="container">
            <Stream />
                {/* <div style={{width:'450px',wordWrap: 'break-word'}}>
                    Access Token: {accessToken}
                </div> */}
            </div>
        </>
    )
}

export default HomePage;