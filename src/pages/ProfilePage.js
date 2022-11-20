import { useState } from "react";
import ClipLoader from 'react-spinners/ClipLoader';

import { 
    regexPatterns, 
    doesImageExist, 
    capitalizeFirstLetter,
    SlideTransition
} from "../utils";
import AuthService from "../services/AuthService";
import NavBar from "../components/NavBar/NavBar";

// Import Material UI Components
import {
    Alert, 
    AlertTitle,
    Avatar,
    TextField,
    Snackbar  
} from '@mui/material';

function ProfilePage() {
    const [defaultAuthor, setDefaultAuthor] = useState(JSON.parse(AuthService.retrieveCurrentUser()));
    const [authorValues, setAuthorValues] = useState({
        displayName: defaultAuthor.displayName || "",
        github: defaultAuthor.github.split(".com/")[1] || "",
        profileImage: defaultAuthor.profileImage || "",
    })

    const [editState, setEditState] = useState(false)

    const [isLoading, setLoading] = useState(false);

    const [open, setOpen] = useState(false);

    const [alertDetails, setAlertDetails] = useState({
        alertSeverity: 'error',
        errorMessage: 'Failed to update. Please try again'
    })

    const handleInputChange = (prop) => (event) => {
        setAuthorValues({ ...authorValues, [prop]: event.target.value });
    };

    const handleEditButton = (prop) => () => {
        if (prop === "Cancel") {
            setAuthorValues({
                displayName: defaultAuthor.displayName || "",
                github: defaultAuthor.github.split(".com/")[1] || "",
                profileImage: defaultAuthor.profileImage || "",
            })
        }
        setEditState(!editState);
    }

    const handleUpdateProfile = async (event) => {
        event.preventDefault();
        let body = {};
        try {
            setLoading(true);
            var imageError = false;
            if (authorValues.displayName !== defaultAuthor.displayName) {
                if (!regexPatterns.namePattern.test(authorValues.displayName)) {
                    throw new Error("displayNameError")
                } else {
                    body.displayName = authorValues.displayName;
                };
            };
            let defaultGit = defaultAuthor.github.split(".com/")[1] ? defaultAuthor.github.split(".com/")[1] : "";
            if (authorValues.github !== defaultGit) {
                if (authorValues.github) {
                    if (!regexPatterns.gitPattern.test(authorValues.github)) {
                        throw new Error("gitError")
                    } else {
                        body.github = "https://www.github.com/" + authorValues.github.toLowerCase();
                    }
                } else {
                    body.github = "";
                }
            };
            if (authorValues.profileImage !== defaultAuthor.profileImage) {
                if (authorValues.profileImage) {
                    await doesImageExist(authorValues.profileImage).then((value) => {
                        if (!value) { imageError = true };
                    });
                    if (imageError) {
                        throw new Error("imageError")
                    } else {
                        body.profileImage = authorValues.profileImage;
                    };
                } else {
                    body.profileImage = "";
                }
            };
            console.log(body)
            if (Object.keys(body).length !== 0) {
                const response = await AuthService.updateUserDetails(body)
                .then(() => {
                    console.log("HELLO")
                    setDefaultAuthor(JSON.parse(AuthService.retrieveCurrentUser()));
                    setAlertDetails({
                        alertSeverity: "success",
                        errorMessage: "Successfully updated profile"
                    })
                    handleOpen();
                    setEditState(false);
                }, error => {
                    return error
                })
                if (response) {
                    throw response
                }
            } else {
                setAlertDetails({
                    alertSeverity: "warning",
                    errorMessage: "Nothing was changed"
                })
                handleOpen();
            }
        } catch (error) {
            console.log(error)
            if (error.message === "displayNameError") {
                setAlertDetails({
                    alertSeverity: "error",
                    errorMessage: "Display name can only contain letters and numbers"
                })
            } else if (error.message === "gitError") {
                setAlertDetails({
                    alertSeverity: "error",
                    errorMessage: "Invalid Git usernames"
                })
            } else if (error.message === "imageError") {
                setAlertDetails({
                    alertSeverity: "error",
                    errorMessage: "Image could not be loaded"
                })
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
        {isLoading ? (
            <div className="container" style={{alignItems: "flex-start"}}>
                <ClipLoader color={'#fff'} loading={isLoading} size={150} />
            </div>
        ) : (
            <>
            <NavBar />
            <Snackbar
                open={open}
                sx={{top: "100px!important"}}
                onClose={handleClose}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                autoHideDuration={5000}
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
            <div className="container" style={{alignItems: "flex-start"}}>
                <div className="profile-details-card">
                    <span className="profile-title">
                        Profile
                    </span>
                    <Avatar 
                        src={authorValues.profileImage}
                        sx={{width: 150, height: 150, margin: "auto", border: "2px solid black"}}
                    />
                    <div className="edit-container">
                            <div className="edit-field-label">
                                Image
                            </div>
                            <div className="edit-container">
                                <div className="edit-field">
                                    <TextField
                                        style={{width: "100%", backgroundColor: "#e6e6e6"}}
                                        sx={{
                                            '& legend': {display: 'none'},
                                            '& fieldset': {top: 0},
                                            '& .MuiOutlinedInput-root.Mui-focused': {
                                                '& > fieldset': {
                                                    border : "3px solid #e0127c"
                                                }
                                            }
                                        }}
                                        InputLabelProps={{ sx: {display: 'none'}}}
                                        InputProps={{sx: {fontSize: '20px'}}}
                                        inputProps={{maxLength: 200}}
                                        required
                                        disabled={!editState}
                                        variant="outlined"
                                        name="profileImage"
                                        placeholder="Leave blank to remove image"
                                        value={authorValues.profileImage}
                                        onChange={handleInputChange("profileImage")}
                                        type="text" 
                                    />
                                </div>
                            </div>
                    </div>
                    <div className="edit-container">
                        <div className="edit-field-label">
                            Display Name
                        </div>
                        <div className="edit-field">
                            <TextField
                                style={{width: "100%", backgroundColor: "#e6e6e6"}}
                                sx={{
                                    '& legend': {display: 'none'},
                                    '& fieldset': {top: 0},
                                    '& .MuiOutlinedInput-root.Mui-focused': {
                                        '& > fieldset': {
                                            border : "3px solid #e0127c"
                                        }
                                    }
                                }}
                                InputLabelProps={{ sx: {display: 'none'}}}
                                InputProps={{ sx: {fontSize: '20px'}}}
                                required
                                disabled={!editState}
                                variant="outlined"
                                name="displayName"
                                placeholder="Required"
                                value={authorValues.displayName}
                                onChange={handleInputChange("displayName")}
                                type="text" 
                            />
                        </div>
                    </div>
                    <div className="edit-container">
                        <div className="edit-field-label">
                            Github Username
                        </div>
                        <div className="edit-field">
                            <TextField
                                style={{width: "100%", backgroundColor: "#e6e6e6"}}
                                sx={{
                                    '& legend': {display: 'none'},
                                    '& fieldset': {top: 0},
                                    '& .MuiOutlinedInput-root.Mui-focused': {
                                        '& > fieldset': {
                                            border : "3px solid #e0127c"
                                        }
                                    }
                                }}                                InputLabelProps={{ sx: {display: 'none'}}}
                                InputProps={{ sx: {fontSize: '20px'}}}
                                required
                                disabled={!editState}
                                variant="outlined"
                                name="github"
                                placeholder="Leave blank to remove Github"
                                value={authorValues.github}
                                onChange={handleInputChange("github")}
                                type="text" 
                            />
                        </div>
                    </div>
                    {editState ? (
                        <div className="update-profile-btn-container">
                            <button className="update-profile-btn" onClick={handleUpdateProfile}>
                                Update
                            </button>
                        </div>
                    ) : (
                        <div className="edit-profile-btn-container">
                            <button className="edit-profile-btn" onClick={handleEditButton()}>
                                Edit Profile
                            </button>
                        </div>
                    )}
                    {editState ? (
                        <div className="cancel-edit-profile-container">
                            <button className="cancel-edit-profile" onClick={handleEditButton("Cancel")}>Cancel</button>
                        </div>) : (<></>)}
                </div>
            </div>
            </>)};
        </>
    )
}

export default ProfilePage;