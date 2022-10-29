import {
    AppBar,
    Avatar,
    Box,
    IconButton,
    Toolbar,
    Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import axios from "axios";

function NavBar() {
    const [user, setUser] = useState({});
    useEffect(() => {
        const token = sessionStorage.getItem("access_token") || localStorage.getItem("access_token");
        const decode = jwt_decode(token)["author_id"].split("/authors");
        axios
            .get("/authors" + decode[1], {
                headers: {
                    Authorization: "Bearer " + token,
                },
            })
            .then((res) => {
                setUser(res["data"]);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    return (
        <AppBar color="primary">
            <Toolbar>
                <Typography
                    variant="h4"
                    style={{ marginRight: "40%", whiteSpace: "nowrap" }}
                >
                    Social Distribution
                </Typography>
                <Box
                    sx={{
                        display: "flex",
                        width: "100%",
                        justifyContent: "space-evenly",
                    }}
                >
                    <IconButton href="/" sx={{ color: "white", mx: "2em" }}>
                        <Typography variant="h6">Home</Typography>
                    </IconButton>
                    <IconButton
                        href="friends"
                        sx={{ color: "white", mx: "2em" }}
                    >
                        <Typography variant="h6">Friends</Typography>
                    </IconButton>
                    <IconButton
                        href="profile"
                        sx={{ color: "white", mx: "2em" }}
                    >
                        <Avatar alt="user image" src={user["profileImage"]} />
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default NavBar;
