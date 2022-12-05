import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { Avatar, Box, Button, Card, Grid, responsiveFontSizes, TextField, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import RemoteAuthService from "../../services/RemoteAuthService";

import { getAccessToken, retrieveCurrentAuthor } from "../../utils";
import { PostTextbox } from "../PostTextbox/PostTextbox";
import { Comment } from "./Comment";
import { v4 as uuidv4 } from 'uuid';
import AuthService from "../../services/AuthService";
import ClipLoader from 'react-spinners/ClipLoader';

import "./Comment.css"

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

    const [commenterURL, setCommenterURL] = useState(props.data.id.replace("authors", "author").replace("posts", "post"));


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

    useEffect(() => {
        let newArray = [...commenterURL.split("/")];
        if (commenterURL.split("author/")[0] === "http://127.0.0.1:8000/") {
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
    When making a comment, pressing the "Enter" key will be the trigger for posting a comment.
    */
    const handleEnter = (e) => {
        if (e.key === "Enter" && e.target.value !== "") {
            e.preventDefault();
            const postTextBox = e.target.value;

            if ( 
                props.data.id.includes("localhost") ||
                props.data.id.includes("127.0.0.1") ||
                props.data.id.includes("https://social-distribution-404.herokuapp.com")
            ) {
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
                  let currentAuthorInfo = retrieveCurrentAuthor();
                  let currentAuthorUsername = currentAuthorInfo.displayName;
                  let currentAuthorID = currentAuthorInfo.id.split("/authors/")[1];
                  console.log(team12CommentData);
                      axios.post(
                          `https://true-friends-404.herokuapp.com/authors/${currentAuthorID}/${currentAuthorUsername}/posts/${pID}/comments/`,
                          team12CommentData,
                          {
                              headers: {
                                  Authorization: "Bearer " + res.data.access,
                                  "Content-Type": "application/json",
                              },
                          }
                      )
                      .then((res) => {
                          setIsCommentSubmitted(!isCommentsSubmitted);
                          e.target.value = "";
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
                        let currentAuthorID = currentAuthorInfo.id.split("/authors/")[1];
                        let pID = props.data.id.split("/posts/")[1];
                        let team13CommentData = {
                          comment: postTextBox,
                          author: {
                            id: currentAuthorID,
                            displayName: currentAuthorInfo.displayName,
                          },
                          id: uuidv4(),
                        };
                        axios.post(
                            `https://cmput404-team13.herokuapp.com/authors/${currentAuthorID}/posts/${pID}/comments`,
                            team13CommentData,
                            {
                                headers: {
                                    Authorization: "Bearer " + res.data.jwt,
                                    "Content-Type": "application/json",
                                },
                            }
                        )
                        .then((res) => {
                            setIsCommentSubmitted(!isCommentsSubmitted);
                            e.target.value = "";
                        });
                    });
            }
        }
    };
    return (
        <Box style={{ display: "flex", flexDirection: "column", width: "70%" }}>
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
                >
                    <Avatar alt="user image" src={props.data.author.profileImage} sx={{ width: 70, height: 70 }} style={{ margin: "0 1ex 0 1ex" }} />
                    <Typography variant="h5">{props.data.author.displayName}</Typography>
                </Box>
                <Box style={{display: "flex",justifyContent: 'center',}}>
                    <Link href={commenterURL} variant="h4" style={{color: "#000", textDecoration: "underline"}}>{props.data.title}</Link>
                </Box>
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
                        return <Comment key={com.id} data={com} host={props.data.id} />;
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

async function updateAndDeletePost(aID, pID, response, postData, currIndex) {
    if (response.status !== 200) {
        postData.splice(currIndex, 1)
        await AuthService.deletePost(aID, pID)
    }
    else {
        let updated_data = {
            "title": response.data.title, 
            "description": response.data.description, 
            "contentType": response.data.contentType, 
            "content": response.data.content,
            "categories": "[]",
        }
        postData[currIndex].title = response.data.title
        postData[currIndex].description = response.data.description
        postData[currIndex].contentType = response.data.contentType
        postData[currIndex].content = response.data.content
        postData[currIndex].categories = "[]"
        await AuthService.updatePost(aID, pID, updated_data)
    }
}

async function sendCommentToTeam12(){
}

function Stream() {
    const [isLoading, setLoading] = useState(true);
    const [posts, setPosts] = useState([]);

    const [accessToken, setAccessToken] = useState(
        localStorage.getItem("access_token") || sessionStorage.getItem("access_token")
    );

    useEffect(() => {
        let promises = [];
        const aID = retrieveCurrentAuthor().id.split("/authors/")[1];
        axios.get("/authors/" + aID + "/inbox?type=posts", {
                headers: { Authorization: "Bearer " + accessToken },
            })
            .then((res) => {
                for (let i=res.data.items.length-1; i>=0; i--) {
                    let raID = res.data.items[i].id.split("/authors/")[1].split("/posts/")[0]
                    let pID = res.data.items[i].id.split("/posts/")[1]
                    if (res.data.items[i].source.includes("https://true-friends-404.herokuapp.com")) {
                        promises.push(RemoteAuthService.getRemotePost("Team 12", raID, pID).then((response) => {
                            promises.push(updateAndDeletePost(raID, pID, response, res.data.items, i).then())
                        }))
                    }
                    else if (res.data.items[i].source.includes("https://cmput404-team13.herokuapp.com")) {
                        promises.push(RemoteAuthService.getRemotePost("Team 13", raID, pID).then((response) => {
                            promises.push(updateAndDeletePost(raID, pID, response, res.data.items, i).then())
                        }))
                    }
                }
                Promise.all(promises).then(() => {
                    setPosts(res.data.items)
                })
                setLoading(false)
            })
            .catch((err) => {
                console.log(err);
            })
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
