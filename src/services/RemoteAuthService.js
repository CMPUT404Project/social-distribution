import axios from "axios";
import jwtDecode from "jwt-decode";

import { getCurrentAuthorID, getAccessToken, retrieveCurrentAuthor } from "../utils";

const team12Instance = axios.create({
    baseURL: "https://true-friends-404.herokuapp.com"
})

const team13Instance = axios.create({
    baseURL: "https://cmput404-team13.herokuapp.com"
})

class RemoteAuthService {
    async getRemoteJWT(remoteNode) {
        if (remoteNode === "Team 12") {
            await team12Instance.post("/api/token/obtain/", {
                email: "team19@mail.com",
                password: "team19"
            }).then((response) => {
                team12Instance.defaults.headers.common["Authorization"] = "Bearer " + response.data.access
            })
        } else if (remoteNode === "Team 13") {
            await team13Instance.put("/users", {
                username: "team19",
                password: "securepassword"
            }).then((response) => {
                team13Instance.defaults.headers.common["Authorization"] = "Bearer " + response.data.jwt
            })
        }

    }

    async getRemoteAuthors(remoteNode) {
        await this.getRemoteJWT(remoteNode);
        if (remoteNode === "Team 13") {
            return await team13Instance.get("/authors?page=1&size=1000").then((response) => {
                return response.data.authorsPage;
            }).catch((error) => {
                if (error.response) {
                    console.log(error.response)
                }
                return [];
            });
        } else if (remoteNode === "Team 12") {
            return await team12Instance.get("/authors/").then((response) => {
                return response.data;
            }).catch((error) => {
                if (error.response) {
                    console.log(error.response)
                }
                return [];
            });
        }
    }

    async declineRemoteFollowRequest(remoteNode, foreignID) {
        let authorID = getCurrentAuthorID();
        await this.getRemoteJWT(remoteNode);
        if (remoteNode === "Team 12") {
            return await team12Instance.post("/friendrequest/reject_external/sender/" + foreignID + "/recipient/" + authorID + "/")
            .then((response) => {
                return response.data
            }).catch((error) => {
                if (error.response) {
                    console.log(error.response)
                }
            })
        } else if (remoteNode === "Team 13"){
            return await team13Instance.delete("/authors/" + foreignID + "/followRequest/" + authorID)
            .then((response) => {
                return response.data
            }).catch((error) => {
                if (error.response) {
                    console.log(error.response)
                }
            })
        }
    }

    async acceptRemoteFollowRequest(remoteNode, foreignID) {
        let authorID = getCurrentAuthorID();
        await this.getRemoteJWT(remoteNode);
        if (remoteNode === "Team 12") {
            return await team12Instance.post("/friendrequest/accept_external/sender/" + foreignID + "/recipient/" + authorID + "/")
            .then((response) => {
                return response.data
            }).catch((error) => {
                if (error.response) {
                    console.log(error.response)
                }
            })
        } else if (remoteNode === "Team 13"){
            return await team13Instance.put("/authors/" + foreignID + "/followers/" + authorID)
            .then((response) => {
                return response.data
            }).catch((error) => {
                if (error.response) {
                    console.log(error.response)
                }
            })
        }
    }
}

export default new RemoteAuthService();