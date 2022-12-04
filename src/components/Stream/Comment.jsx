import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { Avatar, Button, Card, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";

import { getAccessToken, retrieveCurrentAuthor } from "../../utils";
import RemoteAuthService from "../../services/RemoteAuthService";

export const Comment = (props) => {
    const [likeableComment, setLikeableComment] = useState(true);
    const [likesList, setLikesList] = useState([]);
    const [likes, setLikes] = useState(0);

    const commentURITokens = props.data.id.split("/");
    const aID = commentURITokens[4];
    const pID = commentURITokens[6];
    const cID = commentURITokens[8];

    const userJSON = retrieveCurrentAuthor();
    useEffect(() => {
        if (
            props.data.id.includes("localhost") ||
            props.data.id.includes("127.0.0.1") ||
            props.data.id.includes("https://social-distribution-404.herokuapp.com")
        ) {
            axios
                .get("/authors/" + aID + "/posts/" + pID + "/comments/" + cID + "/likes", {
                    headers: {
                        Authorization: "Bearer " + getAccessToken(),
                    },
                })
                .then((res) => {
                    setLikes(res.data.items.length);
                    setLikesList(res.data.items);
                    // returning true/false is needed for array.every(), if return false -> break
                    likesList.every((element) => {
                        if (element.author.id === userJSON.id) {
                            setLikeableComment(false);
                            return false;
                        }
                        return true;
                    });
                })
                .catch((e) => {
                    console.log(e);
                });
        }
        // host is passed as prop from the post component
        else if (props.host.includes("https://true-friends-404.herokuapp.com")) {
            const team12cID = props.data.id;
            RemoteAuthService.getRemoteLikesOnComment("Team 12", aID, pID, team12cID).then((response) => {
                setLikes(response.length);
                // returning true/false is needed for array.every(), if return false -> break
                likesList.every((element) => {
                    if (element.author.id === userJSON.id) {
                        setLikeableComment(false);
                        return false;
                    }
                    return true;
                });
            });
        } 
        // else if (props.host.includes("https://true-friends-404.herokuapp.com")) {
        // }
    }, [likes, likesList]);

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
                    {/* team 12 props.data.author === team 19 props.data.author.displayName */}
                    {props.data.author.displayName ? props.data.author.displayName : props.data.author}
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
