import {
    Alert,
    Autocomplete,
    Button,
    Card,
    createFilterOptions,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Snackbar,
    TextField,
} from "@mui/material";
import axios from "axios";
import React from "react";
import { useState } from "react";
import AuthService from "../../services/AuthService";

export const PostTextbox = () => {
    const [title, setTitle] = useState("");
    const [source, setSource] = useState("");
    const [origin, setOrigin] = useState("");
    const [content, setContent] = useState("");
    // TODO: Get markdown/base64 example to try.
    const [contentType, setContentType] = useState("text/plain");
    const [visibility, setVisibility] = useState("PUBLIC");
    const [tags, setTags] = useState([]);
    const [unlisted, setUnlisted] = useState(false);
    const [description, setDescription] = useState("");
    const [open, setOpen] = useState(false);
    const [alert, setAlert] = useState("");

    const handleVisibilityChange = (e) => {
        setVisibility(e.target.value);
    };

    // TODO: trim only works for frontend viewing, not for the backend array. Somehow trim category before it enters array?
    const filterOptions = createFilterOptions({
        trim: true,
    });

    const handleUnlistedChange = (e) => {
        setUnlisted(!unlisted);
    };

    // https://stackoverflow.com/a/18593669
    const validateURL = (str) => {
        // console.log(/^(http|https):\/\/(([a-zA-Z0-9$\-_.+!*'(),;:&=]|%[0-9a-fA-F]{2})+@)?(((25[0-5]|2[0-4][0-9]|[0-1][0-9][0-9]|[1-9][0-9]|[0-9])(\.(25[0-5]|2[0-4][0-9]|[0-1][0-9][0-9]|[1-9][0-9]|[0-9])){3})|localhost|([a-zA-Z0-9\-\u00C0-\u017F]+\.)+([a-zA-Z]{2,}))(:[0-9]+)?(\/(([a-zA-Z0-9$\-_.+!*'(),;:@&=]|%[0-9a-fA-F]{2})*(\/([a-zA-Z0-9$\-_.+!*'(),;:@&=]|%[0-9a-fA-F]{2})*)*)?(\?([a-zA-Z0-9$\-_.+!*'(),;:@&=\/?]|%[0-9a-fA-F]{2})*)?(\#([a-zA-Z0-9$\-_.+!*'(),;:@&=\/?]|%[0-9a-fA-F]{2})*)?)?$/.test(
        //     str
        //  || str === ""))
        return (
            /^(http|https):\/\/(([a-zA-Z0-9$\-_.+!*'(),;:&=]|%[0-9a-fA-F]{2})+@)?(((25[0-5]|2[0-4][0-9]|[0-1][0-9][0-9]|[1-9][0-9]|[0-9])(\.(25[0-5]|2[0-4][0-9]|[0-1][0-9][0-9]|[1-9][0-9]|[0-9])){3})|localhost|([a-zA-Z0-9\-\u00C0-\u017F]+\.)+([a-zA-Z]{2,}))(:[0-9]+)?(\/(([a-zA-Z0-9$\-_.+!*'(),;:@&=]|%[0-9a-fA-F]{2})*(\/([a-zA-Z0-9$\-_.+!*'(),;:@&=]|%[0-9a-fA-F]{2})*)*)?(\?([a-zA-Z0-9$\-_.+!*'(),;:@&=\/?]|%[0-9a-fA-F]{2})*)?(\#([a-zA-Z0-9$\-_.+!*'(),;:@&=\/?]|%[0-9a-fA-F]{2})*)?)?$/.test(
                str
            ) || str === ""
        );
    };

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
        if (tags !== ""){
            tags.split(",").map((word) => word.trim())
        }
        console.log(tags)


        const data = {
            title: title,
            source: source,
            origin: origin,
            content: content,
            visibility: visibility,
            categories: tags.split(","),
            description: description,
            contentType: contentType,
            unlisted: unlisted,
        };
        // console.log(data);
        const aID = JSON.parse(AuthService.retrieveCurrentUser()).id.split(
            "/authors/"
        )[1];
        axios
            .post("/authors/" + aID + "/posts", data, {
                headers: {
                    Authorization: "Bearer " + AuthService.getAccessToken(),
                    ContentType: "application/JSON",
                },
            })
            .then(() => {
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
            })
            .catch(() => setAlert("Could not submit post."))
            .finally(() => setOpen(true));
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

    const contentTypes = [
        "text/plain",
        "text/markdown",
        "application/base64",
        "image/png;base64",
        "image/jpeg;base64",
    ];

    return (
        <Card>
            <Snackbar
                open={open}
                autoHideDuration={1000}
                onClose={() => setOpen(false)}
                message={alert}
            />
            <FormControl fullWidth onSubmit={(data) => console.log(data)}>
                <TextField
                    label="Enter your title here! (required)"
                    variant="filled"
                    value={title}
                    multiline
                    style={{ backgroundColor: "#E5E5E5", borderRadius: "5px" }}
                    onInput={(e) => setTitle(e.target.value)}
                    required
                />
                <TextField
                    label="Enter your description here!"
                    variant="filled"
                    value={description}
                    multiline
                    style={{ backgroundColor: "#E5E5E5", borderRadius: "5px" }}
                    onInput={(e) => setDescription(e.target.value)}
                />
                <TextField
                    label="Enter your main text here! (required)"
                    variant="filled"
                    value={content}
                    multiline
                    style={{ backgroundColor: "#E5E5E5", borderRadius: "5px" }}
                    onInput={(e) => setContent(e.target.value)}
                    required
                />
                {/* <InputLabel id="permissions">Permission</InputLabel> */}
                {/* TODO: Are source and origin optional? */}
                <TextField
                    label="Source"
                    variant="filled"
                    onInput={onSourceChange}
                    error={!validateURL(source)}
                />
                <TextField
                    label="Origin"
                    variant="filled"
                    onInput={onOriginChange}
                    error={!validateURL(origin)}
                />
                <TextField
                    label={"Visibility"}
                    select
                    variant="filled"
                    value={visibility}
                    onChange={handleVisibilityChange}
                >
                    <MenuItem value="PUBLIC">Public</MenuItem>
                    <MenuItem value="FRIENDS">Friends</MenuItem>
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
                    label={"Should this post be unlisted?"}
                    select
                    variant="filled"
                    value={unlisted}
                    defaultValue={unlisted}
                    onChange={handleUnlistedChange}
                >
                    <MenuItem value={true}>Yes</MenuItem>
                    <MenuItem value={false}>No</MenuItem>
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
                    defaultValue={tags}
                    onInput={(e) => setTags(e.target.value)}
                >
                    <MenuItem value={true}>Yes</MenuItem>
                    <MenuItem value={false}>No</MenuItem>
                </TextField>
                <Button variant="contained" sx={{borderRadius:0}} onClick={onFormSubmit}>
                    Send
                </Button>
            </FormControl>
        </Card>
    );
};
