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
import RemoteAuthService from "../services/RemoteAuthService";
import NavBar from "../components/NavBar/NavBar";

// Import Material UI Components
import {
    Alert, 
    AlertTitle,
    Avatar,
    Button,
    TextField,
    Typography,
    Slide,
    Snackbar
} from '@mui/material';
import { useEffect } from "react";

function SlideTransition(props: SlideProps) {
    return <Slide{...props} direction="down"/>;
}

function ProfilePage() {
    const {team, authorID} = useParams();
    const [authorValues, setAuthorValues] = useState({
        displayName: "",
        github: "",
        profileImage: "",
    })
    const [remoteNode, setRemoteNode] = useState(`${capitalizeFirstLetter(team.slice(0,4))} ${team.slice(4)}`)

    const [isExistingRequest, setIsExistingRequest] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isFriend, setIsFriend] = useState(false);

    const [isLoading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);

    const [alertDetails, setAlertDetails] = useState({
        alertSeverity: 'error',
        errorMessage: 'Failed to update. Please try again'
    })

    useEffect(() => {
        const checkFollowStatus = async (currentAuthorID) => {
            const response = await AuthService.getFollowStatus(currentAuthorID, authorID).then((data) => {
                setIsFollowing(data)
            }, error => {
                return error.response
            });
            if (response) {
                setIsFollowing(false)
            }
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
            const response = await RemoteAuthService.getRemoteAuthor(remoteNode, authorID);
            setAuthorValues({
                displayName: response.displayName || response.username,
                github: response.github.split(".com/")[1],
                profileImage: response.profileImage,
            })
            setLoading(false);
        }
        let currentAuthorID = getCurrentAuthorID();
        setLoading(true);
        checkFollowStatus(currentAuthorID);
        // checkExistingRequest(currentAuthorID);
        getAuthorDetails();
    }, [authorID])


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
                        {authorValues.displayName + "'s Profile"}
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
                                <Typography
                                    style={{
                                        width: "100%",
                                        color: "rgb(0, 0, 0, 0.6)",
                                        backgroundColor: "#e6e6e6",
                                        padding: "16.5px 14px",
                                        border: "1px solid black",
                                        fontSize: '20px'
                                    }}
                                    noWrap
                                    
                                >
                                    {authorValues.profileImage ? authorValues.profileImage : "None"}
                                </Typography>
                                </div>
                            </div>
                    </div>
                    <div className="edit-container">
                        <div className="edit-field-label">
                            Display Name
                        </div>
                        <div className="edit-field">
                            <Typography
                                style={{
                                    width: "100%",
                                    color: "rgb(0, 0, 0, 0.6)",
                                    backgroundColor: "#e6e6e6",
                                    padding: "16.5px 14px",
                                    border: "1px solid black",
                                    fontSize: '20px'
                                }}
                                noWrap
                                
                            >
                                {authorValues.displayName ? authorValues.displayName : "None"}
                            </Typography>
                        </div>
                    </div>
                    <div className="edit-container">
                        <div className="edit-field-label">
                            Github Username
                        </div>
                        <div className="edit-field">
                        <Typography
                                style={{
                                    width: "100%",
                                    color: "rgb(0, 0, 0, 0.6)",
                                    backgroundColor: "#e6e6e6",
                                    padding: "16.5px 14px",
                                    border: "1px solid black",
                                    fontSize: '20px'
                                }}
                                noWrap
                            >
                                {authorValues.github ? (<a href={authorValues.github} ></a>) : "None"}
                            </Typography>
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