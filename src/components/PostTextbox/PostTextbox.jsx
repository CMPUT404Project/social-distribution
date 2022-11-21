import {
    Autocomplete,
    Card,
    createFilterOptions,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from "@mui/material";
import React from "react";
import { useState } from "react";

export const PostTextbox = () => {
    const [permission, setPermission] = useState("PUBLIC");
    const [tags, setTags] = useState([]);

    const handlePermissionChange = (e) => {
        setPermission(e.target.value);
    };

    const filterOptions = createFilterOptions({
        trim: true,
        matchFrom: "start",
        stringify: (option) => console.log(option)
    });

    return (
        <Card>
            <FormControl fullWidth>
                {/* <h1>PostTextbox</h1> */}
                {/* <InputLabel id="permissions">testing</InputLabel> */}
                <TextField
                    label="Enter your post here!"
                    variant="filled"
                    multiline
                    style={{ backgroundColor: "#E5E5E5", borderRadius: "5px" }}
                />
                {/* <InputLabel id="permissions">Permission</InputLabel> */}
                <TextField
                    label={"Permission"}
                    select
                    variant="filled"
                    value={permission}
                    onChange={handlePermissionChange}
                >
                    <MenuItem value="PUBLIC">Public</MenuItem>
                    <MenuItem value="FRIENDS">Friends</MenuItem>
                    <MenuItem value="FOLLOWERS">Followers</MenuItem>
                    <MenuItem value="UNLISTED">Unlisted</MenuItem>
                </TextField>
                <Autocomplete
                    multiple
                    freeSolo
                    // value={tags}
                    filterOptions={filterOptions}
                    options={[]}
                    // defaultValue={tags}
                    onChange={(e, currentTags) => {
                        if (e.key === "Enter") {
                            // e.target.value = e.target.value.trim();
                            console.log(e.target.value.trim() === "")
                            if (e.target.value.trim() !== "") {
                                setTags(currentTags);
                                console.log("trim is not null")
                            } else if (e.target.value.trim() === "") {       
                                e.target.value = "";
                                e.defaultMuiPrevented = true;
                            }
                            console.log(currentTags, tags);
                        }
                    }}
                    // onKeyDown={(e) => {
                    //     if (e.target.value.trim() !== "" && e.key === "Enter") {
                    //         e.defaultMuiPrevented = true; 
                    //         console.log("hello")
                    //     }
                    // }}
                    // onInput={(e, currentTags) =>{
                    //     console.log(e)
                    //     setTags(currentTags)
                    // }}
                    // onKeyDown={(e, currentTags) => {
                    //     // && e.target.value.trim() !== ''
                    //     // console.log(e.target.value)
                    //     // console.log(e);

                    //     if (e.key === "Enter") {
                    //         // console.log("hello")
                    //         if (e.target.value.trim() !== "") {
                    //             // console.log(e.target.value.trim() === "")
                    //             // console.log(currentTags)
                    //             setTags(currentTags)
                    //             // console.log(tags);
                    //         } else {
                    //             // in case empty string is entered, then ignore enter key press and reset tag value
                    //             e.defaultMuiPrevented = true;
                    //             e.target.value = "";
                    //         }
                    //     }
                    // }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            variant="filled"
                            label="Press enter to create a tag!"
                        />
                    )}
                />
            </FormControl>
        </Card>
    );
};
