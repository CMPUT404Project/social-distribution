import { Button, Card, CardMedia, FormControl, MenuItem, Snackbar, TextField, IconButton } from "@mui/material";
import { FileUpload } from "@mui/icons-material"
import axios from "axios";
import React, { useEffect, useState } from "react";

import AuthService from "../../services/AuthService";
import RemoteAuthService from "../../services/RemoteAuthService";
import { getAccessToken, retrieveCurrentAuthor } from "../../utils";

export const PostTextbox = (props) => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    // TODO: Get markdown/base64 example to try.
    const [contentType, setContentType] = useState("text/plain");
    const [visibility, setVisibility] = useState("PUBLIC");
    const [tags, setTags] = useState("");
    const [unlisted, setUnlisted] = useState(false);
    const [description, setDescription] = useState("");
    const [open, setOpen] = useState(false);
    const [alert, setAlert] = useState("");
    const [base64file, setbase64file] = useState(null);
    const [imageURL, setimageURL] = useState(null);

    const handleVisibilityChange = (e) => {
        setVisibility(e.target.value);
    };

    useEffect(() => {
        if (unlisted === true) {
            setVisibility("PUBLIC");
        }
    }, [unlisted]);

    const handleUnlistedChange = (e) => {
        setUnlisted(e.target.value);
    };

    const handleFileChange = (e) => {
        getBase64(e.target.files[0]);
        setimageURL(URL.createObjectURL(e.target.files[0]));
    };

    function getBase64(file) {
        console.log(file);
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            setbase64file(reader.result);
            console.log(base64file);
        }
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
    }

    const onFormSubmit = async (e) => {
        let tokens = [];
        if (tags !== "") {
            tokens = tags.split(",").map((word) => word.trim());
        }
        const data = {
            type: "post",
            title: title,
            content: base64file ? base64file : content,
            visibility: visibility,
            categories: JSON.stringify(tokens),
            description: description,
            contentType: contentType,
            unlisted: unlisted,
            author: retrieveCurrentAuthor(),
        };
        console.log(data);
        const userJSON = retrieveCurrentAuthor();
        const aID = userJSON.id.split("/authors/")[1];
        // create post
        const createdPost = await AuthService.createPost(data)
            .then((response) => {
                return response
            })
            .catch(() => setAlert("Could not submit post."))
            .finally(() => {
                setAlert("Post submitted!");
                setTitle("");
                setContent("");
                setVisibility("PUBLIC");
                setTags("");
                setDescription("");
                setContentType("text/plain");
                setUnlisted(false);
                setOpen(true);
                setbase64file(null);
                setimageURL(null);
            });
        if (!createdPost) {
            return;
        }
        props.setPosts([createdPost, ...props.posts]);
        let postWithAuthor = createdPost;
        postWithAuthor["author"] = userJSON;
        // first send to current user's inbox
        await AuthService.sendInboxItem("post", aID, {post:postWithAuthor});
        if (createdPost.unlisted === true) {
            return;
        }
        const allFollowers = await AuthService.getAuthorFollowers();
        // Team 12 and 13 must be here since they only require 1 call per post.
        let hostArray = [
            "https://true-friends-404.herokuapp.com/",
            "https://cmput404-team13.herokuapp.com/",
            "https://team-sixteen.herokuapp.com/",
        ];
        allFollowers.forEach((user) => {
            let faID = user.id.split("/authors/")[1];

            // Team 12 implementation
            if (
                user.host.includes("https://true-friends-404.herokuapp.com") &&
                hostArray.find((item) => item.includes("https://true-friends-404.herokuapp.com")) !==
                    undefined
            ) {
                // remove team 12 from hostArray since they should only be called once per post in case they have multiple
                //   users that follow the current user
                hostArray = hostArray.filter(
                    (item) => !item.includes("https://true-friends-404.herokuapp.com")
                );
                RemoteAuthService.createRemotePost("Team 12", createdPost);
            }
            // // Team 13 implementation
            else if (
                user.host.includes("https://cmput404-team13.herokuapp.com") &&
                hostArray.find((item) => item.includes("https://cmput404-team13.herokuapp.com")) !==
                    undefined
            ) {
                // clear team13 from hostArray
                hostArray = hostArray.filter(
                    (item) => !item.includes("https://cmput404-team13.herokuapp.com")
                );
                RemoteAuthService.createRemotePost("Team 13", createdPost, data.visibility)
            }
            // Team 16 - keep condition for consistency for now.
            else if (
                user.host.includes("https://team-sixteen.herokuapp.com/") &&
                hostArray.find((item) => item.includes("https://team-sixteen.herokuapp.com/")) !==
                    undefined
            ) {
                // clear team13 from hostArray
                hostArray = hostArray.filter(
                    (item) => !item.includes("https://team-sixteen.herokuapp.com/")
                );
                RemoteAuthService.createRemotePost("Team 16", createdPost)
            }
            else if (
                user.host.includes("https://social-distribution-404.herokuapp.com") ||
                user.host.includes("http://127.0.0.1:8000") ||
                user.host.includes("localhost")
            ) {
                // if PUBLIC send to all of current user's followers' inboxes
                if (data.visibility === "PUBLIC") {
                    AuthService.sendInboxItem("post", faID, {post:createdPost});
                }
                // if FRIEND then check if I follow the follower, if true then send to inbox
                if (data.visibility.includes("FRIEND")) {
                    AuthService.getFollowStatus(aID, faID).then((response) => {
                        if (response) {
                            AuthService.sendInboxItem("post", faID, {post:createdPost});
                        }
                    });
                }
            }
        });
    };

    const handleContentTypeChange = (e) => {
        setContentType(e.target.value);
        console.log(contentType);
    };

    function isFileUploadPost(){
        return (contentType === contentTypes[2]) || (contentType === contentTypes[3]) || (contentType === contentTypes[4])
    }

    const contentTypes = ["text/plain", "text/markdown", "image/png;base64", "image/jpeg;base64"];

    return (
        <Card style={{height:"auto"}}>
            <Snackbar
                open={open}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                autoHideDuration={3000}
                onClose={() => setOpen(false)}
                message={alert}
            />
            <FormControl fullWidth>
                <TextField
                    label="Enter your title here! (required)"
                    variant="filled"
                    value={title}
                    multiline
                    style={{ borderRadius: "5px" }}
                    onInput={(e) => setTitle(e.target.value)}
                    required
                />
                {isFileUploadPost() ?
                    (
                        <>
                        <CardMedia 
                            component="img" 
                            image={imageURL} 
                            alt={"File Preview"}
                            sx={{
                                display: "flex", 
                                minHeight: "150px",
                                maxHeight: "300px",
                                alignItems: "center", 
                                justifyContent: "center", 
                                objectFit: "contain"
                            }}
                        />
                        <Button variant="text" component="label" endIcon={<FileUpload />} 
                            sx={{
                                borderTop: "1px solid black", 
                                borderRadius: "0",
                                ':hover': {
                                    backgroundColor: "rgba(25, 118, 210, 0.2)"
                                }
                            }}>
                            Upload image
                            <input hidden accept="image/*" type="file" onChange={handleFileChange}/>
                        </Button>
                        </>
                    ) : (
                        <TextField
                            label="Enter your main text here! (required)"
                            variant="filled"
                            value={content}
                            multiline
                            onInput={(e) => setContent(e.target.value)}
                            required
                        />)
                }
                <TextField
                    label="Enter your description here!"
                    variant="filled"
                    value={description}
                    multiline
                    onInput={(e) => setDescription(e.target.value)}
                />
                <TextField
                    label={"Should this post be unlisted?"}
                    select
                    variant="filled"
                    value={unlisted}
                    // defaultValue={unlisted}
                    onChange={handleUnlistedChange}
                    // onSelect={handleUnlistedChange}
                >
                    <MenuItem value={true}>Yes</MenuItem>
                    <MenuItem value={false}>No</MenuItem>
                </TextField>
                <TextField
                    label={"Visibility"}
                    select
                    variant="filled"
                    value={visibility}
                    onChange={handleVisibilityChange}
                >
                    <MenuItem value="PUBLIC">Public</MenuItem>
                    <MenuItem value="FRIENDS">Friends</MenuItem>
                    {/* <MenuItem value="UNLISTED">Unlisted</MenuItem> */}
                </TextField>

                <TextField
                    label="Content type?"
                    select
                    variant="filled"
                    defaultValue={contentTypes[0]}
                    value={contentType}
                    onChange={handleContentTypeChange}
                >
                    {contentTypes.map((options) => (
                        <MenuItem key={options} value={options}>
                            {options}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    label={"Enter tags seperated by commas!"}
                    variant="filled"
                    value={tags}
                    // defaultValue={tags}
                    onInput={(e) => setTags(e.target.value)}
                >
                    <MenuItem value={true}>Yes</MenuItem>
                    <MenuItem value={false}>No</MenuItem>
                </TextField>
                <Button variant="contained" sx={{ borderRadius: 0, padding: 1.7 }} onClick={onFormSubmit}>
                    Distribute
                </Button>
            </FormControl>
        </Card>
    );
};
