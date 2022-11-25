import React, { useEffect, useState } from "react";

import ClipLoader from 'react-spinners/ClipLoader';
import { Container, TextField } from "@mui/material";

import FriendsList from "../components/FriendsList/FriendsList";
import NavBar from "../components/NavBar/NavBar";
import AuthService from "../services/AuthService";

import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

import './RelationshipPage.css'

const teams = ["12", "13"]

function RelationshipPage() {
    const author = JSON.parse(AuthService.retrieveCurrentAuthor())
    const currentAuthorID = author.id.split("authors/")[1];
    const [followers, setFollowers] = useState([]);
    const [allAuthors, setAllAuthors] = useState([]);

    const [searchField, setSearchField] = useState("");

    const [isEmpty, setIsEmpty] = useState(true)
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        getFollowerData();
        getAllAuthors();
    }, []);

    useEffect(() => {
        console.log(followers)
        if (allAuthors.length > 0) {
            setLoading(false)
        }
    }, [searchField])

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

    const getAllAuthors = async () => {
        await AuthService.getAllAuthors().then((data) => {
            if (data.items) {
                setAllAuthors([...allAuthors, ...data.items])
            }
        })
        teams.forEach(team => {
            AuthService.getRemoteAuthors(team).then((data) => {
                if (data.items) {
                    setAllAuthors([...allAuthors, ...data.items])
                }
            })
        });
    }

    const handleInputChange = () => (event) => {
        setSearchField(event.target.value);
    };

    return(
        <>
        <NavBar />
            {isLoading ? (
                <div className="container">
                    <ClipLoader color={'#fff'} loading={isLoading} size={150} />
                </div>
                ) : !searchField ? (
                    <div className="container" style={{alignItems: 'flex-start'}}>
                        <Container>
                            <div className="search">
                                <TextField
                                    variant="outlined"
                                    style={{
                                        width: "100%",
                                        backgroundColor: "#e6e6e6",
                                        borderRadius: "4px",
                                        
                                    }}
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
                                    InputProps={{sx: {fontSize: '20px', padding: "0 70px 0 0px"}}}
                                    inputProps={{maxLength: 200}}
                                    value={searchField}
                                    onChange={handleInputChange()}
                                    placeholder="Search for people to follow"
                                    type="text"
                                />
                                <span className="search-icon">
                                    <IconButton onClick={() => {console.log("Yo")}}>
                                        <SearchIcon fontSize="large"/>
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
                ) : (
                <div className="container" style={{alignItems: 'flex-start'}}>
                    <Container>
                        <div className="search">
                            <TextField
                                variant="outlined"
                                style={{
                                    width: "100%",
                                    backgroundColor: "#e6e6e6",
                                    borderRadius: "4px",
                                    
                                }}
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
                                InputProps={{sx: {fontSize: '20px', padding: "0 70px 0 0px"}}}
                                inputProps={{maxLength: 200}}
                                value={searchField}
                                onChange={handleInputChange()}
                                placeholder="Search for people to follow"
                                type="text"
                            />
                            <span className="search-icon">
                                <IconButton onClick={() => {console.log("Yo")}}>
                                    <SearchIcon fontSize="large"/>
                                </IconButton>
                            </span>
                        </div>
                        <h1>Search Results</h1> <br/>
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