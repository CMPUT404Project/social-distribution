import axios from "axios";
import jwtDecode from "jwt-decode";

import { setAxiosAuthToken } from "../utils";

class AuthService {
    login(username, password, rememberMe) {
        return axios.post('api/auth/token/', 
            {
                username: username,
                password: password
            }
        ).then(response => {
            if (response.data.access) {
                if (rememberMe) {
                    localStorage.setItem("access_token", response.data.access);
                    localStorage.setItem('refresh_token', response.data.refresh);
                } else {
                    sessionStorage.setItem('access_token', response.data.access);
                    sessionStorage.setItem('refresh_token', response.data.refresh);
                }
                // Set auth token as default header for axios calls
                setAxiosAuthToken(response.data.access);
                this.storeCurrentUser()
            }
            return response.data;
        });
    }

    logout() {
        localStorage.removeItem("user");
    }

    register(username, password, displayName, githubUrl, imageUrl) {
        return axios.post('api/users/register/', 
            {
                username: username,
                password: password
            }
        ).then(response => {
            sessionStorage.setItem('access_token', response.data.access);
            sessionStorage.setItem('refresh_token', response.data.refresh);
            setAxiosAuthToken(response.data.access);

            const updateReponse = axios.put(jwtDecode(response.data.access).author_id,
                {
                    displayName: displayName,
                    github: githubUrl,
                    profileImage: imageUrl
                },
                {
                    headers: {
                        "Authorization": "Bearer " + response.data.access
                    }
                }
            ).then(updateResponse => {
                this.storeCurrentUser()
                return updateResponse.data
            });
            return updateReponse || response.data
        });
    }

    storeCurrentUser() {
        const accessToken = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
        const authorID = jwtDecode(accessToken)["author_id"].split("authors/")[1];
        return axios.get('authors/' + authorID).then(response => {
            if (localStorage.getItem('access_token')) {
                localStorage.setItem("author", JSON.stringify(response.data));
            } else if (sessionStorage.getItem('access_token')) {
                sessionStorage.setItem("author", JSON.stringify(response.data));
            }
            return response.data
        }).catch(error => {
            console.log(error)
        });
}

    retrieveCurrentUser() {
        return sessionStorage.getItem('author') || localStorage.getItem('author');
    }
}

export default new AuthService();
