import axios from "axios";
import React, { Component, PropTypes, useEffect, useState } from "react";
import { useNavigate, redirect } from "react-router-dom";

//Import MUI components
import {
    Avatar,
    Button,
    Card,
    CardActionArea,
    CardHeader,
    Grid,
    Typography
} from "@mui/material";

import AuthService from "../../services/AuthService";

export const User = (props) => {
    const navigate = useNavigate();
    const displayName = props.data.displayName || props.data.username;
    const github = props.data.github;
    const profileImage = props.data.profileImage;
    const foreignID = props.data.id.split("authors/")[1] || props.data.id;

    const team = props.team.replace(" ",'').toLowerCase();

    const handleUserClick = (event) => {
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
                    style={{padding: "2% 2%"}}
                    onClick={handleUserClick}
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



export default class SearchResults extends Component {
    propTypes: {
        authors: PropTypes.isRequired,
        team: PropTypes.isRequired,
        input: PropTypes.isRequired
    }

    renderEvents() {
        const filteredData = this.props.authors.filter((author) => {
            if (this.props.input === '') {
                return author;
            } else {
                if (this.props.team === "Team 12") {
                    return author.username.toLowerCase().includes(this.props.input.toLowerCase())
                } else {
                    return author.displayName.toLowerCase().includes(this.props.input.toLowerCase())
                }
            }
        })
        return filteredData.map(author => {
            return <User key={author.id} team={this.props.team} data={author}></User>;
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
