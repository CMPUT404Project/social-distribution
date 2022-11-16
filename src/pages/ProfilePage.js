import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

import { setAxiosAuthToken } from "../utils";
import AuthService from "../services/AuthService";
import NavBar from "../components/NavBar/NavBar";

// Import Material UI Icons

// Import Material UI Components
import { Alert, AlertTitle, TextField, TransitionProps, Slide } from '@mui/material';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

// import axios from 'axios';

function ProfilePage() {
    const navigate = useNavigate();
    const author = JSON.parse(AuthService.retrieveCurrentUser());
    const [authorValues, setAuthorValues] = useState({
        displayName: author.displayName || "",
        github: author.github.split(".com/")[1] || "",
        profileImage: author.profileImage || "",
    })

    const [editState, setEditState] = useState(false)

    const [isError, setIsError] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const [open, setOpen] = useState(false);

    const [accessToken, setAccessToken] = useState(localStorage.getItem('access_token') || sessionStorage.getItem('access_token'));
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refresh_token') || sessionStorage.getItem('refresh_token'));

    // useEffect(() => {
    //     console.log(authorValues)
    // }, [authorValues]);

    const handleInputChange = (prop) => (event) => {
        setAuthorValues({ ...authorValues, [prop]: event.target.value });
    };

    const handleEditButton = (prop) => () => {
        if (prop === "Cancel") {
            setAuthorValues({
                displayName: author.displayName || "",
                github: author.github.split(".com/")[1] || "",
                profileImage: author.profileImage || "",
            })
        }
        setEditState(!editState);
    }

    const handleUpdateProfile = async (event) => {
        let body = {};
        let githubUrl = "https://www.github.com/" + authorValues.github
        if (authorValues.displayName !== author.displayName) body.displayName = authorValues.displayName;
        if (authorValues.github !== author.github) body.github = githubUrl;
        if (authorValues.profileImage !== author.profileImage) body.profileImage = authorValues.profileImage;
        const response = await AuthService.updateUserDetails(body)
        // console.log(response)
    }

    const changeError = () => {
        setIsError(!isError);
    }

    const handleClickOpen = () => {
        setOpen(true);
    };
    
    const handleClose = () => {
    setOpen(false);
    };

    return (
        <>
        <NavBar />
        <div className="container" style={{alignItems: "flex-start"}}>
            <div className="profile-details-card">
                {isError ? (
                    <Alert severity="error" sx={{marginBottom: "30px"}}>
                        <AlertTitle>Error</AlertTitle>
                        This is an error alert — <strong>check it out!</strong>
                    </Alert>
                ) : (
                    <></>
                )}

                <span className="profile-title">
                    Profile
                </span>

                <div className="edit-container">
                    <div className="edit-field-label">
                        Display Name
                    </div>
                    <div className="edit-field">
                        <TextField
                            style={{width: "100%", backgroundColor: "#e6e6e6"}}
                            sx={{'& legend': {display: 'none'}, '& fieldset': {top: 0}}}
                            InputLabelProps={{ sx: {display: 'none'}}}
                            InputProps={{ sx: {fontSize: '20px'}}}
                            required
                            disabled={!editState}
                            variant="outlined"
                            name="displayName"
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
                            sx={{'& legend': {display: 'none'}, '& fieldset': {top: 0}}}
                            InputLabelProps={{ sx: {display: 'none'}}}
                            InputProps={{ sx: {fontSize: '20px'}}}
                            required
                            disabled={!editState}
                            variant="outlined"
                            name="github"
                            value={authorValues.github}
                            onChange={handleInputChange("github")}
                            type="text" 
                        />
                    </div>
                </div>
                <div className="edit-container">
                    <div className="edit-field-label">
                        Image
                    </div>
                    <div className="edit-field">
                        <TextField
                            style={{width: "100%", backgroundColor: "#e6e6e6"}}
                            sx={{'& legend': {display: 'none'}, '& fieldset': {top: 0}}}
                            InputLabelProps={{ sx: {display: 'none'}}}
                            InputProps={{ sx: {fontSize: '20px'}}}
                            required
                            disabled={!editState}
                            variant="outlined"
                            name="profileImage"
                            value={authorValues.profileImage}
                            onChange={handleInputChange("profileImage")}
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
                <div className="update-profile-btn-container">
                    <button className="update-profile-btn" onClick={changeError}>
                        error
                    </button>
                </div>
            </div>
        </div>
        </>
    )
}

export default ProfilePage;