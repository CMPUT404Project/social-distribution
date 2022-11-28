import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { Avatar, Button, Card, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import AuthService from "../../services/AuthService";

export const Comment = (props) => {
    const [likeableComment, setLikeableComment] = useState(true);
    const [likesList, setLikesList] = useState([]);
    const [likes, setLikes] = useState(0);

    const userJSON = JSON.parse(AuthService.retrieveCurrentUser());
    useEffect(() => {
        const commentURITokens = props.data.id.split("/");
        const aid = commentURITokens[4];
        const pid = commentURITokens[6];
        const cid = commentURITokens[8];
        axios
            .get("/authors/" + aid + "/posts/" + pid + "/comments/" + cid + "/likes", {
                headers: {
                    Authorization: "Bearer " + AuthService.getAccessToken(),
                },
            })
            .then((res) => {
                setLikes(res.data.items.length);
                setLikesList(res.data.items);
                likesList.forEach((element) => {
                    setLikeableComment(element.author.id !== userJSON.id);
                });
            });
    }, [likes, likeableComment]);

    const handleLikeOnClick = () => {
        const data = {
            context: "http://TODO.com",
            summary: userJSON.displayName + " Likes your comment",
            type: "Like",
            author: userJSON,
            object: props.data.id,
        };
        const aID = userJSON.id.split("/authors/")[1];
        axios
            .post("/authors/" + aID + "/inbox", data, {
                headers: {
                    Authorization: "Bearer " + AuthService.getAccessToken(),
                },
            })
            .then(() => {
                setLikeableComment(false);
            })
            .catch((err) => {
                if (err.response.status === 409) {
                    console.log("You already like this post!");
                } else {
                    console.log(err);
                }
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
                variant={likeableComment ? "contained" : "disabled"}
                onClick={handleLikeOnClick}
                endIcon={<ThumbUpIcon />}
            >
                {likes}
            </Button>
        </Card>
    );
};
