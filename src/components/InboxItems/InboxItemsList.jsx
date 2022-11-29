import axios from "axios";
import React, { Component, PropTypes, useEffect, useState } from "react";
import { useNavigate, redirect } from "react-router-dom";

//Import MUI components
import {
    Typography
} from "@mui/material";


import AuthService from "../../services/AuthService";

export default class InboxItemsList extends Component {
    propTypes: {
        tab: PropTypes.isRequired,
        inboxItems: PropTypes.isRequired,
    }

    renderEvents() {
        console.log(this.props.tab)
        if (this.props.tab === "Inbox") {
            return this.props.inboxItems.map(inboxItem => {
                if (inboxItem.type === "comment") {
                    return <div>{inboxItem.comment}</div>
                } else if (inboxItem.type === "post") {
                    return <div>{inboxItem.title}</div>
                } else if (inboxItem.type === "like") {
                    return <div>{inboxItem.summary}</div>
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