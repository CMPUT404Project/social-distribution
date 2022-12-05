import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { Avatar, Box, Button, Card, Grid, TextField, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import RemoteAuthService from "../../services/RemoteAuthService";

import { getAccessToken, retrieveCurrentAuthor } from "../../utils";
import { PostTextbox } from "../PostTextbox/PostTextbox";
import { Comment } from "./Comment";
import { v4 as uuidv4 } from 'uuid';

export const Post = (props) => {
    // const [show, setShow] = useState(false);
    // const [anchor, setAnchor] = useState(null);
    const [comments, setComments] = useState([]);
    const [likeablePost, setLikeablePost] = useState(true);
    const [likes, setLikes] = useState(0);
    const [likeList, setLikeList] = useState([]);
    const [isCommentsSubmitted, setIsCommentSubmitted] = useState(false);

    // cannot get from AuthService since author can be remote
    const aID = props.data.id.split("/authors/")[1].split("/posts/")[0];
    const pID = props.data.id.split("/posts/")[1];

    // get comments of a post
    useEffect(() => {
        if (
            props.data.id.includes("localhost") ||
            props.data.id.includes("127.0.0.1") ||
            props.data.id.includes("https://social-distribution-404.herokuapp.com")
        ) {
            axios
                .get("/authors/" + aID + "/posts/" + pID + "/comments", {
                    headers: {
                        Authorization: "Bearer " + getAccessToken(),
                    },
                })
                .then((res) => {
                    setComments(res.data.comments);
                })
                .catch((err) => console.log(err));
        } else if (props.data.id.includes("https://true-friends-404.herokuapp.com")) {
            RemoteAuthService.getRemoteComments("Team 12", aID, pID)
                .then((response) => {
                    setComments(response);
                    // console.log(comments);
                })
                .catch((err) => console.log(err));
            // console.log(response)
        } else if (props.data.id.includes("https://cmput404-team13.herokuapp.com")) {
            RemoteAuthService.getRemoteComments("Team 13", aID, pID)
                .then((response) => {
                    setComments(response);
                    // console.log(response)
                })
                .catch((err) => console.log(err));
        }
    }, [isCommentsSubmitted]);

    // get likes of a post
    useEffect(() => {
        //ex ID: "http://127.0.0.1:5454/authors/9n58e/posts/764e"

        const pID = props.data.id.split("/posts/")[1];
        if (
            props.data.id.includes("localhost") ||
            props.data.id.includes("127.0.0.1") ||
            props.data.id.includes("https://social-distribution-404.herokuapp.com")
        ) {
            axios
                .get("/authors/" + aID + "/posts/" + pID + "/likes", {
                    headers: {
                        Authorization: "Bearer " + getAccessToken(),
                    },
                })
                .then((res) => {
                    setLikes(res.data.items.length);
                    setLikeList(res.data.items);
                    likeList.forEach((element) => {
                        if (element.author.id === currentUser.id) {
                            setLikeablePost(false);
                        }
                    });
                })
                .catch((e) => {
                    console.log(e);
                });
        } else if (props.data.id.includes("https://true-friends-404.herokuapp.com")) {
            RemoteAuthService.getRemoteLikesOnPost("Team 12", aID, pID).then((response) => {
                setLikes(response.length);
                setLikeList(response);
                likeList.forEach((element) => {
                    if (element.author === currentUser.id.split("/authors/")[1]) {
                        setLikeablePost(false);
                    }
                });
            });
        } else if (props.data.id.includes("https://cmput404-team13.herokuapp.com")) {
            RemoteAuthService.getRemoteLikesOnPost("Team 13", aID, pID).then((response) => {
                setLikes(response.length);
                setLikeList(response);
                likeList.forEach((element) => {
                    if (element.author === currentUser.id.split("/authors/")[1]) {
                        setLikeablePost(false);
                    }
                });
            });
        }
    }, [likes, likeablePost]);

    const currentUser = retrieveCurrentAuthor();

    const handleLikeOnClick = (e) => {
      console.log("inside handleLikeOnClick");
        var data = {
            type: "Like",
            context: "http://TODO.com/",
            summary: currentUser.displayName + " Likes your post",
            author: currentUser,
            object: props.data.id,
        };
        // send inbox to author of post
        if (
            props.data.id.includes("localhost") ||
            props.data.id.includes("127.0.0.1") ||
            props.data.id.includes("https://social-distribution-404.herokuapp.com")
        ) {
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
        } else if (props.data.id.includes("https://true-friends-404.herokuapp.com")) {
            RemoteAuthService.sendLikeRemotePost("Team 12", aID, pID)
                .then(() => setLikeablePost(false))
                .catch((err) => {
                    console.log(err);
                });
        } else if (props.data.id.includes("https://cmput404-team13.herokuapp.com")) {
            RemoteAuthService.sendLikeRemotePost("Team 13", aID, pID)
                .then(() => setLikeablePost(false))
                .catch((err) => {
                    console.log(err);
                });
        }
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

            // Team 12 implementation
            if ( props.data.origin.includes("https://true-friends-404.herokuapp.com")) {

                // get jwt token
                axios
                    .post(
                        "https://true-friends-404.herokuapp.com/api/token/obtain/",
                        {
                            email: process.env.REACT_APP_T12USER,
                            password: process.env.REACT_APP_T12PASS,
                        },
                        {
                            headers: {
                                "Content-Type": "application/json",
                                "Access-Control-Allow-Origin": "*",
                            },
                        }
                    )
              .then((res) => {
                  console.log(props.data);
                  let pID = props.data.id.split("/posts/")[1];
                  let team12CommentData = {
                    comment: postTextBox,
                  };
                  console.log(team12CommentData);
                      axios.post(
                          `https://true-friends-404.herokuapp.com/authors/${aID}/${props.data.author.displayName}/posts/${pID}/comments/`,

                          team12CommentData,
                          {
                              headers: {
                                  Authorization: "Bearer " + res.data.access,
                                  "Content-Type": "application/json",
                              },
                          }
                      )
                      .then((res) => {
                          console.log(res);
                          console.log(props.data);
                          let pID = props.data.id.split("/posts/")[1];
                          let team12CommentData = {
                            comment: postTextBox,
                          };
                          console.log(team12CommentData);
                              axios.post(
                                  // UNCOMMENT WHEN FINSIHED TESTING
                                  `https://true-friends-404.herokuapp.com/authors/${aID}/${props.data.author.displayName}/posts/${pID}/comments/`,
                                  team12CommentData,
                                  {
                                      headers: {
                                          Authorization: "Bearer " + res.data.access,
                                          "Content-Type": "application/json",
                                      },
                                  }
                              )
                              .then((res) => {
                                  console.log(res);
                              });
                            });
                });
              }
            else if ( props.data.origin.includes("https://cmput404-team13.herokuapp.com")) {
                axios
                    .put("https://cmput404-team13.herokuapp.com/users", {
                        username: process.env.REACT_APP_T13USER,
                        password: process.env.REACT_APP_T13PASS,
                    })
                    .then((res) => {
                        // get jwt token
                        let currentAuthorInfo = retrieveCurrentAuthor();
                        let pID = props.data.id.split("/posts/")[1];
                        let originalAuthorID = props.data.author.id.split("/authors/")[1];
                        let team13CommentData = {
                          comment: postTextBox,
                          author: {
                            id: currentAuthorInfo.id.split("/authors/")[1],
                            displayName: currentAuthorInfo.displayName,
                          },
                          id: uuidv4(),
                        };
                        axios.post(

                            `https://cmput404-team13.herokuapp.com/authors/${originalAuthorID}/posts/${pID}/comments`,
                            team13CommentData,
                            {
                                headers: {
                                    Authorization: "Bearer " + res.data.jwt,
                                    "Content-Type": "application/json",
                                },
                            }
                        )
                    });
            }
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
                    textAlign: "center",
                    padding: "2em",
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
                <Typography variant="h4">{props.data.title}</Typography>
                <Typography variant="h6" textAlign="left">
                    {props.data.content}
                </Typography>
                <Button
                    style={{ marginTop: "1ex" }}
                    variant={likeablePost ? "contained" : "disabled"}
                    onClick={handleLikeOnClick}
                    endIcon={<ThumbUpIcon />}
                >
                    {likes}
                </Button>
            </Card>
            {/* slice is to prevent mutation of the original array of comments */}
            {comments
                .slice()
                .reverse()
                .map((com) => {
                    return <Comment key={com.id} data={com} host={props.data.id} />;
                })}
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

async function sendCommentToTeam12(){
}

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
