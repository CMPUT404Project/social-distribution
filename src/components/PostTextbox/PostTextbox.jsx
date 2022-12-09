import { Button, Card, FormControl, MenuItem, Snackbar, TextField } from "@mui/material";
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

    const onFormSubmit = async (e) => {
        let tokens = [];
        if (tags !== "") {
            tokens = tags.split(",").map((word) => word.trim());
        }
        const data = {
            type: "post",
            title: title,
            content: content,
            visibility: visibility,
            categories: JSON.stringify(tokens),
            description: description,
            contentType: contentType,
            unlisted: unlisted,
            author: retrieveCurrentAuthor(),
        };
        const userJSON = retrieveCurrentAuthor();
        const aID = userJSON.id.split("/authors/")[1];
        // create post
        const createdPost = await AuthService.createPost(data)
            .then((response) => {
                return response
            })
        console.log("response")
        console.log(createdPost)
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
                let team12Data = JSON.parse(JSON.stringify(createdPost));
                // author is not required since it is sent with the URI
                delete team12Data["author"];
                // Do not include categories
                // https://discord.com/channels/1042662487025274962/1042662487025274965/1046152315641528380
                delete team12Data["categories"];
                team12Data.id = team12Data.id.split("/posts/")[1];
                RemoteAuthService.createRemotePost("Team 12", team12Data);
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
                let team13data = JSON.parse(JSON.stringify(createdPost));
                // clean up data of post
                delete team13data["categories"];
                delete team13data["count"];
                team13data.author = { id: aID, displayName: userJSON.displayName };
                team13data.originalAuthor = { id: aID, displayName: userJSON.displayName };
                team13data.id = createdPost.id.split("/posts/")[1];
                console.log(team13data)
                console.log("team13data")
                // team13data.originalAuthor = {
                //     id: aID,
                //     displayName: userJSON.displayName,
                // };
                // get the user info if it is not the current user
                // if (createdPost.origin !== createdPost.id) {
                // ex: {source: "http://127.0.0.1:5454/authors/9de11658e/posts/76bd9e"}
                // I am assuming that the source I recieve follows this format
                // {host}/authors/{aid}/posts/{pid}
                // team13 requires originalAuthor displayName which we have to call the origin's authors server which we might not have access to.
                // TODO: this call is irrelevant because originalAuthor will always be us for this component/scenario.
                // axios
                //     .get(createdPost.origin, {
                //         headers: {
                //             Authorization: "Bearer " + getAccessToken(),
                //         },
                //     })
                //     .then((res) => {
                //         team13data.originalAuthor = {
                //             id: res.data.author.id,
                //             displayName: res.data.author.displayName,
                //         };
                RemoteAuthService.createRemotePost("Team 13", team13data, data.visibility)
            }

            // Team 16 - keep condition for consistency for now.
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
    };

    const contentTypes = ["text/plain", "text/markdown", "application/base64", "image/png;base64", "image/jpeg;base64"];

    return (
        <Card>
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
                <TextField
                    label="Enter your main text here! (required)"
                    variant="filled"
                    value={content}
                    multiline
                    onInput={(e) => setContent(e.target.value)}
                    required
                />
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
