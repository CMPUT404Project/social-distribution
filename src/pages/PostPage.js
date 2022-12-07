import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ClipLoader from 'react-spinners/ClipLoader';

import { 
    Alert, Avatar, AlertTitle, Box, Button, Card, 
    CardHeader, Divider, Grid, IconButton, Link, Menu,
    FormControlLabel, MenuItem, Switch, Slide,
    Snackbar, TextField, Typography
} from "@mui/material";

import AuthService from "../services/AuthService";
import { capitalizeFirstLetter, retrieveCurrentAuthor } from "../utils";
import { Post } from "../components/Stream/Stream";
import NavBar from "../components/NavBar/NavBar";
import RemoteAuthService from "../services/RemoteAuthService";

function SlideTransition(props: SlideProps) {
    return <Slide{...props} direction="down"/>;
}

function PostPage() {
    const {authorID, postID, edit} = useParams();
    const navigate = useNavigate();
    const [isEditState, setEditState] = useState(false);
    const [originalPostValues, setOriginalPostValues] = useState({});
    const [postValues, setPostValues] = useState({});

    const [isLoading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);

    const [alertDetails, setAlertDetails] = useState({
        alertSeverity: 'error',
        errorMessage: 'Failed to update. Please try again'
    })

    const contentTypes = [
        "text/plain",
        "text/markdown",
        "application/base64",
        "image/png;base64",
        "image/jpeg;base64"
    ];


    useEffect(() => {
        const getPostDetails = async () => {
            await AuthService.getPostDetails(authorID, postID).then((data) => {
                setOriginalPostValues(data);
                setPostValues({
                    title: data.title,
                    description: data.description,
                    contentType: data.contentType,
                    content: data.content,
                    categories: data.categories.join(", "),
                    visibility: data.visibility,
                    unlisted: data.unlisted,
                });
                console.log(data)
            })
            setLoading(false);
        }
        getPostDetails();
    }, [])

    useEffect(() => {
        edit ? setEditState(true) : setEditState(false)
    }, [edit])

    const handleInputChange = (prop) => (event) => {
        if (prop === "unlisted") {
            setPostValues({ ...postValues, [prop]: !postValues.unlisted });
        } else {
            setPostValues({ ...postValues, [prop]: event.target.value });
        }
    };

    const handleUpdatePost = async (event) => {
        event.preventDefault();
        let body = {...originalPostValues};
        let promises = [];
        let thing = {...originalPostValues};
        try {
            setLoading(true);
            if (postValues.title) {
                body.title = postValues.title;
            } else {
                throw new Error("emptyTitleError")
            }
            if (postValues.content) {
                body.content = postValues.content;
            } else {
                throw new Error("emptyContentError")
            }
            if (postValues.description !== originalPostValues.description) {
                body.description = postValues.description;
            };
            if (postValues.visibility !== originalPostValues.visibility) {
                body.visibility = postValues.visibility;
            };
            if (postValues.contentType !== originalPostValues.contentType) {
                body.contentType = postValues.contentType;
            };
            let tags = [];
            if (postValues.categories) {
                tags = postValues.categories.split(",").map((tag) => tag.trim());
                body.categories = JSON.stringify(tags)
                thing.categories = tags
            } else {
                body.categories = JSON.stringify([])
                thing.categories = []
            }
            if (postValues.unlisted !== originalPostValues.unlisted) {
                body.unlisted = postValues.unlisted;
            };
            const response = await AuthService.updatePost(authorID, postID, body)
                .then((response) => {
                    if (response.status === 200) {
                        setOriginalPostValues({...body})
                        setAlertDetails({alertSeverity: "success", 
                            errorMessage: "Successfully updated post"})
                            let team12Body = {...body}
                            delete team12Body.categories
                            promises.push(RemoteAuthService.updateRemotePost("Team 12", authorID, postID, team12Body).then())
                            promises.push(RemoteAuthService.updateRemotePost("Team 13", authorID, postID).then())
                    }
                }, error => {
                    return error
                })
            if (response) {
                throw response
            }
            Promise.all(promises).then(() => {
                handleOpen();
                setEditState(false);
                navigate(`/author/${authorID}/post/${postID}`)
            })
        } catch (error) {
            if (error.message === "emptyTitleError") {
                setAlertDetails({alertSeverity: "error", 
                    errorMessage: "The title cannot be empty"})
            } else if (error.message === "emptyContentError") {
                setAlertDetails({alertSeverity: "error",
                    errorMessage: "The content cannot be empty"})
            } else {
                setAlertDetails({alertSeverity: "error", 
                    errorMessage: "Something went wrong. Try again later."})
            }
            handleOpen();
        }
    }
    const handleOpen = () => {
        setLoading(false);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
        <NavBar />
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
        <div className="container" style={isLoading ? {alignItems: "center"} : {alignItems: "flex-start"}}>
            {isLoading ? (
                <ClipLoader color={'#fff'} loading={isLoading} size={150} />
            ) : isEditState ? (
                <Box style={{ display: "flex", flexDirection: "column", width: "70%", paddingBottom: "150px" }}>
                    <Card
                        style={{
                            padding: "1em",
                            margin: "2em 0 0",
                            borderRadius: "10px 10px 10px 10px",
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
                        </Box>
                        <CardHeader
                            style={{marginLeft: "auto", padding: "0"}}
                            avatar={
                                <Avatar alt="user image" src={originalPostValues.author.profileImage} sx={{ width: 70, height: 70 }} style={{ margin: "0 0 0 1ex" }} />
                            }
                            title={
                                <Typography variant="h5">{originalPostValues.author.displayName}</Typography>
                            }
                        />
                        <Box style={{display: "flex", flexDirection: "column", justifyContent: 'center', margin: "1em"}}>
                            <div>Edit Title<span style={{color: "red"}}>*</span></div>
                            <TextField
                                style={{width: "100%", backgroundColor: "#e6e6e6", color: "#000"}}
                                sx={{
                                    '& .MuiOutlinedInput-root.Mui-focused': {
                                        '& > fieldset': {
                                            border : "3px solid #e0127c"
                                        }
                                    }
                                }}
                                InputProps={{sx: {fontSize: '20px', padding: "14px 14px 0 14px"}}}
                                inputProps={{maxLength: 200}}
                                required
                                variant="standard"
                                name="title"
                                placeholder="Post Title"
                                value={postValues.title}
                                onChange={handleInputChange("title")}
                                type="text" 
                            />
                        </Box>
                        <Box style={{display: "flex", flexDirection: "column", justifyContent: 'center', margin: "0 1em 1em 1em"}}>
                            <div>Edit Content<span style={{color: "red"}}>*</span></div>
                            <Box 
                                style={{
                                    border: "2px solid black",
                                    borderRadius: "10px",
                                    padding: "0.5em",
                                }}>
                                <TextField
                                    style={{width: "100%", backgroundColor: "#e6e6e6", color: "#000"}}
                                    sx={{
                                        '& .MuiOutlinedInput-root.Mui-focused': {
                                            '& > fieldset': {
                                                border : "3px solid #e0127c"
                                            }
                                        }
                                    }}
                                    InputProps={{sx: {fontSize: '1.25em'}}}
                                    multiline
                                    maxRows={16}
                                    minRows={4}
                                    variant="outlined"
                                    name="content"
                                    placeholder="Post Content"
                                    value={postValues.content}
                                    onChange={handleInputChange("content")}
                                    type="text" 
                                />
                            </Box>
                        </Box>
                        <Box style={{display: "flex", flexDirection: "column", justifyContent: 'center', margin: "1em"}}>
                            Edit Description
                            <TextField
                                style={{width: "100%", backgroundColor: "#e6e6e6", color: "#000"}}
                                sx={{
                                    '& .MuiOutlinedInput-root.Mui-focused': {
                                        '& > fieldset': {
                                            border : "3px solid #e0127c"
                                        }
                                    }
                                }}
                                InputProps={{sx: {fontSize: '1.25em'}}}
                                inputProps={{maxLength: 200}}
                                required
                                variant="outlined"
                                name="description"
                                placeholder="Post Description"
                                value={postValues.description}
                                onChange={handleInputChange("description")}
                                type="text" 
                            />
                        </Box>
                        <Box style={{display: "flex", flexDirection: "column", justifyContent: 'center', margin: "1em"}}>
                            <TextField
                                select
                                style={{width: "100%", backgroundColor: "#f6f6f6", color: "#000"}}
                                sx={{
                                    '& .MuiOutlinedInput-root.Mui-focused': {
                                        '& > fieldset': {
                                            border : "3px solid #e0127c"
                                        }
                                    }
                                }}
                                InputProps={{sx: {fontSize: '20px'}}}
                                label={"Visibility"}
                                variant="outlined"
                                value={postValues.visibility}
                                onChange={handleInputChange("visibility")}
                            >
                                <MenuItem value="PUBLIC">Public</MenuItem>
                                <MenuItem value="FRIENDS">Friends</MenuItem>
                            </TextField>
                        </Box>
                        <Box style={{display: "flex", flexDirection: "column", justifyContent: 'center', margin: "1em"}}>
                            <TextField
                                select
                                style={{width: "100%", backgroundColor: "#f6f6f6", color: "#000"}}
                                sx={{
                                    '& .MuiOutlinedInput-root.Mui-focused': {
                                        '& > fieldset': {
                                            border : "3px solid #e0127c"
                                        }
                                    }
                                }}
                                InputProps={{sx: {fontSize: '20px'}}}
                                label={"Content type"}
                                variant="outlined"
                                value={postValues.contentType}
                                onChange={handleInputChange("contentType")}
                            >
                                {contentTypes.map((options) => (
                                    <MenuItem key={options} value={options}>
                                        {options}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Box>
                        <Box style={{display: "flex", flexDirection: "column", justifyContent: 'center', margin: "1em 1em 0 1em"}}>
                            Edit Tags
                            <TextField
                                style={{width: "100%", backgroundColor: "#e6e6e6", color: "#000"}}
                                sx={{
                                    '& .MuiOutlinedInput-root.Mui-focused': {
                                        '& > fieldset': {
                                            border : "3px solid #e0127c"
                                        }
                                    }
                                }}
                                InputProps={{sx: {fontSize: '1.25em'}}}
                                inputProps={{maxLength: 200}}
                                required
                                variant="outlined"
                                name="categories"
                                placeholder="Enter tags seperated by commas"
                                value={postValues.categories}
                                onChange={handleInputChange("categories")}
                                type="text" 
                            />
                        </Box>
                        <Box style={{display: "flex", flexDirection: "row", margin: "1em 1em 0 0"}}>
                            <FormControlLabel
                                label="Unlisted"
                                labelPlacement="start"
                                control={
                                    <Switch 
                                        checked={postValues.unlisted}
                                        onChange={handleInputChange("unlisted")}
                                    />
                                }
                            />
                        </Box>
                        <div className="update-profile-btn-container">
                            <button className="update-profile-btn" onClick={handleUpdatePost}>
                                Update
                            </button>
                        </div>
                        <div className="cancel-edit-profile-container">
                            <button className="cancel-edit-profile" onClick={()=>{}}>Cancel</button>
                        </div>
                    </Card>
                </Box>
            ) : (
                <Post data={originalPostValues}/>
            )}
        </div>
        </>
    )
}

export default PostPage;