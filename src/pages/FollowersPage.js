import React, { useEffect, useState } from "react";

import ClipLoader from 'react-spinners/ClipLoader';
import { Container, TextField } from "@mui/material";

import FollowersList from "../components/FriendsList/FollowersList";
import SearchResults from "../components/FriendsList/SearchResults";
import NavBar from "../components/NavBar/NavBar";
import AuthService from "../services/AuthService";
import RemoteAuthService from "../services/RemoteAuthService";
import {retrieveCurrentAuthor} from "../utils/index";

import SearchIcon from '@mui/icons-material/Search';

import './FollowersPage.css'

const teams = ["Team 12", "Team 13", "Team 16"]

function FollowersPage() {
    const author = retrieveCurrentAuthor();
    const currentAuthorID = author.id.split("authors/")[1];
    const [followers, setFollowers] = useState([]);
    const [allLocalAuthors, setAllLocalAuthors] = useState([]);
    const [allTeam12Authors, setAllTeam12Authors] = useState([]);
    const [allTeam13Authors, setAllTeam13Authors] = useState([]);
    const [allTeam16Authors, setAllTeam16Authors] = useState([]);

    const [searchField, setSearchField] = useState("");

    const [isEmpty, setIsEmpty] = useState(true)
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        getFollowerData();
        getAllAuthors();
    }, []);

    useEffect(() => {
        if (allLocalAuthors.length > 0) {
            setLoading(false)
        }
    }, [searchField])

    const getFollowerData = async () => {
        await AuthService.getAuthorFollowers().then((data) => {
            setFollowers(data);
            if (data.length > 0) {
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
                setAllLocalAuthors([...allLocalAuthors, ...data.items])
            }
        })
        teams.forEach(team => {
            RemoteAuthService.getRemoteAuthors(team).then((data) => {
                if (data) {
                    if (team === "Team 12") {
                        setAllTeam12Authors([...allTeam12Authors, ...data])
                    } else if (team === "Team 13") {
                        setAllTeam13Authors([...allTeam13Authors, ...data])
                    } else if (team === "Team 16") {
                        setAllTeam16Authors([...allTeam16Authors, ...data])
                    }
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
                                    <SearchIcon fontSize="large"/>
                                </span>
                                Include a team in the search to look for all users in that team. (E.g. "local", "Team 12")
                            </div>
                            <h1>Followers</h1> <br/>
                            {!followers.length ? (
                                <span className="empty-followers">If you had any followers, they would show up here :)</span>
                            ) : (
                                <FollowersList 
                                    followers={followers}
                                    currentAuthorID={currentAuthorID}
                                />
                            )}

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
                                <SearchIcon fontSize="large"/>
                            </span>
                            Include a team in the search to look for all users in that team. (E.g. "local", "Team 12")
                        </div>
                        <h1>Search Results</h1>
                        <h3>Locals</h3>
                        <SearchResults
                            team={"Local"}
                            input={searchField.toLowerCase().includes("local") ? "" : searchField}
                            authors={allLocalAuthors}
                        />
                        <h3>Team 12</h3>
                        <SearchResults 
                            team={"Team 12"}
                            input={searchField.toLowerCase().includes("team 12") ? "" : searchField}
                            authors={allTeam12Authors}
                        />
                        <h3>Team 13</h3>
                        <SearchResults 
                            team={"Team 13"}
                            input={searchField.toLowerCase().includes("team 13") ? "" : searchField}
                            authors={allTeam13Authors}
                        />
                        <h3>Team 16</h3>
                        <SearchResults 
                            team={"Team 16"}
                            input={searchField.toLowerCase().includes("team 16") ? "" : searchField}
                            authors={allTeam16Authors}
                        />
                    </Container>
                </div> 
            )}
        </>
    )
}

export default FollowersPage;