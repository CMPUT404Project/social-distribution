import { Button, Card, FormControl, MenuItem, Snackbar, TextField } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";

import { getAccessToken, retrieveCurrentAuthor } from "../../utils";

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
        setUnlisted(e.target.value);
    };

    const onFormSubmit = (e) => {
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
        axios.post(`/authors/${aID}/posts`, data, {
                headers: {
                    Authorization: "Bearer " + getAccessToken(),
                    "Content-Type": "application/json",
                },
            })
            // the createdPost.data should be the whole post, which then is sent to the users.
            .then((createdPost) => {
                // first send to current user's inbox
                let postWithAuthor = createdPost.data;
                postWithAuthor["author"] = userJSON;
                axios.post(`/authors/${aID}/inbox`, postWithAuthor, {
                        headers: {
                            Authorization: "Bearer " + getAccessToken(),
                            "Content-Type": "application/json",
                        },
                    })
                    .catch((res) => console.log(res));

                // then to everyone else
                axios.get(`/authors/${aID}/followers`, {
                        headers: {
                            Authorization: "Bearer " + getAccessToken(),
                        }
                    })
                    .then((res) => {
                        let followers = res.data.items;
                        // Team 12 and 13 must be here since they only require 1 call per post.
                        let hostArray = [
                            "https://true-friends-404.herokuapp.com/",
                            "https://cmput404-team13.herokuapp.com/",
                        ];
                        followers.forEach((user) => {
                            let faID = user.id.split("/authors/")[1];

                            // Team 12 implementation
                            if (
                                user.host.includes("https://true-friends-404.herokuapp.com") &&
                                hostArray.find((item) => item.includes("https://true-friends-404.herokuapp.com")) !== undefined
                            ) {
                                // remove team 12 from hostArray since they should only be called once per post in case they have multiple
                                //   users that follow the current user
                                hostArray = hostArray.filter(
                                    (item) => !item.includes("https://true-friends-404.herokuapp.com")
                                );
                                // get jwt token
                                axios.post(
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
                                        let team12Data = createdPost.data;
                                        // author is not required since it is sent with the URI
                                        delete team12Data["author"];
                                        // Do not include categories
                                        // https://discord.com/channels/1042662487025274962/1042662487025274965/1046152315641528380
                                        delete team12Data["categories"];
                                        team12Data.id = team12Data.id.split("/posts/")[1];

                                        axios.post(
                                            `https://true-friends-404.herokuapp.com/authors/${aID}/${sessionStorage.getItem("username")}/posts/`,
                                            team12Data,
                                            {
                                                headers: {
                                                    Authorization: "Bearer " + res.data.access,
                                                    "Content-Type": "application/json",
                                                },
                                            }
                                        );
                                    });
                            }

                            // // Team 13 implementation
                            else if (
                                user.host.includes("https://cmput404-team13.herokuapp.com") &&
                                hostArray.find((item) => item.includes("https://cmput404-team13.herokuapp.com")) !== undefined
                            ) {
                                // clear team13 from hostArray
                                hostArray = hostArray.filter(
                                    (item) => !item.includes("https://cmput404-team13.herokuapp.com")
                                );

                                // if the current user is where the post originated

                                // get jwt token
                                axios.put("https://cmput404-team13.herokuapp.com/users", {
                                        username: process.env.REACT_APP_T13USER,
                                        password: process.env.REACT_APP_T13PASS,
                                    })
                                    .then((res) => {
                                        const jwt = process.env.REACT_APP_T13JWT
                                        let team13data = createdPost.data;
                                        // clean up data of post
                                        delete team13data["categories"];
                                        delete team13data["count"];
                                        team13data.author = { id: aID, displayName: userJSON.displayName };
                                        if (createdPost.data.origin === createdPost.data.id) {
                                            team13data.originalAuthor = {
                                                id: aID,
                                                displayName: userJSON.displayName,
                                            };
                                        }
                                        // get the user info if it is not the current user
                                        
                                        else {
                                            // ex: {source: "http://127.0.0.1:5454/authors/9de11658e/posts/76bd9e"}
                                            // I am assuming that the source I recieve follows this format
                                            // {host}/authors/{aid}/posts/{pid}
                                            let originURL = createdPost.data.origin;
                                            // team13 requires originalAuthor displayName which we have to call the origin's authors server which we might not have access to.
                                            axios.get(originURL, {
                                                    headers: {
                                                        Authorization: "Bearer " + getAccessToken(),
                                                    }
                                                })
                                                .then((res) => {
                                                    team13data.originalAuthor = {
                                                        id: res.data.author.id,
                                                        displayName: res.data.author.displayName,
                                                    };
                                                });
                                        }
                                        // do this after comparing the origin and id
                                        team13data.id = createdPost.data.id.split("/posts/")[1];
                                        
                                        //create post on their server
                                        axios.put(`https://cmput404-team13.herokuapp.com/authors/${aID}/posts`,
                                                team13data,
                                                {
                                                    headers: {
                                                        Authorization: "Bearer " + jwt,
                                                        "Content-Type": "application/json",
                                                    },
                                                }
                                            )
                                            .then((res) => {
                                                //call endpoint depending on visibility for distribution
                                                if (data.visibility.includes("PUBLIC")) {
                                                    axios.post(`https://cmput404-team13.herokuapp.com/inbox/public/${aID}/${team13data.id}`,
                                                            {},
                                                            {
                                                                headers: {
                                                                    Authorization: "Bearer " + jwt,
                                                                    "Content-Type": "application/json",
                                                                },
                                                            }
                                                        )
                                                        .then(() => console.log("PUBLIC POST SUCCESSFUL"));
                                                } else if (data.visibility.includes("FRIEND")) {
                                                    axios.post(`https://cmput404-team13.herokuapp.com/inbox/friends/${aID}/${createdPost.data.id.split("/posts/")[1]}`,
                                                            {},
                                                            {
                                                                headers: {
                                                                    Authorization: "Bearer " + jwt,
                                                                    "Content-Type": "application/json",
                                                                },
                                                            }
                                                        )
                                                        .then(() => console.log("FRIEND POST SUCCESSFUL"));
                                                }
                                            })
                                            .catch((err) => console.log(err));
                                    })
                                    .catch((err) => console.log(err));
                            }

                            // Team 16 - keep condition for consistency for now.
                            else if (
                                user.host.includes("https://social-distribution-404.herokuapp.com") ||
                                user.host.includes("http://127.0.0.1:8000") ||
                                user.host.includes("localhost")
                            ) {
                                // if PUBLIC send to all of current user's followers' inboxes
                                if (data.visibility === "PUBLIC") {
                                    axios.post(`/authors/${faID}/inbox`, createdPost.data, {
                                        headers: {
                                            Authorization: "Bearer " + getAccessToken(),
                                            "Content-Type": "application/json",
                                        },
                                    });
                                }
                                // if FRIEND then check if I follow the follower, if true then send to inbox
                                if (data.visibility.includes("FRIEND")) {
                                    axios.get(`${user.host}/authors/${faID}/followers/${aID}`, {
                                            headers: {
                                                Authorization: "Bearer " + getAccessToken(),
                                            },
                                        })
                                        .then((statusString) => {
                                            // if true, then send. else ignore.
                                            if (statusString.data === true) {
                                                axios.post(`/authors/${faID}/inbox`, createdPost.data, {
                                                    headers: {
                                                        Authorization: "Bearer " + getAccessToken(),
                                                        "Content-Type": "application/json",
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
