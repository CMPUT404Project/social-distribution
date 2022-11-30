import React, { Component, PropTypes } from "react";
import { useNavigate } from "react-router-dom";

//Import MUI components
import {
    Avatar,
    Card,
    CardActionArea,
    CardHeader,
    Grid,
    Typography
} from "@mui/material";


import "./FollowersList.css";

export const User = (props) => {
    const navigate = useNavigate();
    const displayName = props.data.displayName;
    const github = props.data.github;
    const profileImage = props.data.profileImage;
    const foreignID = props.data.id.split("authors/")[1];

    const handleUserClick = (event) => {
        // NEED TO NAVIGATE TO REMOTE 
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



export default class FollowersList extends Component {
    propTypes: {
        followers: PropTypes.isRequired,
    }

    renderEvents() {
        return this.props.followers.map(follower => {
            return <User key={follower.id} data={follower}></User>;
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
