import axios from "axios";
import React, { Component, PropTypes, useEffect, useState } from "react";
import { Navigate, redirect } from "react-router-dom";

//Import MUI components
import { 
    Button,
    Card,
    CardActionArea,
    CardHeader,
    Grid,
    Typography
} from "@mui/material";


import AuthService from "../../services/AuthService";
import "./FriendsList.css";

export const User = (props) => {
    const displayName = props.data.displayName;
    const github = props.data.github;
    const profileImage = props.data.profileImage
        ? props.data.profileImage
        : "https://i.imgur.com/w3UEu8o.jpeg";
    const foreignID = props.data.id.split("authors/")[1];


    const handleUnfollow = (faID) => {
        console.log(faID)
    };

    return (
        <Grid>
            <Card
                className="hoverCard"
                style={{ margin: 3}}
                elevation={15}
            >
                <CardActionArea 
                    style={{padding: "2% 2%"}}
                    onMouseDown={() => {console.log(props.data.url)}}
                >
                    <CardHeader
                        avatar={
                            <img
                                style={{
                                    borderRadius: "50%",
                                    height: "100px",
                                    width: "100px",
                                    objectFit: "cover"}}
                                src={profileImage}
                                alt="profile"
                            />
                        }
                        action={
                            <Button
                                variant="contained"
                                component="span"
                                disableRipple={true}
                                sx={{
                                    backgroundColor: "#e0127c",
                                    '&:hover': {backgroundColor: "#e0127c"},
                                    fontWeight: "600"}}
                                onMouseDown={e => {
                                    e.stopPropagation();
                                    handleUnfollow(props.currentAuthorID, foreignID);
                                }}
                            >
                                Unfollow
                            </Button>
                        }
                        title={
                            <Typography variant="h4">
                                {displayName}
                            </Typography>
                        }
                        subheader={
                            <Typography variant="h6">
                                {github}
                            </Typography>
                        }
                    />
                </CardActionArea>
            </Card>
        </Grid>
    );
};



export default class FriendsList extends Component {
    propTypes: {
        followers: PropTypes.isRequired,
        currentAuthorID: PropTypes.isRequired,
        isEmpty: PropTypes.isRequired
    }

    renderEvents() {
        return this.props.followers.map(follower => {
            return <User key={follower.id} data={follower} currentAuthorID={this.props.currentAuthorID}></User>;
        })
    }

    render() {
        return (
            <div>
                {this.props.isEmpty ? (<div className="empty-events">No followers to show</div>) : (this.renderEvents())}
            </div>
        );
    }

}
