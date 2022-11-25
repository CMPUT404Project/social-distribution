import axios from "axios";
import jwtDecode from "jwt-decode";

import { getCurrentAuthorID, getAccessToken, setAxiosDefaults } from "../utils";

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
            await setAxiosDefaults();
            await this.storeCurrentAuthor()
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
            await setAxiosDefaults();
            await this.storeCurrentAuthor()
            const updateReponse = await this.updateAuthorDetails(body);
            return updateReponse
        }
        return response.data
    }

    async updateAuthorDetails(body) {
        setAxiosDefaults();
        const authorID = getCurrentAuthorID();
        const response = await axios.put("/authors/" + authorID, body)
        console.log(response)
        if (response.status === 200) {
            if (localStorage.getItem('access_token')) {
                localStorage.setItem("author", JSON.stringify(response.data));
            } else if (sessionStorage.getItem('access_token')) {
                sessionStorage.setItem("author", JSON.stringify(response.data));
            }
        }
        return response.data
    }

    storeCurrentAuthor() {
        const accessToken = getAccessToken();
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

    retrieveCurrentAuthor() {
        return sessionStorage.getItem('author') || localStorage.getItem('author');
    }

    async getAuthorDetails(authorID) {
        const response = await axios.get("/authors/" + authorID);
        if (response.status === 200) {
            return response.data
        }
    }

    async getAllAuthors() {
        const response = await axios.get("/authors")
        console.log(response.data)
        // console.log("/service/authors" + aID + "/followers")
        // setFollowers(res["items"]);
        if (response.status === 200) {
            return response.data 
        }
        return response.data
    }

    async getRemoteAuthors(remoteNode) {
        let remoteAuthorsUrl = ""
        if (remoteNode === "13") {
            remoteAuthorsUrl = "https://cmput404-team13.herokuapp.com/authors?page=1&size=1000"
        } else if (remoteNode === "12") {
            remoteAuthorsUrl = "https://true-friends-404.herokuapp.com/authors/"
        }
        return await axios.get(remoteAuthorsUrl).then((response) => {
            console.log(response)
            return response.data;
        }).catch((error) => {
            if (error.response) {
                console.log(error.response)
            }
            return [];
        });
    }

    async getAuthorFollowers() {
        setAxiosDefaults();
        const authorID = "" //getCurrentAuthorID();
        const data = {
            type: "followers",
            items: [
                {
                    type: "author",
                    id: "http://127.0.0.1:5454/authors/1d698d25ff008f7538453c120f581471",
                    url: "http://127.0.0.1:5454/authors/1d698d25ff008f7538453c120f581471",
                    host: "http://127.0.0.1:5454/",
                    displayName: "Greg Johnson",
                    github: "http://github.com/gjohnson",
                    profileImage: "https://i.imgur.com/k7XVwpB.jpeg",
                },
                {
                    type: "author",
                    id: "http://127.0.0.1:5454/authors/9de17f29c12e8f97bcbbd34cc908f1baba40658e",
                    host: "http://127.0.0.1:5454/",
                    displayName: "Lara Croft",
                    url: "http://127.0.0.1:5454/authors/9de17f29c12e8f97bcbbd34cc908f1baba40658e",
                    github: "http://github.com/laracroft",
                    profileImage: "https://i.imgur.com/k7XVwpB.jpeg",
                },
                {
                    type: "author",
                    id: "http://127.0.0.1:8000/authors/9de17f29c12e8f97bcbbd34cc908f1658e",
                    host: "http://127.0.0.1:8000/",
                    displayName: "Byron Tung",
                    url: "http://127.0.0.1:8000/authors/9de17f29c12e8f97bcbbd34cc908f1658e",
                    github: "http://github.com/byrontung",
                    profileImage: "https://i.imgur.com/LRoLTlK.jpeg",
                },
                {
                    type: "author",
                    id: "http://127.0.0.1:8000/authors/9de17f29c12e8f97bcbbd34cc908fff1658e",
                    host: "http://127.0.0.1:8000/",
                    displayName: "Tyron Bung",
                    url: "http://127.0.0.1:8000/authors/9de17f29c12e8f97bcbbd34cc908fff1658e",
                    github: "http://github.com/tyronbung",
                },
            ],
        };
        // setFollowers(decode)
        const response = await axios.get("/service/authors/" + authorID + "/followers")
        console.log(response)
        // console.log("/service/authors" + aID + "/followers")
        // setFollowers(res["items"]);
        if (response.status === 200) {
            return data //temp
            // return response.data
        }
        return response.data
    }

    async getFollowStatus(foreignID) {
        setAxiosDefaults();
        const authorID = getCurrentAuthorID();
        const response = await axios.get("/authors/" + foreignID + "/followers/" + authorID);
        return response.data
    }

    async followAuthor(foreignID) {
        setAxiosDefaults();
        const authorID = getCurrentAuthorID();
        const response = await axios.put("/authors/" + foreignID + "/followers/" + authorID);
        return response.data
    }

    async unfollowAuthor(foreignID) {
        setAxiosDefaults();
        const authorID = getCurrentAuthorID();
        const response = await axios.delete("/authors/" + foreignID + "/followers/" + authorID);
        return response.data
    }
}

export default new AuthService();