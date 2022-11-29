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

export const InboxCommentItem = (props) => {
    return (
        <Grid>
            <Card
                className="hoverCard"
                style={{ margin: 3}}
                elevation={15}
            >
                <CardHeader
                    // avatar={
                    //     <img
                    //         style={{
                    //             borderRadius: "50%",
                    //             height: "100px",
                    //             width: "100px",
                    //             objectFit: "cover"}}
                    //         src={profileImage}
                    //         alt="profile"
                    //     />
                    // }
                    title={
                        <Typography variant="h4">
                            Test
                        </Typography>
                    }
                    subheader={
                        <Typography variant="h6">
                            Test
                        </Typography>
                    }
                />
            </Card>
        </Grid>
    );
};

export const InboxPostItem = (props) => {
    return (
        <Grid>
            <Card
                className="hoverCard"
                style={{ margin: 3}}
                elevation={15}
            >
                <CardHeader
                    // avatar={
                    //     <img
                    //         style={{
                    //             borderRadius: "50%",
                    //             height: "100px",
                    //             width: "100px",
                    //             objectFit: "cover"}}
                    //         src={profileImage}
                    //         alt="profile"
                    //     />
                    // }
                    title={
                        <Typography variant="h4">
                            Test
                        </Typography>
                    }
                    subheader={
                        <Typography variant="h6">
                            Test
                        </Typography>
                    }
                />
            </Card>
        </Grid>
    );
};

export const InboxLikeItem = (props) => {
    return (
        <Grid>
            <Card
                className="hoverCard"
                style={{ margin: 3}}
                elevation={15}
            >
                <CardHeader
                    // avatar={
                    //     <img
                    //         style={{
                    //             borderRadius: "50%",
                    //             height: "100px",
                    //             width: "100px",
                    //             objectFit: "cover"}}
                    //         src={profileImage}
                    //         alt="profile"
                    //     />
                    // }
                    title={
                        <Typography variant="h4">
                            Test
                        </Typography>
                    }
                    subheader={
                        <Typography variant="h6">
                            Test
                        </Typography>
                    }
                />
            </Card>
        </Grid>
    );
};

export default class InboxItemsList extends Component {
    propTypes: {
        tab: PropTypes.isRequired,
        inboxItems: PropTypes.isRequired,
    }

    renderEvents() {
        console.log(this.props.tab)
        if (this.props.tab === "Inbox") {
            return this.props.inboxItems.map(inboxItem => {
                console.log(inboxItem)
                if (inboxItem.type === "comment") {
                    return <InboxCommentItem key={inboxItem.id} data={inboxItem}/>
                } else if (inboxItem.type === "post") {
                    return <InboxPostItem key={inboxItem.id} data={inboxItem}/>
                } else if (inboxItem.type === "like") {
                    return <InboxLikeItem key={inboxItem.id} data={inboxItem}/>
                }
                console.log(inboxItem.type)
                return;
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