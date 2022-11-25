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
        console.log(e.target.value);
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
        axios
            .post("/authors/" + aID + "/posts", data, {
                headers: {
                    Authorization: "Bearer " + AuthService.getAccessToken(),
                    ContentType: "application/JSON",
                },
            })
            // the response should be the whole post, which then is sent to the users.
            .then((createdPost) => {
                // first send to current user's inbox
                let postWithAuthor = createdPost.data;
                postWithAuthor["author"] = userJSON;
                console.log(postWithAuthor);
                axios
                    .post("/authors/" + aID + "/inbox/posts", postWithAuthor, {
                        headers: {
                            Authorization: "Bearer " + AuthService.getAccessToken(),
                            ContentType: "application/JSON",
                        },
                    })
                    .catch((res) => console.log(postWithAuthor));
                // then to everyone else
                axios.get("/authors/" + aID + "/followers").then((res) => {
                    let followers = res.items;
                    followers.forEach((user) => {
                        let faID = user.id.split("/authors/")[1];
                        // since team 12 is dealing with the posts' visibility and distribution themselves, all I have to do is send the post
                        // if (user.host === "https://true-friends-404.herokuapp.com") {
                        //     axios
                        //         .post(
                        //             "https://true-friends-404.herokuapp.com/api/token/obtain/",
                        //             {
                        //                 email: "team19@mail.com",
                        //                 Password: "team19",
                        //             },
                        //             {
                        //                 headers: {
                        //                     ContentType: "application/json",
                        //                 },
                        //             }
                        //         )
                        //         .then((res) => {
                        //             // not sure how to response is suppose to look like
                        //             let team12AccessToken = res.data.accessToken;
                        //             team12Data = createdPost;
                        //             // author is just UUID for them not the whole author object
                        //             team12Data["author"] = aID;

                        //             // Since Team 12 does the inbox distribution on their end, we only need this call.
                        //             axios.post(
                        //                 "/authors/" + aID + "/" + sessionStorage.getItem("username") + "/posts/",
                        //                 data,
                        //                 {
                        //                     headers: {
                        //                         Authorization: team12AccessToken,
                        //                         ContentType: "application/json",
                        //                     },
                        //                 }
                        //             );
                        //         });
                        // }

                        if (data.visibility === "PUBLIC") {
                            if (user.host === "https://social-distribution-404.herokuapp.com") {
                                axios.post("/authors/" + faID + "/inbox/posts", createdPost, {
                                    headers: {
                                        Authorization: "Bearer " + AuthService.getAccessToken(),
                                        ContentType: "application/JSON",
                                    },
                                });
                            }

                            // Team 12
                            //  Implemeted above since they do not care if PUBLIC or PRIVATE is sent.

                            // Team 13
                            else if (user.host === "https://cmput404-team13.herokuapp.com") {
                                //pass for now, waiting for response from discord
                            }
                        }
                        if (data.visibility === "FRIEND") {
                            axios.get(user.host + "/authors/" + faID + "/followers/" + aID).then((statusString) => {
                                if (statusString.toLowerCase().includes("true")) {
                                    if (user.host === "https://social-distribution-404.herokuapp.com") {
                                        axios.post("/authors/" + faID + "/inbox/posts", createdPost, {
                                            headers: {
                                                Authorization: "Bearer " + AuthService.getAccessToken(),
                                                ContentType: "application/JSON",
                                            },
                                        });
                                    }

                                    // Team 12
                                    //  Implemeted above since they do not care if PUBLIC or PRIVATE is sent.

                                    // Team 13

                                    else if (user.host === "https://cmput404-team13.herokuapp.com") {
                                        // let data13 = data
                                        // data13["published"] = Date()
                                        // url = user.host + "/authors/" + faID + "/inbox/" + createdPost.id.split("/posts/")[1]
                                        // axios.post
                                    }
                                }
                            });
                            // axios.get("/authors/" + faID + "/followers/" + aID)
                        }
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
                setTags([]);
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
