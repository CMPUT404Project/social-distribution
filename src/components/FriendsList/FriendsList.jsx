import { Card, Typography, Grid, Button } from "@mui/material";
import axios from "axios";
import jwtDecode from "jwt-decode";
import React, { Component, PropTypes, useEffect, useState } from "react";
import { Navigate, redirect } from "react-router-dom";
import AuthService from "../../services/AuthService";
import "./FriendsList.css";

export const User = (props) => {
    let displayName = props.data.displayName;
    let github = props.data.github;
    let profileImage = props.data.profileImage
        ? props.data.profileImage
        : "https://i.imgur.com/w3UEu8o.jpeg";
    let foreignID = props.data.id.split("authors/")[1]
    return (
        <Grid>
            <Card
                className="hoverCard"
                style={{ margin: 3, padding: "2% 2%", cursor: "pointer" }}
                elevation={15}
            >
                <img
                    style={{
                        borderRadius: "50%",
                        height: "100px",
                        width: "100px",
                        objectPosition: "center",
                        objectFit: "cover",
                    }}
                    src={profileImage}
                    alt="profile"
                />
                <Typography
                    variant="h4"
                    style={{ display: "inline", padding: "0% 5%" }}
                >
                    {displayName}
                </Typography>
                <Typography variant="h6" style={{ display: "inline" }}>
                    {github}
                </Typography>
                <Button
                    variant="contained"
                    onClick={event => handleUnfollow(props.currentAuthorID, foreignID)}
                    style={{ float: "right" }}
                >
                    Unfollow
                </Button>
            </Card>
        </Grid>
    );
};

const handleUnfollow = (aID, faID) => {
    let accessToken =
        localStorage.getItem("access_token") ||
        sessionStorage.getItem("access_token");
    // TODO: Followers have not been implemented yet on this branch
    axios.delete("service/authors/" + aID + "/followers/" + faID, {
        headers: {
            Authorization: "Bearer " + accessToken,
        },
    });
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
