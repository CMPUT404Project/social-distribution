import axios from "axios";
import React, { Component, PropTypes, useEffect, useState } from "react";
import { useNavigate, redirect } from "react-router-dom";

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
    const navigate = useNavigate();
    const displayName = props.data.displayName;
    const github = props.data.github;
    const profileImage = props.data.profileImage
        ? props.data.profileImage
        : "https://i.imgur.com/w3UEu8o.jpeg";
    const foreignID = props.data.id.split("authors/")[1];


    const handleUnfollow = (faID) => {
        console.log(faID)
    };

    const handleUserClick = (event) => {
        navigate("/profile/" + foreignID)
    }

    return (
        <Grid>
            <Card
                className="hoverCard"
                style={{ margin: 3}}
                elevation={15}
            >
                <CardActionArea 
                    style={{padding: "2% 2%"}}
                    onClick={handleUserClick}
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



export default class FollowersList extends Component {
    propTypes: {
        followers: PropTypes.isRequired,
        currentAuthorID: PropTypes.isRequired
    }

    renderEvents() {
        return this.props.followers.map(follower => {
            return <User key={follower.id} data={follower} currentAuthorID={this.props.currentAuthorID}></User>;
        })
    }

    render() {
        return (
            <div>
                {this.renderEvents()}
            </div>
        );
    }

}
