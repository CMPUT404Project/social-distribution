import React, { useEffect, useState } from "react";

import ClipLoader from 'react-spinners/ClipLoader';
import { Container, TextField } from "@mui/material";

import FriendsList from "../components/FriendsList/FriendsList";
import NavBar from "../components/NavBar/NavBar";
import AuthService from "../services/AuthService";

import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

import './RelationshipPage.css'


function RelationshipPage() {
    const author = JSON.parse(AuthService.retrieveCurrentAuthor())
    let currentAuthorID = author.id.split("authors/")[1]
    const [followers, setFollowers] = useState([]);

    const [isEmpty, setIsEmpty] = useState(true)
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        const getFollowerData = async () => {
            await AuthService.getAuthorFollowers().then((data) => {
                setFollowers(data.items);
                console.log(data.items)
                if (data.items.length > 0) {
                    setIsEmpty(false)
                }
                setLoading(false)
            })
            .catch((error) => {
                console.log(error);
                setLoading(false)
            });
        }
        getFollowerData();
    }, []);

    return(
        <>
        <NavBar />
            {isLoading ? (
                <div className="container">
                    <ClipLoader color={'#fff'} loading={isLoading} size={150} />
                </div>
                ) : (
                <div className="container" style={{alignItems: 'flex-start'}}>
                    <Container>
                        <div className="search">
                            <TextField
                                variant="outlined"
                                style={{width: "100%", backgroundColor: "#e6e6e6", borderRadius: "4px"}}
                                sx={{
                                    '& legend': {display: 'none'},
                                    '& fieldset': {top: 0},
                                    '& .MuiOutlinedInput-root.Mui-focused': {
                                        '& > fieldset': {
                                            border : "3px solid #e0127c"
                                        }
                                    }
                                }}
                                InputLabelProps={{ sx: {display: 'none'}}}
                                InputProps={{sx: {fontSize: '20px'}}}
                                inputProps={{maxLength: 200}}
                                placeholder="Search for people to follow"
                                type="text"
                            />
                            <span className="search-icon">
                                <IconButton onClick={console.log("Yo")}>
                                    <SearchIcon />
                                </IconButton>
                            </span>
                        </div>
                        <h1>Relationship Page</h1> <br/>
                        <FriendsList 
                            followers={followers}
                            currentAuthorID={currentAuthorID}
                            isEmpty={isEmpty}
                        />
                    </Container>
                </div>
            )}
        </>
    )
}

export default RelationshipPage;