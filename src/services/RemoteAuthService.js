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

    async getRemoteAuthor(remoteNode, authorID) {
        await this.getRemoteJWT(remoteNode);
        if (remoteNode === "Team 12") {
            return await team12Instance.get(`/authors/${authorID}/`).then((response) => {
                return response.data;
            }).catch((error) => {
                if (error.response) {
                    console.log(error.response)
                }
                return error
            });
        } else if (remoteNode === "Team 13") {
            return await team13Instance.get(`/authors/${authorID}`).then((response) => {
                return response.data;
            }).catch((error) => {
                if (error.response) {
                    console.log(error.response)
                }
                return error
            });
        }
    }

    async getRemoteAuthors(remoteNode) {
        await this.getRemoteJWT(remoteNode);
        if (remoteNode === "Team 12") {
            return await team12Instance.get("/authors/").then((response) => {
                return response.data;
            }).catch((error) => {
                if (error.response) {
                    console.log(error.response)
                }
                return [];
            });
        } else if (remoteNode === "Team 13") {
            return await team13Instance.get("/authors?page=1&size=1000").then((response) => {
                return response.data.authorsPage;
            }).catch((error) => {
                if (error.response) {
                    console.log(error.response)
                }
                return [];
            });
        }
    }

    async sendRemoteFollowRequest(remoteNode, foreignID) {
        let authorID = getCurrentAuthorID();
        await this.getRemoteJWT(remoteNode);
        if (remoteNode === "Team 12") {
            let autherUsername = sessionStorage.getItem("username")
            return await team12Instance.post(`/friendrequest/from_external/19/${authorID}/${autherUsername}/send/${foreignID}/`)
            .then((response) => {
                return response.data
            }).catch((error) => {
                if (error.response) {
                    console.log(error.response)
                }
            })
        } else if (remoteNode === "Team 13"){
            return await team13Instance.post("/authors/" + authorID + "/followers/" + foreignID)
            .then((response) => {
                return response.data
            }).catch((error) => {
                if (error.response) {
                    console.log(error.response)
                }
            })
        }
    }

    async unfollowRemoteAuthor(remoteNode, foreignID) {
        let authorID = getCurrentAuthorID();
        await this.getRemoteJWT(remoteNode);
        if (remoteNode === "Team 12") {
            return await team12Instance.post(`/${authorID}/unfollow/${foreignID}`)
            .then((response) => {
                return response.data
            }).catch((error) => {
                if (error.response) {
                    console.log(error.response)
                }
            })
        } else if (remoteNode === "Team 13"){
            // /authors/{author_id}/followers/{foreign_author_id}
            return await team13Instance.delete(`/authors/${authorID}/followers/${foreignID}`)
            .then((response) => {
                return response.data
            }).catch((error) => {
                if (error.response) {
                    console.log(error.response)
                }
            })
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

    async getRemoteComments(remoteNode, authorID, postID) {
        await this.getRemoteJWT(remoteNode)
        if (remoteNode === "Team 12"){
            return await team12Instance.get("/posts/" + postID + "/comments/")
            .then((response) => {
                return response.data
            }).catch((error) => {
                console.log(error)
            })

        }
        // TODO: team 13 getting comments
        // else if (remoteNode === "Team 13"){
        //     RemoteAuthService.getRemoteJWT("Team 13")
        //     axios.get("/authors/" + authorID + "/posts/" + postID)
        // }
        
    } 

    async getRemoteLikesOnPost(remoteNode, authorID, postID) {
        await this.getRemoteJWT(remoteNode)
        if (remoteNode === "Team 12"){
            return await team12Instance.get("/posts/" + postID + "/likes/")
            .then((response) => {
                return response.data
            }).catch((error) => {
                console.log(error)
            })
        }
        // TODO: team 13 getting likes on a post
        // else if (remoteNode === "Team 13"){
        //     RemoteAuthService.getRemoteJWT("Team 13")
        //     axios.get("/authors/" + authorID + "/posts/" + postID)
        // }
        
    }

    async getRemoteLikesOnComment(remoteNode, authorID, postID, commentID) {
        await this.getRemoteJWT(remoteNode)
        if (remoteNode === "Team 12"){
            return await team12Instance.get("/comments/" + commentID + "/likes/")
            .then((response) => {
                return response.data
            }).catch((error) => {
                console.log(error)
            })
        }
        // TODO: team 13 getting likes on a comment
        // else if (remoteNode === "Team 13"){
        //     RemoteAuthService.getRemoteJWT("Team 13")
        // }
    }
}

export default new RemoteAuthService();