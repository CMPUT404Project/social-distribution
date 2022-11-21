import axios from "axios";
import jwtDecode from "jwt-decode";

import { setAxiosAuthToken } from "../utils";

class AuthService {
    async login(username, password, rememberMe) {
        const response = await axios.post('api/auth/token',
            {
                username: username,
                password: password
            }
        )
        if (response.data.access) {
            if (rememberMe) {
                localStorage.setItem("access_token", response.data.access);
                localStorage.setItem('refresh_token', response.data.refresh);
            } else {
                sessionStorage.setItem('access_token', response.data.access);
                sessionStorage.setItem('refresh_token', response.data.refresh);
            }
            // Set auth token as default header for axios calls
            await setAxiosAuthToken();
            await this.storeCurrentUser()
        }
        return response.data
    }

    async register(username, password, body) {
        const response = await axios.post('api/users/register',
            {
                username: username,
                password: password
            }
        )
        if (response.status === 201) {
            sessionStorage.setItem('access_token', response.data.access);
            sessionStorage.setItem('refresh_token', response.data.refresh);
            setAxiosAuthToken(response.data.access);
            const updateReponse = await this.updateUserDetails(body);
            return updateReponse
        }
        return response.data
    }

    async updateUserDetails(body) {
        setAxiosAuthToken();
        const response = await axios.put(jwtDecode(this.getAccessToken()).author_id, body)
        if (response.status === 200) {
            if (localStorage.getItem('access_token')) {
                localStorage.setItem("author", JSON.stringify(response.data));
            } else if (sessionStorage.getItem('access_token')) {
                sessionStorage.setItem("author", JSON.stringify(response.data));
            }
        }
        return response.data
    }

    storeCurrentUser() {
        const accessToken = this.getAccessToken();
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

    getAccessToken() {
        return localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
    }

    getRefreshToken() {
        return localStorage.getItem('refresh_token') || sessionStorage.getItem('refresh_token');
    }
}

export default new AuthService();