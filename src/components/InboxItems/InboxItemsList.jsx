import React, { Component, PropTypes, useState } from "react";
import { useNavigate } from "react-router-dom";

//Import MUI components
import { 
    Avatar,
    Button,
    Box,
    Card,
    CardHeader,
    Grid,
    Typography
} from "@mui/material";

import AuthService from "../../services/AuthService";
import RemoteAuthService from "../../services/RemoteAuthService";

export const InboxCommentItem = (props) => {
    const displayName = props.data.author.displayName || props.data.username;
    const profileImage = props.data.author.profileImage;
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

    const handleUserClick = (event) => {
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
                        <Typography variant="h5" sx={{fontWeight: "600"}}>
                            {displayName} commented on your post:
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
            </Card>
        </Grid>
    );
};

export const InboxPostItem = (props) => {
    const postTitle = props.data.title;
    const displayName = props.data.author.displayName || props.data.username;
    const profileImage = props.data.author.profileImage;

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

    const handleUserClick = (event) => {
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
                        <Typography variant="h5" sx={{fontWeight: "600"}}>
                            {displayName} made a new post:
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
            </Card>
        </Grid>
    );
};

export const InboxLikeItem = (props) => {
    const profileImage = props.data.author.profileImage;
    const summary = props.data.summary

    return (
        <Grid>
            <Card
                className="hoverCard"
                style={{ margin: 3}}
                elevation={15}
            >
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
                        <Typography variant="h5" sx={{fontWeight: "600"}}>
                            {summary}
                        </Typography>
                    }
                />
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
                return <></>
            })
        } else if (this.props.tab === "Requests") {
            return this.props.inboxItems.map((inboxItem, index) => {
                if (inboxItem.type.toLowerCase() === "follow") {
                    return <InboxRequestItem key={index} data={inboxItem} inboxItems={this.props.inboxItems} setInboxItems={this.props.setInboxItems}/>
                }
                return <></>
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