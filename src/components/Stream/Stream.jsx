import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { Avatar, Box, Button, Card, Grid, TextField, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";

import { getAccessToken, retrieveCurrentAuthor } from "../../utils";
import { PostTextbox } from "../PostTextbox/PostTextbox";
import { Comment } from "./Comment";


import "./Comment.css"

export const Post = (props) => {
    // const [show, setShow] = useState(false);
    // const [anchor, setAnchor] = useState(null);
    const [comments, setComments] = useState([]);
    const [likeablePost, setLikeablePost] = useState(true);
    const [likes, setLikes] = useState(0);
    const [likeList, setLikeList] = useState([]);
    const [isCommentsSubmitted, setIsCommentSubmitted] = useState(false);

    const aID = retrieveCurrentAuthor().id.split("/authors/")[1];
    const pID = props.data.id.split("/posts/")[1];

    // isSubmitted is used to let the webpage know to reload the comments
    useEffect(() => {
        axios.get("/authors/" + aID + "/posts/" + pID + "/comments", {
                headers: {
                    Authorization: "Bearer " + getAccessToken(),
                },
            })
            .then((res) => {
                setComments(res.data.comments);
            })
            .catch((err) => console.log(err));
    }, [isCommentsSubmitted]);

    useEffect(() => {
        axios
            .get("/authors/" + aID + "/posts/" + pID + "/likes", {
                headers: {
                    Authorization: "Bearer " + getAccessToken(),
                },
            })
            .then((res) => {
                setLikeList(res.data.items);
                setLikes(res.data.items.length);
                likeList.forEach((element) => {
                    if (element.author.id === currentUser.id) {
                        setLikeablePost(false);
                    }
                });
            })
            .catch((e) => {
                console.log(e);
            });
    }, [likes, likeablePost]);

    const currentUser = retrieveCurrentAuthor();

    const handleLikeOnClick = (e) => {
        var data = {
            type: "Like",
            context: "http://TODO.com",
            summary: currentUser.displayName + " Likes your post",
            author: currentUser,
            object: props.data.id,
        };
        // send inbox to author of post
        const posterID = props.data.author.id.split("/authors/")[1];
        axios
            .post("/authors/" + posterID + "/inbox", data, {
                headers: {
                    Authorization: "Bearer " + getAccessToken(),
                    ContentType: "application/json",
                },
            })
            .then(() => setLikeablePost(false))
            .catch((err) => {
                console.log(err);
            });
    };

    /* 
    Not implemented yet, but will check if you can follow/send friend request to user. Might be deleted.
    */
    // const onClickHandler = (e) => {
    //     setAnchor(e.currentTarget);
    //     setShow(!show);
    // };

    /* 
    When making a comment, pressing the "Enter" key will be the trigger for posting a comment.
    */
    const handleEnter = (e) => {
        if (e.key === "Enter" && e.target.value !== "") {
            e.preventDefault();
            const postTextBox = e.target.value;

            // TODO: data variable should be sent, postTextBox.value is the text that should be sent.
            let data = {
                type: "comment",
                author: retrieveCurrentAuthor(),
                comment: postTextBox,
                post: props.data.id.split("/posts/")[1],
                contentType: "text/plain",
            };

            const postAuthorID = props.data.author.id.split("/authors/")[1];
            axios
                .post("/authors/" + postAuthorID + "/inbox", data, {
                    headers: {
                        Authorization: "Bearer " + getAccessToken(),
                        ContentType: "application/json",
                    },
                })
                .then(() => {
                    setIsCommentSubmitted(!isCommentsSubmitted);
                    e.target.value = "";
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };
    return (
        <Box style={{ display: "flex", flexDirection: "column", width: "70%" }}>
            {/* will probably remove feature of following someone through stream */}
            {/* {show && (
                <Menu onClose={() => setShow(!show)} open={show} anchorEl={anchor}>
                    <MenuItem>Follow</MenuItem>
                    <MenuItem>Send Friend Request</MenuItem>
                </Menu>
            )} */}
            <Card
                style={{
                    padding: "1em",
                    paddingBottom: "0",
                    margin: "2em 0 0",
                    borderRadius: "10px 10px 0 0",
                }}
                elevation={10}
            >
                <Box
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                    }}
                    // onClick={onClickHandler}
                >
                    <Avatar alt="user image" src={props.data.author.profileImage} style={{ margin: "1ex 1ex" }} />
                    <Typography variant="h5">{props.data.author.displayName}</Typography>
                </Box>
                <Typography variant="h4" style={{textAlign: "center", textDecoration: "underline"}}>{props.data.title}</Typography>
                <Box 
                    style={{
                        border: "2px solid black",
                        borderRadius: "10px",
                        margin: "1em",
                        marginBottom: "0",
                        padding: "0.5em",
                        minHeight: "10em"
                    }}>
                    <Typography variant="h6" textAlign="left">{props.data.content}</Typography>
                </Box>
                <Box 
                    style={{
                        margin: "1em 1em",
                        backgroundColor: "#ccc"
                    }}
                >
                    <Button
                        style={{
                            width: "100%",
                            padding: "1em"
                        }}
                        variant={likeablePost ? "contained" : "disabled"}
                        onClick={handleLikeOnClick}
                        endIcon={<ThumbUpIcon />}
                    >
                        {likes}
                    </Button>
                </Box>
            </Card>
            {/* slice is to prevent mutation of the original array of comments */}
            <div className="comment">
                {comments
                    .slice()
                    .reverse()
                    .map((com) => {
                        return <Comment key={com.id} data={com} />;
                    })}
            </div>
            <TextField
                id="commentData"
                onKeyDown={handleEnter}
                label="Post a comment!"
                variant="filled"
                style={{
                    backgroundColor: "#E5E5E5",
                    borderRadius: "0 0 5px 5px",
                }}
            />
        </Box>
    );
};

function Stream() {
    const [posts, setPosts] = useState([]);

    const [accessToken, setAccessToken] = useState(
        localStorage.getItem("access_token") || sessionStorage.getItem("access_token")
    );

    useEffect(() => {
        const aID = retrieveCurrentAuthor().id.split("/authors/")[1];
        axios
            .get("/authors/" + aID + "/inbox?type=posts", {
                headers: { Authorization: "Bearer " + accessToken },
            })
            .then((res) => {
                setPosts(res.data.items);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    // Show new post when posting
    // useEffect(() => {
        
    // },[posts])


    return (
        <Grid container alignContent="center" minHeight={"100%"} flexDirection="column">
            <PostTextbox />
            {posts.length === 0 ? (
                <h1>You currently have no posts!</h1>
            ) : (
                posts.map((post) => {
                    if (post.type === "post") {
                        return <Post key={post.id} data={post} />;
                    }
                    return;
                })
            )}
        </Grid>
    );
}

export default Stream;
