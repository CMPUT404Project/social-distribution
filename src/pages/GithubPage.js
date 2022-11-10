import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import GitHubFeed from '../components/GithubActivity/index'
import ClipLoader from 'react-spinners/ClipLoader';

import NavBar from "../components/NavBar/NavBar";
import AuthService from "../services/AuthService";

import axios from 'axios';

const BASE_URL = "https://api.github.com/users/";

function GithubPage() {
    const navigate = useNavigate();
    const author = JSON.parse(AuthService.retrieveCurrentUser());
    console.log(author)
    const [values, setValues] = useState({
        fullname: "",
        username: "",
        avatarUrl: ""
    }) 
    const [events, setEvents] = useState([])
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        const getGithubUserData = async () => {
            const gitUsername = author.github.split('.com/')[1];
            setValues({ ...values, username: gitUsername });
            console.log(gitUsername)
            // REMEMBER TO REMOVE TOKEN
            const response = await axios.get(BASE_URL + gitUsername).then((response) => {
                setValues({ ...values, avatarUrl: response.data.avatar_url, fullname: response.data.name });
                return response
            }).catch((error) => {
                return error.response
            })
            if (response.status === 200) {
                // REMEMBER TO REMOVE TOKEN
                const eventsResponse = await axios.get(BASE_URL + gitUsername + "/events").then((response) => {
                    setEvents(response.data);
                    setLoading(false)
                    return response
                }).catch((error) => {
                    return error.response
                })
            } else {
                console.log("YO")
            }
        }
        setLoading(true)
        getGithubUserData()
    }, []);


    return (
        <>
        <NavBar />
            <div className="container">
                {isLoading ? (
                    <ClipLoader color={'#fff'} loading={isLoading} size={150} />
                ) : (
                    <>Github Page</>
                    // <GitHubFeed
                    //     fullName={values.fullname}
                    //     userName={values.username}
                    //     avatarUrl={values.avatarUrl}
                    //     events={events}
                    // />
                )}
            </div>
        </>
    )
}

export default GithubPage;