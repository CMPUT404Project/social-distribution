import { Button, Card, FormControl, MenuItem, Snackbar, TextField } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import AuthService from "../../services/AuthService";

export const PostTextbox = () => {
    const [title, setTitle] = useState("");
    const [source, setSource] = useState("");
    const [origin, setOrigin] = useState("");
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

    // TODO: trim only works for frontend viewing, not for the backend array. Somehow trim category before it enters array?
    // const filterOptions = createFilterOptions({
    //     trim: true,
    // });

    const handleUnlistedChange = (e) => {
        if (unlisted === true) {
            setVisibilityLogic(false);
        } else {
            setVisibilityLogic(true);
        }
        setUnlisted(e.target.value);
    };

    // https://stackoverflow.com/a/18593669
    const validateURL = (str) => {
        // console.log(AuthService.retrieveCurrentUser())
        return (
            /^(http|https):\/\/(([a-zA-Z0-9$\-_.+!*'(),;:&=]|%[0-9a-fA-F]{2})+@)?(((25[0-5]|2[0-4][0-9]|[0-1][0-9][0-9]|[1-9][0-9]|[0-9])(\.(25[0-5]|2[0-4][0-9]|[0-1][0-9][0-9]|[1-9][0-9]|[0-9])){3})|localhost|([a-zA-Z0-9\-\u00C0-\u017F]+\.)+([a-zA-Z]{2,}))(:[0-9]+)?(\/(([a-zA-Z0-9$\-_.+!*'(),;:@&=]|%[0-9a-fA-F]{2})*(\/([a-zA-Z0-9$\-_.+!*'(),;:@&=]|%[0-9a-fA-F]{2})*)*)?(\?([a-zA-Z0-9$\-_.+!*'(),;:@&=\/?]|%[0-9a-fA-F]{2})*)?(\#([a-zA-Z0-9$\-_.+!*'(),;:@&=\/?]|%[0-9a-fA-F]{2})*)?)?$/.test(
                str
            ) || str === ""
        );
    };

    // if visibility is friends then make a
    //     GET [local, remote]: get a list of authors who are AUTHOR_ID’s followers -> [users]
    //          for each from item in users ->
    // GET [local, remote] check if FOREIGN_AUTHOR_ID is a follower of AUTHOR_ID

    // const FriendsPostRequest = (data) => {
    //     const aID = JSON.parse(AuthService.retrieveCurrentUser()).id.split(
    //         "/authors/"
    //     )[1];
    //     axios
    //         .get("/service/authors/" + aID + "/followers", {
    //             headers: {
    //                 Authorization: "Bearer " + AuthService.getAccessToken(),
    //                 // contenttype???
    //             },
    //         })
    //         .then((res) => {
    //             const followers = res.items;
    //             followers.forEach((user) => {
    //                 let fID = user.id.split("/authors/")[1];

    //                 axios.post(
    //                     "/service/authors/" + fID + "/inbox/post",
    //                     data,
    //                     {
    //                         headers: {
    //                             Authorization:
    //                                 "Bearer " + AuthService.getAccessToken(),
    //                             // contenttype???
    //                         },
    //                     }
    //                 );
    //             });
    //         })
    //         .catch((res) => console.log(res));
    // };

    const onFormSubmit = (e) => {
        // console.log(
        //     title,
        //     source,
        //     origin,
        //     content,
        //     visibility,
        //     tags,
        //     description,
        //     contentType,
        //     unlisted
        // );
        let tokens = [];
        if (tags !== "") {
            tokens = tags.split(",").map((word) => word.trim());
        }
        const data = {
            type: "post",
            title: title,
            source: source,
            origin: origin,
            content: content,
            visibility: visibility,
            categories: tokens,
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
                    Authorization: "Bearer " + AuthService.getAccessToken(),
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
                            Authorization: "Bearer " + AuthService.getAccessToken(),
                            ContentType: "application/JSON",
                        },
                    })
                    .catch((res) => console.log(res));

                // then to everyone else
                axios.get("/authors/" + aID + "/followers").then((res) => {
                    let followers = res.data.items;
                    // Team 12 and 13 must be here since they only require 1 call per post.
                    let hostArray = [
                        "https://true-friends-404.herokuapp.com/",
                        "https://cmput404-team13.herokuapp.com/",
                    ];
                    // console.log(res)
                    followers.forEach((user) => {
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
                            // console.log(process.env.REACT_APP_T12USER, typeof(process.env.REACT_APP_T12USER))
                            // console.log(process.env.REACT_APP_T12PASS, typeof(process.env.REACT_APP_T12PASS))
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
                                    let team12Data = createdPost.data;
                                    // author is not required since it is sent with the URI
                                    delete team12Data["author"];
                                    // Do not include categories
                                    // https://discord.com/channels/1042662487025274962/1042662487025274965/1046152315641528380
                                    delete team12Data["categories"];
                                    team12Data.id = team12Data.id.split("/posts/")[1]

                                    axios.post(
                                        "https://true-friends-404.herokuapp.com/authors/" +
                                            aID +
                                            "/" +
                                            sessionStorage.getItem("username") +
                                            "/posts/",
                                            team12Data
                                        ,
                                        {
                                            headers: {
                                                "Authorization": "Bearer " + res.data.access,
                                                "Content-Type": "application/json",
                                            },
                                        }
                                    );
                                });
                        }

                        // // Team 13 implementation
                        if (
                            user.host.includes("https://cmput404-team13.herokuapp.com") &&
                            hostArray.find((item) => item.includes("https://cmput404-team13.herokuapp.com")) !==
                                undefined
                        ) {
                            // clear team13 from hostArray
                            hostArray = hostArray.filter(
                                (item) => !item.includes("https://cmput404-team13.herokuapp.com")
                            );

                            // if the current user is where the post originated

                            // get jwt token
                            axios
                                .put("https://cmput404-team13.herokuapp.com/users", {
                                    username: process.env.REACT_APP_T13USER,
                                    password: process.env.REACT_APP_T13PASS,
                                })
                                .then((res) => {
                                    const jwt = res.data.jwt;
                                    let team13data = createdPost.data;
                                    // clean up data of post
                                    delete team13data["categories"];
                                    delete team13data["count"];
                                    team13data.author = { id: aID, displayName: userJSON.displayName };
                                    team13data.Id = createdPost.data.id.split("/posts/")[1];
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
                                        axios
                                            .get(
                                                originURL
                                                // sourceURL.split("/authors/")[0] +
                                                //     "/authors/" +
                                                //     sourceURL.split("/authors/")[1].split("/posts/")[1]
                                            )
                                            .then((res) => {
                                                team13data.originalAuthor = {
                                                    id: res.data.author.id,
                                                    displayName: res.data.author.displayName,
                                                };
                                            });
                                    }

                                    //create post on their server
                                    axios
                                        .put(
                                            "https://cmput404-team13.herokuapp.com/authors/" + aID + "/posts",
                                            team13data,
                                            {
                                                headers: {
                                                    authorization: "Bearer " + jwt,
                                                    "content-type": "application/json",
                                                },
                                            }
                                        )
                                        .then((res) => {
                                            //call endpoint depending on visibility for distribution
                                            if (data.visibility.includes("PUBLIC")) {
                                                axios
                                                    .post(
                                                        "https://cmput404-team13.herokuapp.com/inbox/public/" +
                                                            aID +
                                                            "/" +
                                                            createdPost.data.id.split("/posts/")[1],
                                                        {},
                                                        {
                                                            headers: {
                                                                authorization: "Bearer " + jwt,
                                                                "content-type": "application/json",
                                                            },
                                                        }
                                                    )
                                                    .then(() => console.log("PUBLIC POST SUCCESSFUL"));
                                            } else if (data.visibility.includes("FRIEND")) {
                                                axios
                                                    .post(
                                                        "https://cmput404-team13.herokuapp.com/inbox/friends/" +
                                                            aID +
                                                            "/" +
                                                            createdPost.data.id.split("/posts/")[1],
                                                        {},
                                                        {
                                                            headers: {
                                                                authorization: "Bearer " + jwt,
                                                                "content-type": "application/json",
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
                        //  this should be default behaviour when implemented to spec.
                        // else if (user.host === "https://social-distribution-404.herokuapp.com/") {
                        //     if (data.visibility === "PUBLIC") {
                        //         axios.post("/authors/" + faID + "/inbox/posts", createdPost.data, {
                        //             headers: {
                        //                 Authorization: "Bearer " + AuthService.getAccessToken(),
                        //                 ContentType: "application/JSON",
                        //                 // "Access-Control-Allow-Origin": "*",
                        //             },
                        //         });
                        //     }
                        //     //
                        //     if (data.visibility.includes("FRIEND")) {
                        //         axios.get(user.host + "/authors/" + faID + "/followers/" + aID).then((statusString) => {
                        //             // if true, then send. else ignore.
                        //             if (statusString.data === true) {
                        //                 axios.post("/authors/" + faID + "/inbox/posts", createdPost.data, {
                        //                     headers: {
                        //                         Authorization: "Bearer " + AuthService.getAccessToken(),
                        //                         ContentType: "application/JSON",
                        //                     },
                        //                 });
                        //             }
                        //         });
                        //     }
                        // }
                    });
                });
            })
            .catch(() => setAlert("Could not submit post."))
            .finally(() => {
                setAlert("Post submitted!");
                setTitle("");
                setSource("");
                setOrigin("");
                setContent("");
                setVisibility("PUBLIC");
                setTags("");
                setDescription("");
                setContentType("text/plain");
                setUnlisted(false);
                setOpen(true);
            });
    };

    const onSourceChange = (e) => {
        setSource(e.target.value);
    };

    const onOriginChange = (e) => {
        setOrigin(e.target.value);
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
                {/* <InputLabel id="permissions">Permission</InputLabel> */}
                {/* TODO: Are source and origin optional? */}
                <TextField label="Source" variant="filled" onInput={onSourceChange} error={!validateURL(source)} />
                <TextField label="Origin" variant="filled" onInput={onOriginChange} error={!validateURL(origin)} />
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

                {/* <Autocomplete
                    multiple
                    freeSolo
                    filterOptions={filterOptions}
                    options={[]}
                    value={tags || []}
                    // TODO: Tags in the empty can be white spaces BUT SHOULD NOT BE ABLE TO, for some reason my condition does not work, something to do with e.defaultMuiPrevented IMO or String.trim()
                    onChange={(e, currentTags) => {
                        if (e.key === "Enter") {
                            if (e.target.value.trim() !== "") {
                                setTags(currentTags);
                            } else if (e.target.value.trim() === "") {
                                e.target.value = "";
                                e.defaultMuiPrevented = true;
                            }
                            // console.log(currentTags, tags);
                        }
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            variant="filled"
                            label="Press enter to create a tag!"
                        />
                    )}
                /> */}
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
