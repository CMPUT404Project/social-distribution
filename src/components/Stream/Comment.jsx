import {
    Avatar,
    Box,
    Button,
    Card,
    Grid,
    Menu,
    MenuItem,
    SvgIcon,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import axios from "axios";
import jwtDecode from "jwt-decode";
import React, { useEffect, useState } from "react";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import AuthService from "../../services/AuthService";

export const Comment = (props) => {
    const [likeablePost, setLikeablePost] = useState(true);
    const [likes, setLikes] = useState(0);

    const userJSON = JSON.parse(AuthService.retrieveCurrentUser())
    console.log(props)
    useEffect(() => {
        const commentURITokens = props.data.id.split("/")
        const aid = commentURITokens[4]
        const pid = commentURITokens[6]
        const cid = commentURITokens[8]
        axios.get("/authors/" + aid + "/posts/" + pid + "/comments/" + cid)
    }, [])

    const handleLikeOnClick = () => {
        setLikeablePost(!likeablePost);
        const data = {
            context: "TODO",
            summary: userJSON.displayName + " Likes your post",
            type: "Like",
            author: userJSON,
            object: props.data.id,
        };
        const aID = userJSON.id.split("/authors/")[1];
        // console.log("Make POST request to ->" + "/service/authors/" + aID + "/inbox/" + "\nData -> ");
        console.log(data); 
        axios
            .post("/authors/" + aID + "/inbox", data, {
                headers: {
                    Authorization: "Bearer " + AuthService.getAccessToken(),
                },
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <Card
            key={props.data.id}
            elevation={10}
            style={{
                backgroundColor: "#D3D3D3",
                borderRadius: "0",
                display: "flex",
            }}
        >
            <Avatar alt="user image" src={props.data.author.profileImage} style={{ margin: "1ex 1ex" }} />
            <div>
                <Typography variant="body1" padding="1em" fontWeight="bold">
                    {props.data.author.displayName}
                </Typography>
                <Typography variant="body1" padding="1em">
                    {props.data.comment}
                </Typography>
            </div>
            <Button
                style={{ margin: "2em 0 2em auto", left: "-50px" }}
                variant={likeablePost ? "contained" : "outlined"}
                onClick={handleLikeOnClick}
                endIcon={<ThumbUpIcon />}
            >
                {likes}
            </Button>
        </Card>
    );
};
