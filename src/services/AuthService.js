import axios from "axios";
import jwtDecode from "jwt-decode";

import { getCurrentAuthorID, getAccessToken, retrieveCurrentAuthor, setAxiosDefaults } from "../utils";

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
        setAxiosDefaults();
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

    retrieveCurrentUser() {
        return sessionStorage.getItem('author') || localStorage.getItem('author');
    }

    async getAuthorDetails(authorID) {
        setAxiosDefaults();
        const response = await axios.get("/authors/" + authorID);
        if (response.status === 200) {
            return response.data
        }
    }

    async getAllAuthors() {
        setAxiosDefaults();
        const response = await axios.get("/authors")
        if (response.status === 200) {
            return response.data 
        }
        return response.data
    }

    async getAuthorFollowers() {
        setAxiosDefaults();
        const authorID = getCurrentAuthorID();
        const response = await axios.get("/authors/" + authorID + "/followers");
        return response.data
    }

    async getFollowStatus(authorID, foreignID) {
        setAxiosDefaults();
        const response = await axios.get("/authors/" + foreignID + "/followers/" + authorID);
        return response.data
    }

    async cancelFollowRequest(foreignID) {
        setAxiosDefaults();
        const authorID = getCurrentAuthorID();
        const response = await axios.delete("/authors/" + foreignID + "/followRequest/" + authorID);
        return response.data
    }

    async unfollowAuthor(foreignID) {
        setAxiosDefaults();
        const authorID = getCurrentAuthorID();
        const response = await axios.delete("/authors/" + foreignID + "/followers/" + authorID);
        return response.data
    }

    async getInboxItems(type="", authorID) {
        setAxiosDefaults();
        let path = "/authors/" + authorID + "/inbox";
        if (type) {
            path = path + "?type=" + type;
        }
        const response = await axios.get(path);
        return response.data
    }

    async sendInboxItem(type, authorID, postID="", comment="", ) {
        setAxiosDefaults();
        const currentAuthor = retrieveCurrentAuthor();
        const author = await this.getAuthorDetails(authorID)
        let body = {
            type: type,
            actor: currentAuthor,
            author: author
        };
        if (type === "post") {
            body.content = "";
            body.categories = "";
        } else if (type === "follow") {
            body.summary = currentAuthor.displayName + " wants to follow you"
        } else if (type === "like") {
            body.context = {};
            body.summary = "";
            body.object = {};
        } else if (type === "comment") {
            body.post = postID;
            body.comment = comment;
        }
        // const response = await axios.put("/authors/" + foreignID + "/followers/" + authorID);
        const response = await axios.post("/authors/" + authorID + "/inbox", body);
        console.log(response.data)
        // return response.data
    }
}

export default new AuthService();