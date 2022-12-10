import React, { Component, PropTypes, useState } from "react";
import { useNavigate } from "react-router-dom";

//Import MUI components
import { 
    Avatar,
    Button,
    Box,
    Card,
    CardActionArea,
    CardHeader,
    Grid,
    Link,
    Typography
} from "@mui/material";

import AuthService from "../../services/AuthService";
import RemoteAuthService from "../../services/RemoteAuthService";
import { useEffect } from "react";

export const InboxCommentItem = (props) => {
    const navigate = useNavigate();
    const displayName = props.data.author.displayName || props.data.username;
    const profileImage = props.data.author.profileImage;
    const foreignID = props.data.author.id.split("/authors/")[1];
    const aID = props.data.id.split("/authors/")[1].split("/posts/")[0];
    const pID = props.data.id.split("/posts/")[1].split("/comments/")[0];
    const [postURL, setPostURL] = useState(`https://social-distribution-404.herokuapp.com/author/${aID}/post/${pID}`);

    const [comment, setComment] = useState(() => {
        if (props.data.comment.length > 50) {
            return props.data.comment.substring(0, 50) + '...'
        } else {
            return props.data.comment
        }
    })
    const [isLongComment, setIsLongComment] = useState(() => {
        if (props.data.comment.length > 50) {
            return true
        } else {
            return false
        }
    });

    useEffect(() => {
        let newArray = [...postURL.split("/")];
        if (props.data.id.includes("http://127.0.0.1:8000/")) {
            newArray.splice(0,3,"http://localhost:3000")
            setPostURL(newArray.join("/"))
        }
    }, [])
    
    const handleUsernameClick = (event) => {
        event.stopPropagation();
        event.preventDefault();
        let team = "local"
        if (props.data.id.includes("https://true-friends-404.herokuapp.com/")) {
            team = "team12"
        } else if (props.data.id.includes("https://cmput404-team13.herokuapp.com/")) {
            team = "team13"
        } else if (props.data.id.includes("https://team-sixteen.herokuapp.com/")) {
            team = "team16"
        }
        if (team === "local") {
            navigate("/profile/" + foreignID)
        } else {
            navigate("/profile/remote/" + team + "/" + foreignID)
        }
    }

    const handleUserClick = (event) => {
        event.stopPropagation();
        event.preventDefault();
        setIsLongComment(!isLongComment);
        if (isLongComment) {
            setComment(props.data.comment);
        } else {
            setComment(props.data.comment.substring(0, 50) + '...');
        }
    }

    return (
        <Grid>
            <Card
                className="hoverCard"
                style={{ margin: 3}}
                elevation={15}
            >
                <CardActionArea 
                    component="a"
                    href={postURL}
                >
                    <CardHeader
                        avatar={
                            <Avatar 
                                alt="user image"
                                src={profileImage}
                                sx={{
                                    borderRadius: "50%",
                                    height: "100px",
                                    width: "100px",
                                    objectFit: "cover"}}
                                onClick={handleUsernameClick}
                            />
                        }
                        title={
                            <Typography variant="h5" sx={{fontWeight: "600"}}>
                                <Link 
                                    component="button"
                                    variant="h5" 
                                    sx={{fontWeight: "600", verticalAlign:"top"}} 
                                    onClick={handleUsernameClick}>{displayName}</Link> commented on your post:
                            </Typography>
                        }
                        subheader={
                            <Typography sx={{fontSize: "17px"}}>
                                {comment}
                                <Button 
                                    style={{ 
                                        backgroundColor: 'transparent',
                                        fontSize: "12px",
                                        textTransform: "none",
                                        padding: "0"
                                    }}
                                    sx={{
                                        ':hover': {
                                            color: "#e0127c"
                                        }
                                    }}
                                    onClick={handleUserClick}
                                    disableRipple
                                >
                                    {props.data.comment.length < 50 ? "" : isLongComment ? "Show more" : "Show less"}
                                </Button>
                            </Typography>
                        }
                    />
                </CardActionArea>
            </Card>
        </Grid>
    );
};

export const InboxPostItem = (props) => {
    const navigate = useNavigate();
    const postTitle = props.data.title;
    const displayName = props.data.author.displayName || props.data.username;
    const profileImage = props.data.author.profileImage;
    const foreignID = props.data.author.id.split("/authors/")[1];
    const aID = props.data.id.split("/authors/")[1].split("/posts/")[0];
    const pID = props.data.id.split("/posts/")[1];
    const [postURL, setPostURL] = useState(`https://social-distribution-404.herokuapp.com/author/${aID}/post/${pID}`);

    const [content, setContent] = useState(() => {
        if (props.data.content.length > 50) {
            return props.data.content.substring(0, 50) + '...'
        } else {
            return props.data.content
        }
    })
    const [isLongContent, setIsLongContent] = useState(() => {
        if (props.data.content.length > 50) {
            return true
        } else {
            return false
        }
    });

    useEffect(() => {
        let newArray = [...postURL.split("/")];
        if (props.data.id.includes("http://127.0.0.1:8000/")) {
            newArray.splice(0,3,"http://localhost:3000")
            setPostURL(newArray.join("/"))
        }
    }, [])

    const handleUsernameClick = (event) => {
        event.stopPropagation();
        event.preventDefault();
        
        let team = "local"
        if (props.data.id.includes("https://true-friends-404.herokuapp.com/")) {
            team = "team12"
        } else if (props.data.id.includes("https://cmput404-team13.herokuapp.com/")) {
            team = "team13"
        } else if (props.data.id.includes("https://team-sixteen.herokuapp.com/")) {
            team = "team16"
        }
        if (team === "local") {
            navigate("/profile/" + foreignID)
        } else {
            navigate("/profile/remote/" + team + "/" + foreignID)
        }
    }

    const handleUserClick = (event) => {
        event.stopPropagation();
        event.preventDefault();
        setIsLongContent(!isLongContent);
        if (isLongContent) {
            setContent(props.data.content);
        } else {
            setContent(props.data.content.substring(0, 50) + '...');
        }
    }

    return (
        <Grid>
            <Card
                className="hoverCard"
                style={{ margin: 3}}
                elevation={15}
            >
                <CardActionArea 
                    component="a"
                    href={postURL}
                >
                    <CardHeader
                        avatar={
                            <Avatar 
                                alt="user image"
                                src={profileImage}
                                sx={{
                                    borderRadius: "50%",
                                    height: "100px",
                                    width: "100px",
                                    objectFit: "cover"}}
                                onClick={handleUsernameClick}
                            />
                        }
                        title={
                            <Typography variant="h5" sx={{fontWeight: "600"}}>
                                <Link 
                                    component="button"
                                    variant="h5" 
                                    sx={{fontWeight: "600", verticalAlign:"top"}} 
                                    onClick={handleUsernameClick}>{displayName}</Link> made a new post:
                            </Typography>
                        }
                        subheader={
                            <>
                            <Typography sx={{fontSize: "17px"}}>
                                Title: {postTitle}
                            </Typography>
                            <Typography sx={{fontSize: "17px"}}>
                                Content: {content}
                                <Button 
                                    style={{ 
                                        backgroundColor: 'transparent',
                                        fontSize: "12px",
                                        textTransform: "none",
                                        padding: "0"
                                    }}
                                    sx={{
                                        ':hover': {
                                            color: "#e0127c"
                                        }
                                    }}
                                    onClick={handleUserClick}
                                    disableRipple
                                >
                                    {props.data.content.length < 50 ? "" : isLongContent ? "Show more" : "Show less"}
                                </Button>
                            </Typography>
                            </>
                        }
                    />
                </CardActionArea>
            </Card>
        </Grid>
    );
};

export const InboxLikeItem = (props) => {
    const navigate = useNavigate();
    const profileImage = props.data.author.profileImage;
    const displayName = props.data.author.displayName || props.data.username;
    const foreignID = props.data.author.id.split("/authors/")[1];
    const aID = props.data.object.split("/authors/")[1].split("/posts/")[0];
    const pID = props.data.object.split("/posts/")[1];
    const [postURL, setPostURL] = useState(`https://social-distribution-404.herokuapp.com/author/${aID}/post/${pID}`);

    useEffect(() => {
        let newArray = [...postURL.split("/")];
        if (props.data.object.includes("http://127.0.0.1:8000/")) {
            newArray.splice(0,3,"http://localhost:3000")
            setPostURL(newArray.join("/"))
        }
    }, [])

    const handleUsernameClick = (event) => {
        event.stopPropagation();
        event.preventDefault();
        let team = "local"
        
        if (props.data.object.includes("https://true-friends-404.herokuapp.com/")) {
            team = "team12"
        } else if (props.data.object.includes("https://cmput404-team13.herokuapp.com/")) {
            team = "team13"
        } else if (props.data.object.includes("https://team-sixteen.herokuapp.com/")) {
            team = "team16"
        }
        if (team === "local") {
            navigate("/profile/" + foreignID)
        } else {
            navigate("/profile/remote/" + team + "/" + foreignID)
        }
    }

    return (
        <Grid>
            <Card
                className="hoverCard"
                style={{ margin: 3}}
                elevation={15}
            >
                <CardActionArea 
                    component="a"
                    href={postURL}
                >
                    <CardHeader
                        avatar={
                            <Avatar 
                                alt="user image"
                                src={profileImage}
                                sx={{
                                    borderRadius: "50%",
                                    height: "100px",
                                    width: "100px",
                                    objectFit: "cover"}}
                                onClick={handleUsernameClick}
                            />
                        }
                        title={
                            <Typography variant="h5" sx={{fontWeight: "600"}}>
                                <Link 
                                    component="button"
                                    variant="h5" 
                                    sx={{fontWeight: "600", verticalAlign:"top"}} 
                                    onClick={handleUsernameClick}>{displayName}</Link> liked your post
                            </Typography>
                        }
                    />
                </CardActionArea>
            </Card>
        </Grid>
    );
};

export const InboxRequestItem = (props) => {
    const profileImage = props.data.actor.profileImage;
    const summary = props.data.summary;
    const follower = props.data.actor;
    const followee = props.data.object;

    const handleAcceptRequest = async (index) => {
        if (follower.host !== followee.host) {
            if (follower.host === "https://true-friends-404.herokuapp.com/") {
                await RemoteAuthService.acceptRemoteFollowRequest("Team 12",follower.id.split("authors/")[1]);
            } else if (follower.host === "https://cmput404-team13.herokuapp.com/") {
                await RemoteAuthService.acceptRemoteFollowRequest("Team 13",follower.id.split("authors/")[1]);
            }
        }
        await AuthService.acceptFollowRequest(follower.id.split("authors/")[1])
        .then(() => {
            props.setInboxItems(props.inboxItems.filter(item => item !== props.data))
        }, error => {
            return error
        });
    }

    const handleDeclineRequest = async (index) => {
        if (follower.host !== followee.host) {
            if (follower.host === "https://true-friends-404.herokuapp.com/") {
                await RemoteAuthService.declineRemoteFollowRequest("Team 12",follower.id.split("authors/")[1]);
            } else if (follower.host === "https://cmput404-team13.herokuapp.com/") {
                await RemoteAuthService.declineRemoteFollowRequest("Team 13",follower.id.split("authors/")[1]);
            }
        }
        await AuthService.declineFollowRequest(follower.id.split("authors/")[1])
        .then(() => {
            props.setInboxItems(props.inboxItems.filter(item => item !== props.data))
        }, error => {
            return error
        });
    }

    return (
        <Grid>
            <Card
                className="hoverCard"
                style={{ margin: 3}}
                elevation={15}
            >
                <Box sx={{ display: 'flex', alignItems: 'center'}}>
                    <CardHeader
                        avatar={
                            <Avatar 
                                alt="user image"
                                src={profileImage}
                                sx={{borderRadius: "50%",
                                height: "100px",
                                width: "100px",
                                objectFit: "cover"}}
                            />
                        }
                        title={
                            <Typography variant="h6" sx={{fontWeight: "600"}}>
                                {summary}
                            </Typography>
                        }
                    />
                    <Box sx={{ marginLeft: "auto"}}>
                        <Button
                            style={{ 
                                color: "#fff",
                                backgroundColor: "#237b20",
                                marginRight: "5px",
                                minWidth: "77px"
                            }}
                            sx={{
                                ':hover': {
                                    color: "#000!important",
                                    backgroundColor: "#237b20"
                                }
                            }}
                            onClick={handleAcceptRequest}
                        >
                            Accept
                        </Button>
                        <Button
                            style={{ 
                                color: "#fff",
                                backgroundColor: "#b04141",
                                marginRight: "5px"
                            }}
                            sx={{
                                ':hover': {
                                    color: "#000!important",
                                    backgroundColor: "#237b20"
                                }
                            }}
                            onClick={handleDeclineRequest}
                        >
                            Decline
                        </Button>
                    </Box>
                </Box>
            </Card>
        </Grid>
    );
};

export default class InboxItemsList extends Component {
    propTypes: {
        tab: PropTypes.isRequired,
        inboxItems: PropTypes.isRequired,
        setInboxItems: PropTypes.isRequired
    }

    renderEvents() {
        if (this.props.tab === "Inbox") {
            return this.props.inboxItems.map((inboxItem, index) => {
                if (inboxItem.type.toLowerCase() === "comment") {
                    return <InboxCommentItem key={index} data={inboxItem} inboxItems={this.props.inboxItems} setInboxItems={this.props.setInboxItems}/>
                } else if (inboxItem.type.toLowerCase() === "post") {
                    return <InboxPostItem key={index} data={inboxItem} inboxItems={this.props.inboxItems} setInboxItems={this.props.setInboxItems}/>
                } else if (inboxItem.type.toLowerCase() === "like") {
                    return <InboxLikeItem key={index} data={inboxItem} inboxItems={this.props.inboxItems} setInboxItems={this.props.setInboxItems}/>
                }
                return <React.Fragment key={index}/>
            })
        } else if (this.props.tab === "Requests") {
            return this.props.inboxItems.map((inboxItem, index) => {
                if (inboxItem.type.toLowerCase() === "follow") {
                    return <InboxRequestItem key={index} data={inboxItem} inboxItems={this.props.inboxItems} setInboxItems={this.props.setInboxItems}/>
                }
                return <React.Fragment key={index}/>
            })
        } 
    }

    render() {
        return (
            <div>
                {this.renderEvents()}
            </div>
        );
    }

}