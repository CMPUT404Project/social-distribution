import axios from "axios";
import jwtDecode from "jwt-decode";
import React, { useEffect, useState } from "react";
import { redirect } from "react-router-dom";
import NavBar from "../components/NavBar/NavBar";

function Profile() {
    const [user, setUser] = useState({});
    useEffect(() => {
        let token =
            localStorage.getItem("access_token") ||
            sessionStorage.getItem("access_token");
        if (!token) {
            redirect("/");
        }
        let decode = jwtDecode(token);
        // console.log(decode);
        let aID = decode["author_id"].split("/authors")[1];
        // console.log(aID)
        axios
            .get("/authors" + aID, {
                headers: {
                    Authorization: "Bearer " + token,
                },
            })
            .then((res) => {
                // let data = JSON.parse(res);
                setUser(res.data);
                console.log(user);
            })
            .catch((err) => console.log(err));
    }, []);

    return (
        <div>
            <NavBar />
            <h1>{user.type}</h1>
            <h2>{user.id}</h2>
            <h2>{user.host}</h2>
            <h2>{user.displayName}</h2>
            <h2>{user.url}</h2>
            <h2>{user.github}</h2>
            <h2>{user.profileImage}</h2>
        </div>
    );
}

export default Profile;
