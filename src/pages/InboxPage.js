import { useState, useEffect } from "react";

import {
    Container,
    Tabs,
    Tab
} from "@mui/material"

import { getCurrentAuthorID } from "../utils";
import NavBar from "../components/NavBar/NavBar";
import InboxItemsList from "../components/InboxItems/InboxItemsList";
import AuthService from "../services/AuthService";

// import axios from 'axios';

function InboxPage() {

    const [inboxItems, setInboxItems] = useState([])

    const [tabIndex, setTabIndex] = useState("Inbox");

    const handleChange = (event, newValue) => {
        setTabIndex(newValue);
    };

    useEffect(() => {
        const getInboxItems = async (currentAuthorID) => {
            await AuthService.getInboxItems(currentAuthorID).then((data) => {
                setInboxItems([...inboxItems, ...data.items])
            })
        }
        let currentAuthorID = getCurrentAuthorID();
        getInboxItems(currentAuthorID);
    }, []);


    return (
        <>
        <NavBar />
            <div className="container" style={{justifyContent: 'start',flexDirection: 'column'}}>
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
                <Container style={{paddingTop: "15px",paddingLeft: "150px", paddingRight: "150px"}}>
                    <InboxItemsList tab={tabIndex} inboxItems={inboxItems} setInboxItems={setInboxItems}/>
                </Container>
            </div>
        </>
    )
}

export default InboxPage;