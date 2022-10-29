import { Card, Typography, Grid } from "@mui/material";
import axios from "axios";
import jwtDecode from "jwt-decode";
import React, { useEffect, useState } from "react";
import { Navigate, redirect } from "react-router-dom";
import "./FriendsList.css";

export const User = (props) => {
    let displayName = props.data.displayName;
    let github = props.data.github;
    let profileImage = props.data.profileImage
        ? props.data.profileImage
        : "https://i.imgur.com/w3UEu8o.jpeg";
    var status = ["Friend", "True Friend", "Real Friend"];
    return (
        <Grid>
            <Card
                className="hoverCard"
                style={{ margin: 3, padding: "2% 2%", cursor: "pointer" }}
                elevation={15}
                onClick={() => {
                    window.open(props.data.url);
                }}
            >
                <img
                    style={{
                        borderRadius: "50%",
                        height: "100px",
                        width: "100px",
                        objectPosition: "center",
                        objectFit: "cover",
                    }}
                    src={profileImage}
                    alt="profile"
                />
                <Typography
                    variant="h4"
                    style={{ display: "inline", padding: "0% 5%" }}
                >
                    {displayName}
                </Typography>
                <Typography variant="h6" style={{ display: "inline" }}>
                    {github}
                </Typography>
                {/* Status of relationship is currently random for display */}
                <Typography
                    variant="h7"
                    style={{ display: "inline", float: "right" }}
                >
                    {status[Math.floor(Math.random() * status.length)]}
                </Typography>
            </Card>
        </Grid>
    );
};

export const FriendsList = () => {
    const [accessToken, setAccessToken] = useState(
        localStorage.getItem("access_token") ||
            sessionStorage.getItem("access_token")
    );
    const [refreshToken, setRefreshToken] = useState(
        localStorage.getItem("refresh_token") ||
            sessionStorage.getItem("refresh_token")
    );
    const [followers, setFollowers] = useState([]);

    useEffect(() => {
        if (!accessToken) {
            redirect("/");
        } else {
            let decode = jwtDecode(accessToken);
            let aID = decode["author_id"].split("/authors")[1];
            // setFollowers(decode)
            axios
                .get("/service/authors" + aID + "/followers")
                .then((res) => {
                    let data = JSON.parse(res);
                    setFollowers(data["items"]);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    });

    var data = {
        type: "followers",
        items: [
            {
                type: "author",
                id: "http://127.0.0.1:5454/authors/1d698d25ff008f7538453c120f581471",
                url: "http://127.0.0.1:5454/authors/1d698d25ff008f7538453c120f581471",
                host: "http://127.0.0.1:5454/",
                displayName: "Greg Johnson",
                github: "http://github.com/gjohnson",
                profileImage: "https://i.imgur.com/k7XVwpB.jpeg",
            },
            {
                type: "author",
                id: "http://127.0.0.1:5454/authors/9de17f29c12e8f97bcbbd34cc908f1baba40658e",
                host: "http://127.0.0.1:5454/",
                displayName: "Lara Croft",
                url: "http://127.0.0.1:5454/authors/9de17f29c12e8f97bcbbd34cc908f1baba40658e",
                github: "http://github.com/laracroft",
                profileImage: "https://i.imgur.com/k7XVwpB.jpeg",
            },
            {
                type: "author",
                id: "http://127.0.0.1:8000/authors/9de17f29c12e8f97bcbbd34cc908f1658e",
                host: "http://127.0.0.1:8000/",
                displayName: "Byron Tung",
                url: "http://127.0.0.1:8000/authors/9de17f29c12e8f97bcbbd34cc908f1658e",
                github: "http://github.com/byrontung",
                profileImage: "https://i.imgur.com/LRoLTlK.jpeg",
            },
            {
                type: "author",
                id: "http://127.0.0.1:8000/authors/9de17f29c12e8f97bcbbd34cc908fff1658e",
                host: "http://127.0.0.1:8000/",
                displayName: "Tyron Bung",
                url: "http://127.0.0.1:8000/authors/9de17f29c12e8f97bcbbd34cc908fff1658e",
                github: "http://github.com/tyronbung",
            },
        ],
    };
    let users = data.items;
    // console.log(users)
    return (
        <>
            {users.map((d) => {
                return <User key={d.id} data={d}></User>;
            })}
        </>
    );
};
