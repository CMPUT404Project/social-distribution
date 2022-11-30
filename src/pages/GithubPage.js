import { useState, useEffect } from "react";
import GitHubFeed from '../components/GithubActivity/GithubFeed'
import ClipLoader from 'react-spinners/ClipLoader';

import NavBar from "../components/NavBar/NavBar";
import AuthService from "../services/AuthService";
import { retrieveCurrentAuthor } from "../utils";

import axios from 'axios';

const BASE_URL = "https://api.github.com/users/";

function GithubPage() {
    const author = retrieveCurrentAuthor();
    const [values, setValues] = useState({
        fullname: "",
        username: author.github.split('.com/')[1],
        avatarUrl: ""
    }) 
    const [events, setEvents] = useState([])
    const [isEmpty, setIsEmpty] = useState(true)
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        const getGithubUserData = async () => {
            const axoisInstance = axios.create();
            axoisInstance.defaults.headers.common = {};
            const response = await axoisInstance.get(BASE_URL + values.username)
            .then((response) => {
                setValues(v => ({ ...v, avatarUrl: response.data.avatar_url, fullname: response.data.name }));
                return response
            }).catch((error) => {
                return error.response
            })
            if (response.status === 200) {
                await axoisInstance.get(BASE_URL + values.username + "/events")
                .then((response) => {
                    setEvents(response.data);
                    if (response.data.length > 0) {
                        setIsEmpty(false)
                    }
                    setLoading(false)
                })
            } else {
                setLoading(false)
            }
        }
        getGithubUserData()
    }, [values.username]);

    return (
        <>
        <NavBar />
            {isLoading ? (
                <div className="container">
                    <ClipLoader color={'#fff'} loading={isLoading} size={150} />
                </div>
                ) : (
                <div className="container" style={{alignItems: "start"}}>
                    <GitHubFeed
                        fullName={values.fullname}
                        userName={values.username}
                        avatarUrl={values.avatarUrl}
                        events={events}
                        isEmpty={isEmpty}
                    />
                </div>
            )}
        </>
    )
}

export default GithubPage;