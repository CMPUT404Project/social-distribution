import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import {
    Box,
    Tabs,
    Tab
} from "@mui/material"

import { 
    getCurrentAuthorID,
    retrieveCurrentAuthor,
    regexPatterns, 
    doesImageExist, 
    capitalizeFirstLetter
} from "../utils";
import NavBar from "../components/NavBar/NavBar";
import InboxItemsList from "../components/InboxItems/InboxItemsList";
import AuthService from "../services/AuthService";

// import axios from 'axios';

function InboxPage() {
    const navigate = useNavigate();

    const [inboxItems, setInboxItems] = useState([])

    const [tabIndex, setTabIndex] = useState("Inbox");

    const handleChange = (event, newValue) => {
        setTabIndex(newValue);
    };

    useEffect(() => {
        const getInboxItems = async (currentAuthorID) => {
            await AuthService.getInboxItems(currentAuthorID).then((data) => {
                console.log(data.items);
                setInboxItems([...inboxItems, ...data.items])
            })
        }
        let currentAuthorID = getCurrentAuthorID();
        getInboxItems(currentAuthorID);
    }, []);

    return (
        <>
        <NavBar />
            <div className="container" style={{alignItems: "start"}}>
                <Tabs
                    value={tabIndex}
                    onChange={handleChange}
                    textColor="secondary"
                    indicatorColor="secondary"
                    aria-label="secondary tabs example"
                >
                    <Tab sx={{color: "rgba(0, 0, 0, 0.6)", fontSize: "20px"}} value={"Inbox"} label="Inbox" />
                    <Tab sx={{color: "rgba(0, 0, 0, 0.6)", fontSize: "20px"}} value={"Requests"} label="Requests" />
                </Tabs>
                <InboxItemsList tab={tabIndex} inboxItems={inboxItems}/>
            </div>
        </>
    )
}

export default InboxPage;