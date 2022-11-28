import axios from "axios";
import jwtDecode from "jwt-decode";

import { getCurrentAuthorID, getAccessToken, retrieveCurrentAuthor, setAxiosDefaults } from "../utils";

class RemoteAuthService {
    async getAuthorDetails(authorID) {
        setAxiosDefaults();
        const response = await axios.get("/authors/" + authorID);
        if (response.status === 200) {
            return response.data
        }
    }
    
    async getRemoteAuthors(remoteNode) {
        let remoteAuthorsUrl = ""
        if (remoteNode === "Team 13") {
            remoteAuthorsUrl = "https://cmput404-team13.herokuapp.com/authors?page=1&size=1000"
            return await axios.get(remoteAuthorsUrl).then((response) => {
                return response.data.authorsPage;
            }).catch((error) => {
                if (error.response) {
                    console.log(error.response)
                }
                return [];
            });
        } else if (remoteNode === "Team 12") {
            remoteAuthorsUrl = "https://true-friends-404.herokuapp.com/authors/"
            return await axios.get(remoteAuthorsUrl, {
                headers: {
                    'Content-type': "application/json",
                    'Authorization': "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjc4MzE3OTQ2LCJpYXQiOjE2Njk2Nzc5NDYsImp0aSI6ImRiMjIwMmZjNGVjOTQ2MzQ4ZWFhNzY5OGMyN2U3NmI4IiwidXNlcl9lbWFpbCI6InRlYW0xOUBtYWlsLmNvbSJ9.57aZOwQJMaOOoYHpzzoOTPWw3hz7c1jxvg1EVYoeMfg"
                }
            }).then((response) => {
                return response.data;
            }).catch((error) => {
                if (error.response) {
                    console.log(error.response)
                }
                return [];
            });
        }
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

export default new RemoteAuthService();