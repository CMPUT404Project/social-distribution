import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import ReactMarkdown from 'react-markdown'
import ClipLoader from 'react-spinners/ClipLoader';
import { v4 as uuidv4 } from 'uuid';
import { 
    Alert, AlertTitle, Avatar, Box, Button, Card, Dialog, DialogContent,
    DialogAction, DialogTitle, CardHeader, Divider, Grid, IconButton, Link,
    Menu, MenuItem, TextField, Typography, Snackbar, Slide, 
} from "@mui/material";
import { ThumbUp, MoreVert, Share, Close } from "@mui/icons-material";

import { getAccessToken, retrieveCurrentAuthor, getCurrentAuthorID, capitalizeFirstLetter } from "../../utils";
import { PostTextbox } from "../PostTextbox/PostTextbox";
import { Comment } from "./Comment";
import AuthService from "../../services/AuthService";
import RemoteAuthService from "../../services/RemoteAuthService";

import "./Comment.css"

function SlideTransition(props: SlideProps) {
    return <Slide{...props} direction="down"/>;
}

export const Post = (props) => {
    // const [show, setShow] = useState(false);
    const navigate = useNavigate();
    const [anchor, setAnchor] = useState(null);
    const [openShare, setOpenShare] = useState(false);
    const [comments, setComments] = useState([]);
    const [likeablePost, setLikeablePost] = useState(true);
    const [likes, setLikes] = useState(0);
    const [likeList, setLikeList] = useState([]);
    const [isCommentsSubmitted, setIsCommentSubmitted] = useState(false);

    const currentUser = retrieveCurrentAuthor();
    const [isAuthor, setIsAuthor] = useState(false);

    const options = ["edit", "delete"]

    // cannot get from AuthService since author can be remote
    const aID = props.data.id.split("/authors/")[1].split("/posts/")[0];
    const pID = props.data.id.split("/posts/")[1];

    const [postTeam, setPostTeam] = useState("local")
    const [postURL, setPostURL] = useState(`https://social-distribution-404.herokuapp.com/author/${aID}/post/${pID}`);


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
                    // This forEach to delete the extra fields needs to be done
                    // because Team 12 gives all this extra information in their response
                    // and if these fields are not deleted, React throws a Error Decoder Link
                    // saying that passing these fields to a child component is prohibited
                    // Their endpoints were to far gone to change, so we had to adapt to them
                    response.forEach((comment) => {
                        comment.author.displayName = comment.author.username
                        delete comment.author.password
                        delete comment.author.last_login
                        delete comment.author.is_superuser
                        delete comment.author.email
                        delete comment.author.first_name
                        delete comment.author.last_name
                        delete comment.author.is_staff
                        delete comment.author.is_active
                        delete comment.author.date_joined
                        delete comment.author.groups
                        delete comment.author.user_permissions
                    })
                    console.log(response)
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
        let currentAuthorID = getCurrentAuthorID();
        if (aID === currentAuthorID) {
            setIsAuthor(true);
        }

        let newArray = [...postURL.split("/")];
        if (props.data.id.includes("http://127.0.0.1:8000/")) {
            newArray.splice(0,3,"http://localhost:3000")
            setPostURL(newArray.join("/"))
        } else if (props.data.id.includes("https://true-friends-404.herokuapp.com")) {
            setPostTeam("Team 12")
        } else if (props.data.id.includes("https://cmput404-team13.herokuapp.com")) {
            setPostTeam("Team 13")
        } else if (props.data.id.includes("https://team-sixteen.herokuapp.com")) {
            setPostTeam("Team 16")
        }



    }, [])

    const handleLikeOnClick = (e) => {
      console.log("inside handleLikeOnClick");
        var data = {
            type: "Like",
            context: "https://social-distribution-404.herokuapp.com/",
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

    const handleOpenShare = () => {
        setOpenShare(true);
    };
    const handleCloseShare = () => {
        setOpenShare(false);
    };

    const handleShare = async (event) => {
        handleCloseShare();
        let visibility = event.target.outerText;
        const allFollowers = await AuthService.getAuthorFollowers();
        let hostArray = [
            "https://true-friends-404.herokuapp.com/",
            "https://cmput404-team13.herokuapp.com/",
            "https://team-sixteen.herokuapp.com/"
        ];
        
        for (const follower of allFollowers) {
            let followerID = follower.id.split("/authors/")[1];
            if (
                follower.host.includes("https://social-distribution-404.herokuapp.com") ||
                follower.host.includes("http://127.0.0.1:8000") ||
                follower.host.includes("localhost")
            ) {
                let response = {status: 500};
                if (visibility === "PUBLIC") {
                    response = response.data ? response : await AuthService.sendInboxItem("post", followerID, {post:props.data});
                } else if (visibility === "FRIENDS") {
                    const isFollowing = await AuthService.getFollowStatus(aID, followerID);
                    if (isFollowing) {
                        response = response.data ? response : await AuthService.sendInboxItem("post", followerID, {post:props.data});
                    }
                }
                if (response.status === 201 || response.status === 409) {
                    props.setAlertDetails({alertSeverity: "success", 
                        errorMessage: "Successfully shared post"})
                } else {
                    props.setAlertDetails({alertSeverity: "error", 
                        errorMessage: "Failed to share post"})
                }
                handleOpen();
            } else if (
                follower.host.includes("https://true-friends-404.herokuapp.com") &&
                hostArray.find((item) => item.includes("https://true-friends-404.herokuapp.com")) !==
                    undefined
            ) {
                hostArray = hostArray.filter(
                    (item) => !item.includes("https://true-friends-404.herokuapp.com")
                );
                await RemoteAuthService.createRemotePost("Team 12", props.data);
            } else if (
                follower.host.includes("https://cmput404-team13.herokuapp.com") &&
                hostArray.find((item) => item.includes("https://cmput404-team13.herokuapp.com")) !==
                    undefined
            ) {
                hostArray = hostArray.filter(
                    (item) => !item.includes("https://cmput404-team13.herokuapp.com")
                );
                await RemoteAuthService.createRemotePost("Team 13", props.data, visibility)
            } else if (
                follower.host.includes("https://team-sixteen.herokuapp.com/") &&
                hostArray.find((item) => item.includes("https://team-sixteen.herokuapp.com/")) !==
                    undefined
            ) {
                // clear team13 from hostArray
                hostArray = hostArray.filter(
                    (item) => !item.includes("https://team-sixteen.herokuapp.com/")
                );
                await RemoteAuthService.createRemotePost("Team 16", props.data, visibility)
            }
        }
    }

    /* 
    When making a comment, pressing the "Enter" key will be the trigger for posting a comment.
    */
    const handleEnter = (e) => {
        if (e.key === "Enter") {
            if (e.target.value !== "") {
                e.preventDefault();
                const postTextBox = e.target.value;

                if ( 
                    props.data.id.includes("localhost") ||
                    props.data.id.includes("127.0.0.1") ||
                    props.data.id.includes("https://social-distribution-404.herokuapp.com")
                ) {
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
                    axios.put("https://cmput404-team13.herokuapp.com/users", {
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
                else if (props.data.origin.includes("https://team-sixteen.herokuapp.com/")) {
                    let data = {
                        type: "comment",
                        author: retrieveCurrentAuthor(),
                        comment: postTextBox,
                        post: props.data.id.split("/posts/")[1],
                        contentType: "text/plain",
                    };

                    const postAuthorID = props.data.author.id.split("/authors/")[1];
                    axios
                        .post("https://team-sixteen.herokuapp.com/authors/" + postAuthorID + "/inbox/", data, {
                            headers: {
                                Authorization: "Basic " + process.env.REACT_APP_T19BASICAUTH,
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
            }
        }
        setAnchor(null);
    };

    const handleOpenUserMenu = (event) => {
        setAnchor(event.currentTarget);
    };

    const handleCloseUserMenu = async (event) => {
        if (event.target.innerText === "edit") {
            navigate(`/author/${aID}/post/${pID}/edit`)
        } else if (event.target.innerText === "delete") {
            try {
                let promises = [];
                const response = await AuthService.deletePost(aID, pID)
                    .then((response) => {
                        if (response.status === 204) {
                            props.setAlertDetails({alertSeverity: "success", 
                                errorMessage: "Successfully deleted post"})
                            promises.push(RemoteAuthService.deleteRemotePost("Team 12", aID, pID).then())
                            promises.push(RemoteAuthService.deleteRemotePost("Team 13", aID, pID).then())
                        }
                    }, error => {
                        return error
                    })
                if (response) {
                    throw response
                }
                Promise.all(promises).then(() => {
                    handleOpen();
                    if (props.posts) {
                        props.setPosts(props.posts.filter((post) => post !== props.data));
                    }
                    navigate("/homepage", { replace: true })
                })
            } catch (error) {
                if (error.message) {
                    props.setAlertDetails({alertSeverity: "error", 
                        errorMessage: "Could not delete post. Try again later."})
                }
                handleOpen();
            }
        }
        setAnchor(null);
    };

    const handleOpen = () => {
        props.setOpen(true);
    };

    const handleUsernameClick = (event) => {
        let team = "local"
        if (props.data.id.includes("https://true-friends-404.herokuapp.com/")) {
            team = "team12"
        } else if (props.data.id.includes("https://cmput404-team13.herokuapp.com/")) {
            team = "team13"
        } else if (props.data.id.includes("https://team-sixteen.herokuapp.com/")) {
            team = "team16"
        }
        if (team === "local") {
            navigate("/profile/" + aID)
        } else {
            navigate("/profile/remote/" + team + "/" + aID)
        }
    }

    function isImagePost(){
        return (props.data.contentType === contentTypes[2]) || (props.data.contentType === contentTypes[3]) || (props.data.contentType === contentTypes[4])
    }

    const contentTypes = ["text/plain", "text/markdown", "application/base64", "image/png;base64", "image/jpeg;base64"];

    return (
        <>
        <Dialog onClose={handleCloseShare} open={openShare}>
            <DialogTitle variant="h5">
                Share to:
            </DialogTitle>
            <DialogContent sx={{paddingBottom: "0"}}>
                <Typography variant="h6">Who would you like to share the post to?</Typography>
            </DialogContent>
            <Box 
                style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "10px",
                    margin: "1em 1em",
                }}
            >
                <Button
                    style={{width: "100%", minWidth: "150px",padding: "10px",fontSize: "15px",}}
                    sx={{':hover': {backgroundColor: "#dc4191"}}}
                    variant="contained"
                    onClick={handleShare}
                >
                    Public
                </Button>
                <Divider orientation="vertical" variant="middle"  sx={{backgroundColor: "rgba(25, 118, 210, 0.2)"}} flexItem/>
                <Button
                    style={{width: "100%", minWidth: "150px",padding: "10px",fontSize: "15px",}}
                    sx={{':hover': {backgroundColor: "#dc4191"}}}
                    variant="contained"
                    onClick={handleShare}
                >
                    Friends
                </Button>
            </Box>
            <IconButton
                onClick={handleCloseShare}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <Close />
            </IconButton>
        </Dialog>
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
                <Box style={{ display: "flex", flexDirection: "row", alignItems: "center", }}
                >
                </Box>
                <CardHeader
                    style={{marginLeft: "auto", padding: "0"}}
                    avatar={
                        <Avatar 
                            alt="user image"
                            src={props.data.author.profileImage}
                            sx={{ width: 70, height: 70, cursor: "pointer" }}
                            style={{ margin: "0 0 0 1ex" }}
                            onClick={handleUsernameClick}
                        />
                    }
                    action={isAuthor ? (
                            <>
                            <IconButton onClick={handleOpenUserMenu}>
                                <MoreVert />
                            </IconButton>
                            <Menu
                                sx={{ mt: '35px', ml: '-20px'}}
                                anchorEl={anchor}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchor)}
                                onClose={handleCloseUserMenu}
                            >
                                {options.map((option) => (option === "delete") ? (
                                    <div key={option}>
                                        <Divider sx={{backgroundColor: "#d0d0d0"}}/>
                                        <MenuItem onClick={handleCloseUserMenu}>
                                            <Typography textAlign="center" fontSize="20px" color="red">{option}</Typography>
                                        </MenuItem>
                                    </div>
                                    ) : (
                                    <MenuItem key={option} onClick={handleCloseUserMenu}>
                                        <Typography textAlign="center" fontSize="20px">{option}</Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                            </>
                        ) : (
                            <Typography style={{paddingRight: "5px"}}>{postTeam}</Typography>
                        )
                    }
                    title={
                        <Typography onClick={handleUsernameClick} variant="h5" sx={{cursor: "pointer"}}>{props.data.author.displayName}</Typography>
                    }
                />
                <Box style={{display: "flex",justifyContent: 'center',}}>
                    <Link href={postURL} variant="h4" style={{color: "#000", textDecoration: "underline"}}>{props.data.title}</Link>
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
                    {(() => {
                        switch (props.data.contentType) {
                            case ("text/markdown"):
                                return <ReactMarkdown
                                    children={props.data.content} 
                                    components={{img: ({node, ...props}) => <img alt="markdown_image" style={{maxWidth: '100%'}}{...props} />}}
                                />
                            case ("image/jpeg;base64"):
                            case ("image/png;base64"):
                                return <img src={props.data.content} alt="post_image" style={{maxWidth:'100%'}}/>
                            default:
                                return <Typography variant="h6" textAlign="left">{props.data.content}</Typography>

                        }
                    })()}
                </Box>
                <Box 
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "10px",
                        margin: "1em 1em",
                    }}
                >
                    <Button
                        style={{
                            width: "100%",
                            padding: "10px 0"
                        }}
                        sx={{
                            borderRadius: "0",
                            ':hover': {
                                backgroundColor: "rgba(25, 118, 210, 0.2)"
                            }
                        }}
                        variant={likeablePost ? "text" : "disabled"}
                        onClick={handleLikeOnClick}
                        endIcon={<ThumbUp />}
                    >
                        {likes}
                    </Button>
                    <Divider orientation="vertical" variant="middle"  sx={{backgroundColor: "rgba(25, 118, 210, 0.2)"}} flexItem/>
                    <Button
                        style={{
                            width: "100%",
                            padding: "10px 0"
                        }}
                        sx={{
                            borderRadius: "0",
                            ':hover': {
                                backgroundColor: "rgba(25, 118, 210, 0.2)"
                            }
                        }}
                        variant="text"
                        onClick={handleOpenShare}
                        endIcon={<Share />}
                    />
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
            <div className="post-comment">
                <TextField
                    id="commentData"
                    onKeyDown={handleEnter}
                    label="Post a comment!"
                    variant="filled"
                    style={{
                        width: "100%",
                        backgroundColor: "#E5E5E5",
                        borderRadius: "0 0 5px 5px",
                    }}
                    sx={{
                        '& .MuiInputLabel-root.Mui-focused': {
                            color: "#e0127c"
                        },
                        '& .MuiFilledInput-root:before': {
                            borderRadius: "0 0 5px 5px!important",
                            borderBottomColor : "transparent"
                        },
                        '& .MuiFilledInput-root:after': {
                            borderRadius: "0 0 5px 5px!important",
                            borderBottom: "1px solid #e0127c"
                        }
                    }}
                />
                {/* Button to post comment (doesn't work but its here) */}
                {/* <span className="post-comment-button-container">
                    <button className="post-comment-button" onClick={handleEnter}>
                        Post
                    </button>
                </span> */}
            </div>
        </Box>
        </>

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

    const [open, setOpen] = useState(false);
    const [alertDetails, setAlertDetails] = useState({
        alertSeverity: 'error',
        errorMessage: 'Failed to update. Please try again'
    })

    useEffect(() => {
        let promises1 = [];
        let promises2 = [];
        const aID = retrieveCurrentAuthor().id.split("/authors/")[1];
        axios.get("/authors/" + aID + "/inbox?type=posts", {
                headers: { Authorization: "Bearer " + getAccessToken() },
            })
            .then((res) => {
                for (let i=res.data.items.length-1; i>=0; i--) {
                    let raID = res.data.items[i].id.split("/authors/")[1].split("/posts/")[0]
                    let pID = res.data.items[i].id.split("/posts/")[1]
                    if (res.data.items[i].source.includes("https://true-friends-404.herokuapp.com")) {
                        promises1.push(RemoteAuthService.getRemotePost("Team 12", raID, pID).then((response) => {
                            promises2.push(updateAndDeletePost(raID, pID, response, res.data.items, i).then())
                        }))
                    }
                    else if (res.data.items[i].source.includes("https://cmput404-team13.herokuapp.com")) {
                        promises1.push(RemoteAuthService.getRemotePost("Team 13", raID, pID).then((response) => {
                            promises2.push(updateAndDeletePost(raID, pID, response, res.data.items, i).then())
                        }))
                    }
                }
                
                Promise.all(promises1).then(() => {
                    Promise.all(promises2).then(() => {
                        setPosts(res.data.items)
                        setLoading(false)
                    })
                })
            })
            .catch((err) => {
                console.log(err);
            })
    }, []);

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
        <Snackbar
            open={open}
            sx={{top: "100px!important"}}
            onClose={handleClose}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            autoHideDuration={2500}
            disableWindowBlurListener={true}
            TransitionComponent={SlideTransition}
            transitionDuration={{enter: 600, exit: 300}}
        >
            <Alert severity={alertDetails.alertSeverity} sx={{fontSize: "16px"}}>
                <AlertTitle sx={{fontSize: "18px"}}>
                    {capitalizeFirstLetter(alertDetails.alertSeverity)}
                </AlertTitle>
                {alertDetails.errorMessage}
            </Alert>
        </Snackbar>
        <Grid container alignContent="center" minHeight={"100%"} flexDirection="column">
            {isLoading ? (
                <ClipLoader color={'#fff'} loading={isLoading} size={150} />
            ) : posts.length === 0 ? (
                <>
                    <PostTextbox posts={posts} setPosts={setPosts}/>
                    <h1>You currently have no posts!</h1>
                </>   
            ) : (
                <>
                    <PostTextbox posts={posts} setPosts={setPosts}/>
                    {posts.map((post) => {
                        if (post.type === "post") {
                            return <Post 
                                        key={post.id}
                                        data={post}
                                        posts={posts}
                                        setPosts={setPosts}
                                        open={open}
                                        setOpen={setOpen}
                                        alertDetails={alertDetails}
                                        setAlertDetails={setAlertDetails}
                                    />;
                        }
                        return <></>
                    })}
                </>
            )}
        </Grid>
        </>
    );
}

export default Stream;
