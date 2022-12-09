import { useState } from "react";
import { useParams } from "react-router-dom";
import ClipLoader from 'react-spinners/ClipLoader';

import { 
    getCurrentAuthorID,
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
    const remoteNode = `${capitalizeFirstLetter(team.slice(0,4))} ${team.slice(4)}`

    const [isFollowing, setIsFollowing] = useState();
    const [isFollowed, setIsFollowed] = useState();
    const [isFriend, setIsFriend] = useState(false);

    const [isLoading, setLoading] = useState(true);
    const [doneLoading, setDoneLoading] = useState({
        followStatus: false,
        authorDetails: false
    });
    const [open, setOpen] = useState(false);

    const [alertDetails, setAlertDetails] = useState({
        alertSeverity: 'error',
        errorMessage: 'Something went wrong. Try again later.'
    })

    useEffect(() => {
        const checkFollowStatus = async (currentAuthorID) => {
            const response = await RemoteAuthService.getRemoteFollowStatus(remoteNode, authorID);
            setIsFollowing(response)
            if (response) {
                setIsFollowed(await AuthService.getFollowStatus(authorID, currentAuthorID));
            } else {
                setDoneLoading(doneLoading => {return {...doneLoading, followStatus: true}});
            }
        }
        const getAuthorDetails = async () => {
            const response = await RemoteAuthService.getRemoteAuthor(remoteNode, authorID);
            setAuthorValues({
                displayName: response.displayName || response.username,
                github: response.github.replace(/https?:\/\/(www\.)?github\.com\/?/, "") || "",
                profileImage: response.profileImage,
            })
        }
        let currentAuthorID = getCurrentAuthorID();
        checkFollowStatus(currentAuthorID);
        getAuthorDetails();
    }, [authorID, remoteNode])

    useEffect(() => {
        setIsFriend(isFollowed && isFollowing)
    }, [isFollowed, isFollowing])

    useEffect(() => {
        setDoneLoading(doneLoading => {return {...doneLoading, followStatus: true}});
    }, [isFriend])

    useEffect(() => {
        if (authorValues.displayName) {
            setDoneLoading(doneLoading => {return {...doneLoading, authorDetails: true}});
        }
    }, [authorValues])

    useEffect(() => {
        setLoading(!Object.values(doneLoading).every(
            value => value === true
        ));
    }, [doneLoading])

    const handleFollow = async (event) => {
        try {
            setLoading(true)
            if (event.target.textContent === "Send Follow Request") {
                const response = await RemoteAuthService.sendRemoteFollowRequest(remoteNode, authorID).then(() => {
                    setAlertDetails({alertSeverity: "success", 
                            errorMessage: "Sent a follow request to " + authorValues.displayName})
                    handleOpen();
                }, error => {
                    return error;
                });
                if (response) {
                    throw response;
                };
            } else if (event.target.textContent === "Unfollow") {
                const response = await RemoteAuthService.unfollowRemoteAuthor(remoteNode, authorID).then(() => {
                    setAlertDetails({alertSeverity: "success", 
                            errorMessage: "Unfollowed " + authorValues.displayName})
                    setIsFollowing(false);
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
            if (error.response) {
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
            <div className="container" style={isLoading ? {alignItems: "center"} : {alignItems: "flex-start"}}>
                {isLoading ? (
                    <ClipLoader color={'#fff'} loading={isLoading} size={150} />
                ) : (
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
                            Github
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
                                {authorValues.github ? (<a href={`https://github.com/${authorValues.github}`} target="_blank" rel="noreferrer">{authorValues.github}</a>) : "None"}
                            </Typography>
                        </div>
                    </div>
                    <div className="follow-btn-container">
                        <Button 
                            variant="contained"
                            sx={{fontWeight: "600"}}
                            onClick={handleFollow}
                        >
                            {isFollowing ? ("Unfollow") : ("Send Follow Request")}
                        </Button>
                    </div>
                </div>)}
            </div>
        </>
    )
}

export default ProfilePage;
