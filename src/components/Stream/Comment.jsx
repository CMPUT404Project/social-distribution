import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { Avatar, Button, Card, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";

import { getAccessToken, retrieveCurrentAuthor } from "../../utils";
import AuthService from "../../services/AuthService";

export const Comment = (props) => {
    const [likeableComment, setLikeableComment] = useState(true);
    const [likesList, setLikesList] = useState([]);
    const [likes, setLikes] = useState(0);

    const userJSON = retrieveCurrentAuthor();
    useEffect(() => {
        const commentURITokens = props.data.id.split("/");
        const aid = commentURITokens[4];
        const pid = commentURITokens[6];
        const cid = commentURITokens[8];
        axios
            .get("/authors/" + aid + "/posts/" + pid + "/comments/" + cid + "/likes", {
                headers: {
                    Authorization: "Bearer " + getAccessToken(),
                },
            })
            .then((res) => {
                setLikes(res.data.items.length);
                setLikesList(res.data.items);
                likesList.forEach((element) => {
                    if (element.author.id === userJSON.id) {
                        setLikeableComment(false);
                    }
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
        // console.log(data);
        // this gets the aID of the author's comment
        axios
            .get(props.data.id, {
                headers: {
                    Authorization: "Bearer " + getAccessToken(),
                },
            })
            .then((res) => {
                let commenterUUID = res.data.author.id.split("/authors/")[1];
                // send to inbox of the commenter on the post
                axios
                    .post("/authors/" + commenterUUID + "/inbox", data, {
                        headers: {
                            Authorization: "Bearer " + getAccessToken(),
                        },
                    })
                    .then(() => {
                        setLikeableComment(false);
                    })
                    .catch((err) => {
                        if (err.response.status === 409) {
                            console.log("You already like this comment!");
                        } else {
                            console.log(err);
                        }
                    });
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
