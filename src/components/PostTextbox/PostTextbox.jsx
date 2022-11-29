import { Button, Card, FormControl, MenuItem, Snackbar, TextField } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";

import { getAccessToken } from "../../utils";
import AuthService from "../../services/AuthService";

export const PostTextbox = () => {
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
    const [visibilityLogic, setVisibilityLogic] = useState(false);

    const handleVisibilityChange = (e) => {
        setVisibility(e.target.value);
    };

    useEffect(() => {
        if (unlisted === true) {
            setVisibility("PUBLIC");
        }
    }, [unlisted]);

    const handleUnlistedChange = (e) => {
        if (unlisted === true) {
            setVisibilityLogic(false);
        } else {
            setVisibilityLogic(true);
        }
        console.log(e.target.value);
        setUnlisted(e.target.value);
    };

    const onFormSubmit = (e) => {
        let tokens = [];
        if (tags !== "") {
            tokens = tags.split(",").map((word) => word.trim());
        }
        console.log(tokens)
        const data = {
            type: "post",
            title: title,
            content: content,
            visibility: visibility,
            categories: JSON.stringify(tokens),
            description: description,
            contentType: contentType,
            unlisted: unlisted,
            author: JSON.parse(AuthService.retrieveCurrentUser()),
        };
        const userJSON = JSON.parse(AuthService.retrieveCurrentUser());
        const aID = userJSON.id.split("/authors/")[1];
        // create post
        axios
            .post("/authors/" + aID + "/posts", data, {
                headers: {
                    Authorization: "Bearer " + getAccessToken(),
                    ContentType: "application/JSON",
                },
            })
            // the createdPost.data should be the whole post, which then is sent to the users.
            .then((createdPost) => {
                // first send to current user's inbox
                let postWithAuthor = createdPost.data;
                postWithAuthor["author"] = userJSON;
                axios
                    .post("/authors/" + aID + "/inbox", postWithAuthor, {
                        headers: {
                            Authorization: "Bearer " + getAccessToken(),
                            ContentType: "application/JSON",
                        },
                    })
                    .catch((res) => console.log(res));

                // then to everyone else
                axios.get("/authors/" + aID + "/followers").then((res) => {
                    let followers = res.data.items;
                    // console.log(followers)
                    // Team 12 and 13 must be here since they only require 1 call per post.
                    followers.forEach((user) => {
                        let faID = user.id.split("/authors/")[1];
                        if (
                            user.host.includes("https://social-distribution-404.herokuapp.com") ||
                            user.host.includes("http://127.0.0.1:8000") ||
                            user.host.includes("localhost")
                        ) {
                            if (data.visibility === "PUBLIC") {
                                axios.post("/authors/" + faID + "/inbox", createdPost.data, {
                                    headers: {
                                        Authorization: "Bearer " + getAccessToken(),
                                        ContentType: "application/JSON",
                                        // "Access-Control-Allow-Origin": "*",
                                    },
                                });
                            }
                            //
                            if (data.visibility.includes("FRIEND")) {
                                axios.get(user.host + "/authors/" + faID + "/followers/" + aID).then((statusString) => {
                                    // if true, then send. else ignore.
                                    if (statusString.data === true) {
                                        axios.post("/authors/" + faID + "/inbox", createdPost.data, {
                                            headers: {
                                                Authorization: "Bearer " + getAccessToken(),
                                                ContentType: "application/JSON",
                                            },
                                        });
                                    }
                                });
                            }
                        }
                    });
                });
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
                    disabled={visibilityLogic}
                    onChange={handleVisibilityChange}
                >
                    <MenuItem value="PUBLIC">Public</MenuItem>
                    <MenuItem value="FRIENDS">Friends</MenuItem>
                    <MenuItem value="UNLISTED">Unlisted</MenuItem>
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
                <Button variant="contained" sx={{ borderRadius: 0 }} onClick={onFormSubmit}>
                    Send
                </Button>
            </FormControl>
        </Card>
    );
};
