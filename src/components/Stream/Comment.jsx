import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { Avatar, Button, Card, Link, Typography, CardHeader, CardContent } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";

import RemoteAuthService from "../../services/RemoteAuthService";
import { getAccessToken, retrieveCurrentAuthor, getCurrentAuthorID} from "../../utils";

export const Comment = (props) => {
    const [likeableComment, setLikeableComment] = useState(true);
    const [likesList, setLikesList] = useState([]);
    const [likes, setLikes] = useState(0);
    const [likesFlag, setLikesFlag] = useState(false);

    const commentURITokens = props.data.id.split("/");
    const aID = commentURITokens[4];
    const pID = commentURITokens[6];
    const cID = commentURITokens[8];
    const host = props.host;

    const userJSON = retrieveCurrentAuthor();

    const [commenterURL, setCommenterURL] = useState(props.data.id.replace("authors", "profile").split("/posts")[0]);

    useEffect(() => {
        if (
            props.host.includes("localhost") ||
            props.host.includes("127.0.0.1") ||
            props.host.includes("https://social-distribution-404.herokuapp.com")
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
                setLikesList(response)
                // returning true/false is needed for array.every(), if return false -> break
                likesList.every((element) => {
                    console.log(element.author.id, userJSON.id)
                    if (element.author.id === userJSON.id) {
                        setLikeableComment(false);
                        return false;
                    }
                    return true;
                });
            });
        } else if (props.host.includes("https://cmput404-team13.herokuapp.com")) {
            RemoteAuthService.getRemoteLikesOnComment("Team 13", aID, pID, props.data.id).then((response) => {
                setLikes(response.length);
                setLikesList(response)
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
    }, [likes, likeableComment]);

    useEffect(() => {
        let newArray = [...commenterURL.split("/")];
        if (commenterURL.split("profile/")[0] === "http://127.0.0.1:8000/") {
            newArray.splice(0,3,"http://localhost:3000")
            setCommenterURL(newArray.join("/"))
        } else if (commenterURL.split("profile/")[0] === "https://true-friends-404.herokuapp.com/") {
            newArray.splice(4,0,"remote/team12")
            setCommenterURL(newArray.join("/"))
        } else if (commenterURL.split("profile/")[0] === "https://cmput404-team13.herokuapp.com/") {
            newArray.splice(4,0,"remote/team13")
            setCommenterURL(newArray.join("/"))
        }
    }, [])

    const handleLikeOnClick = () => {
        const data = {
            context: "http://TODO.com",
            summary: userJSON.displayName + " Likes your comment",
            type: "Like",
            author: userJSON,
            object: props.data.id,
        };
        // this gets the aID of the author's comment
        if (
            props.data.author.id.includes("https://social-distribution-404.herokuapp.com") ||
            props.data.author.id.includes("http://127.0.0.1:8000") ||
            props.data.author.id.includes("localhost")
        ) {
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
        } else if (props.data.author.id.includes("https://true-friends-404.herokuapp.com")) {
            const team12cID = props.data.id.split("/comments/")[1];
            const postAuthorID = getCurrentAuthorID()
            RemoteAuthService.sendLikeRemoteComment("Team 12", team12cID, postAuthorID, undefined).then(() => {
                setLikeableComment(false);
            });
        } else if (props.data.author.id.includes("https://cmput404-team13.herokuapp.com")) {
            // console.log(props)
            const team13cID = props.data.id;
            const postAuthorID = props.data.author.id;
            const postID = props.data.post.id;
            RemoteAuthService.sendLikeRemoteComment("Team 13", team13cID, postAuthorID, postID).then(() => {
                setLikeableComment(false);
            });
        }
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
            <CardContent
                style={{padding: "20px 0 1em 0"}}
            >
                <div className="comment-header">
                    <Link href={commenterURL} variant="body1" fontWeight="bold" underline="hover">
                        {props.data.author.displayName}
                    </Link>
                    <Typography variant="body1">
                        {props.data.comment}
                    </Typography>
                </div>
            </CardContent>
            <CardHeader
                style={{marginLeft: "auto", paddingLeft: "0"}}
                action={
                    <Button
                        aria-label="settings"
                        variant={likeableComment ? "text" : "disabled"}
                        onClick={handleLikeOnClick}
                        endIcon={<ThumbUpIcon />}
                    >
                        {likes}
                    </Button>
                }
            />
        </Card>
    );
};
