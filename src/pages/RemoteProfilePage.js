import { useState } from "react";
import { useParams } from "react-router-dom";
import ClipLoader from 'react-spinners/ClipLoader';

import { 
    getCurrentAuthorID,
    retrieveCurrentAuthor,
    regexPatterns, 
    doesImageExist, 
    capitalizeFirstLetter
} from "../utils";
import AuthService from "../services/AuthService";
import NavBar from "../components/NavBar/NavBar";

// Import Material UI Components
import {
    Alert, 
    AlertTitle,
    Avatar,
    Button,
    TextField,
    Slide,
    Snackbar
} from '@mui/material';
import { useEffect } from "react";

function SlideTransition(props: SlideProps) {
    return <Slide{...props} direction="down"/>;
}

function ProfilePage() {
    const {team, authorID} = useParams();
    const [isAuthor, setIsAuthor] = useState(true);
    const [defaultAuthor, setDefaultAuthor] = useState(retrieveCurrentAuthor());
    const [authorValues, setAuthorValues] = useState({
        displayName: defaultAuthor.displayName || "",
        github: defaultAuthor.github.split(".com/")[1] || "",
        profileImage: defaultAuthor.profileImage || "",
    })

    const [isExistingRequest, setIsExistingRequest] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isFriend, setIsFriend] = useState(false);

    const [editState, setEditState] = useState(false)
    const [isLoading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);

    const [alertDetails, setAlertDetails] = useState({
        alertSeverity: 'error',
        errorMessage: 'Failed to update. Please try again'
    })

    useEffect(() => {
        const checkFollowStatus = async (currentAuthorID) => {
            await AuthService.getFollowStatus(currentAuthorID, authorID).then(async (data) => {
                setIsFollowing(data)
                if (data) {
                    await AuthService.getFollowStatus(authorID, currentAuthorID).then((data2) => {
                        setIsFriend(data2)
                    })
                }
                setLoading(false);
            })
        }
        const checkExistingRequest = async (currentAuthorID) => {
            await AuthService.getInboxItems("follows", authorID).then((data) => {
                data.items.forEach(followRequest => {
                    let followRequestID = followRequest.actor.id.split("authors/")[1]
                    if (followRequestID === currentAuthorID) {
                        setIsExistingRequest(true);
                    }
                });
            })
        }
        const getAuthorDetails = async () => {
            await AuthService.getAuthorDetails(authorID).then((data) => {
                setAuthorValues({
                    displayName: data.displayName,
                    github: data.github,
                    profileImage: data.profileImage
                })
            })
        }
        setLoading(true);
        let currentAuthorID = getCurrentAuthorID();
        if (authorID === currentAuthorID) {
            setIsAuthor(true);
            setAuthorValues({
                displayName: defaultAuthor.displayName || "",
                github: defaultAuthor.github.split(".com/")[1] || "",
                profileImage: defaultAuthor.profileImage || "",
            })
            setLoading(false);
        } else {
            console.log(team)
            // checkFollowStatus(currentAuthorID);
            // setEditState(false);
            // setIsAuthor(false);
            // checkExistingRequest(currentAuthorID);
            // getAuthorDetails();
        };
    }, [authorID, defaultAuthor])

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

    const handleFollow = async (event) => {
        console.log(isFollowing);
        try {
            setLoading(true)
            if (event.target.textContent === "Send Follow Request") {
                const response = await AuthService.sendInboxItem("follow", authorID).then(() => {
                    setAlertDetails({alertSeverity: "success", 
                            errorMessage: "Sent a follow request to " + authorValues.displayName})
                    setIsExistingRequest(true)
                    handleOpen();
                }, error => {
                    return error;
                });
                if (response) {
                    throw response;
                };
            } else if (event.target.textContent === "Cancel pending follow request") {
                const response = await AuthService.cancelFollowRequest(authorID).then(() => {
                    setAlertDetails({alertSeverity: "success", 
                            errorMessage: "Cancelled follow request to " + authorValues.displayName})
                    setIsFollowing(false);
                    setIsExistingRequest(false);
                    handleOpen();
                }, error => {
                    return error;
                });
                if (response) {
                    throw response;
                };
            } else if (event.target.textContent === "Unfollow") {
                const response = await AuthService.unfollowAuthor(authorID).then(() => {
                    setAlertDetails({alertSeverity: "success", 
                            errorMessage: "Unfollowed " + authorValues.displayName})
                    setIsFollowing(false);
                    setIsExistingRequest(false);
                    handleOpen();
                }, error => {
                    return error;
                });
                if (response) {
                    throw response;
                };
            }
        } catch (error) {
            console.log(error.response);
            if (error.response.status === 404) {
                setAlertDetails({alertSeverity: "error", 
                    errorMessage: "Author could not found"})
            } else if (error.response.status === 409) {
                setAlertDetails({alertSeverity: "error", 
                    errorMessage: "You've already sent a follow request to this author"})
            } else {
                setAlertDetails({alertSeverity: "warning", 
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
            <div className="container" style={{alignItems: "flex-start"}}>
                <div className="profile-details-card">
                    <span className="profile-title">
                        {isAuthor ? ("Edit Profile") : authorValues.displayName ? (authorValues.displayName + "'s Profile") : ("UNKNOWN Profile")}
                    </span>
                    <Avatar 
                        src={authorValues.profileImage}
                        sx={{
                            width: 150,
                            height: 150,
                            margin: "auto",
                            border: isFriend ? "5px solid gold" : "2px solid black"
                        }}
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
                                }}
                                InputLabelProps={{ sx: {display: 'none'}}}
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
                    <div className="follow-btn-container">
                        <Button 
                            variant="contained"
                            sx={{fontWeight: "600"}}
                            onClick={handleFollow}
                        >
                            {isFollowing ? ("Unfollow") 
                            : isExistingRequest ? ("Cancel pending follow request") 
                            : ("Send Follow Request")}
                        </Button>
                    </div>
                </div>
            </div>
            </>)};
        </>
    )
}

export default ProfilePage;