import axios from "axios";

import { getCurrentAuthorID, retrieveCurrentAuthor } from "../utils";


const team12Instance = axios.create({
    baseURL: "https://true-friends-404.herokuapp.com"
})

const team13Instance = axios.create({
    baseURL: "https://cmput404-team13.herokuapp.com"
})

const team16Instance = axios.create({
    baseURL: "https://team-sixteen.herokuapp.com",
    auth: {
        username: process.env.REACT_APP_T16USER,
        password: process.env.REACT_APP_T16PASS
    },
})

class RemoteAuthService {
    async getRemoteJWT(remoteNode) {
        if (remoteNode === "Team 12") {
            await team12Instance.post("/api/token/obtain/", {
                email: process.env.REACT_APP_T12USER,
                password: process.env.REACT_APP_T12PASS
            }).then((response) => {
                team12Instance.defaults.headers.common["Authorization"] = "Bearer " + response.data.access
            })
        } else if (remoteNode === "Team 13") {
            await team13Instance.put("/users", {
                username: process.env.REACT_APP_T13USER,
                password: process.env.REACT_APP_T13PASS
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
        } else if (remoteNode === "Team 16") {
            return await team16Instance.get(`/authors/${authorID}`).then((response) => {
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
        } else if (remoteNode === "Team 16") {
            return await team16Instance.get("/authors/").then((response) => {
                return response.data.items
            }).catch((error) => {
                if (error.response) {
                    console.log(error.response)
                }
                return [];
            });
        }
    }

    async getRemoteFollowStatus(remoteNode, foreignID) {
        let authorID = getCurrentAuthorID();
        await this.getRemoteJWT(remoteNode);
        if (remoteNode === "Team 12") {
            return await team12Instance.get(`/authors/${foreignID}/followers/`)
            .then((response) => {
                return response.data.some((follower) => {
                    console.log("follower.sender_id")
                    console.log(follower.sender_id)
                    console.log("authorID")
                    console.log(authorID)
                    if (follower.sender_id === authorID) {
                        console.log("sender_id === authorID; returns true")
                        return true
                    }
                    return false
                })
            }).catch((error) => {
                if (error.response) {
                    console.log(error.response)
                }
            })
        } else if (remoteNode === "Team 13"){
            return await team13Instance.get("/authors/" + foreignID + "/followers/" + authorID)
            .then((response) => {
                if (response.data.id) {
                    return true
                }
                return false
            }).catch((error) => {
                if (error.response) {
                    console.log(error.response)
                }
                return false
            })
        }
    }

    async sendRemoteFollowRequest(remoteNode, foreignID) {
        let currentAuthor = retrieveCurrentAuthor();
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
            return await team13Instance.post(`/authors/${authorID}/followers/${foreignID}`, {
                author: {
                    host: "https://social-distribution-404.herokuapp.com",
                    id: authorID,
                    displayName: currentAuthor.displayName
                }
            })
            .then((response) => {
                return response.data
            }).catch((error) => {
                if (error.response) {
                    console.log(error.response)
                }
            })
        } 
        else if (remoteNode === "Team 16"){
            return await this.getRemoteAuthor("Team 16", foreignID).then((res) => {
                team16Instance.post("/authors/" + foreignID + "/inbox/", {
                    type: "Follow",
                    summary: currentAuthor.displayName + " wants to follow you",
                    actor: currentAuthor,
                    object: res
                })
                .then((response) => {
                    return response.data
                })
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
            return await team12Instance.post(`/friendrequest/reject_external/sender/${foreignID}/recipient/${authorID}/`)
            .then((response) => {
                return response.data
            }).catch((error) => {
                if (error.response) {
                    console.log(error.response)
                }
            })
        } else if (remoteNode === "Team 13"){
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

    async acceptRemoteFollowRequest(remoteNode, foreignID) {
        let authorID = getCurrentAuthorID();
        await this.getRemoteJWT(remoteNode);
        if (remoteNode === "Team 12") {
            return await team12Instance.post(`/friendrequest/accept_external/sender/${foreignID}/recipient/${authorID}/`)
            .then((response) => {
                return response.data
            }).catch((error) => {
                if (error.response) {
                    console.log(error.response)
                }
            })
        } else if (remoteNode === "Team 13"){
            return await team13Instance.put(`/authors/${authorID}/followers/${foreignID}`)
            .then((response) => {
                return response.data
            }).catch((error) => {
                if (error.response) {
                    console.log(error.response)
                }
            })
        } else if (remoteNode === "Team 16") {
            return await team16Instance.put("/authors/" + foreignID + "/followers/" + authorID)
            .then((response) => {
                return response.data
            }).catch((error) => {
                if (error.response) {
                    console.log(error.response)
                }
            })
        }
    }
    async getRemotePost(remoteNode, authorID, postID) {
        await this.getRemoteJWT(remoteNode)
        if (remoteNode === "Team 12") {
            return await team12Instance.get("/posts/" + postID + "/", {validateStatus: function (status) {
                return status < 500;
            }})
            .then((response) => {
                return response
            }).catch((error) => {
                console.log(error)
            })
        }
        else if (remoteNode === "Team 13") {
            return await team13Instance.get("/authors/" + authorID + "/posts/" + postID, {validateStatus: function (status) {
                return status < 500;
            }})
            .then((response) => {
                return response
            }).catch((error) => {
                console.log(error)
            })
        }
    }

    async createRemotePost(remoteNode, post, visibility="") {
        await this.getRemoteJWT(remoteNode);
        let authorID = getCurrentAuthorID();
        let currentAuthor = retrieveCurrentAuthor();
        let authorUsername = sessionStorage.getItem("username");
        let headers = {"Content-Type": "application/json"}
        try {
            if (remoteNode === "Team 12") {
                let team12Data = {...post};
                // author is not required since it is sent with the URI
                delete team12Data["author"];
                // Do not include categories
                // https://discord.com/channels/1042662487025274962/1042662487025274965/1046152315641528380
                delete team12Data["categories"];
                team12Data.id = team12Data.id.split("/posts/")[1];
                await team12Instance.post(`/authors/${authorID}/${authorUsername}/posts/`, team12Data, {headers})
            } else if (remoteNode === "Team 13") {
                let team13data = {...post};
                // clean up data of post
                delete team13data["categories"];
                delete team13data["count"];
                team13data.author = { id: authorID, displayName: currentAuthor.displayName };
                team13data.originalAuthor = { id: post.author.id.split("/authors/")[1], displayName: post.author.displayName };
                team13data.id = post.id.split("/posts/")[1];
                //create post on their server
                const createdPost = await team13Instance.put(`/authors/${authorID}/posts`, team13data, {headers})
                //call endpoint depending on visibility for distribution
                if (visibility.includes("PUBLIC")) {
                    await team13Instance.post(`/inbox/public/${authorID}/${createdPost.data.id}`, {}, {headers})
                } else if (visibility.includes("FRIEND")) {
                    await team13Instance.post(`/inbox/friend/${authorID}/${createdPost.data.id}`, {}, {headers})
                }
            } else if (remoteNode === "Team 16") {
                await team16Instance.post(`/authors/${authorID}/posts/`, post, {headers})
            }
        } catch (error) {
            if (error.response) {
                console.log(error.response.status);
                console.log(error.response.data);
            }
        }
    }
    
    async updateRemotePost(remoteNode, authorID, postID, body) {
        await this.getRemoteJWT(remoteNode);
        if (remoteNode === "Team 12") {
            return await team12Instance.put(`/posts/${postID}/`, body)
            .then((response) => {
                return response
            }).catch((error) => {
                // console.log(error);
                return error;
            })
        } else if (remoteNode === "Team 13") {
            return await team13Instance.post(`/authors/${authorID}/posts/${postID}`)
            .then((response) => {
                return response;
            }).catch((error) => {
                // console.log(error);
                return error;
            })
        }
    }

    async deleteRemotePost(remoteNode, authorID, postID) {
        await this.getRemoteJWT(remoteNode);
        if (remoteNode === "Team 12") {
            return await team12Instance.delete(`/posts/${postID}/`)
            .then((response) => {
                return response
            }).catch((error) => {
                // console.log(error);
                return error;
            })
        } else if (remoteNode === "Team 13") {
            return await team13Instance.delete(`/authors/${authorID}/posts/${postID}`)
            .then((response) => {
                return response;
            }).catch((error) => {
                // console.log(error);
                return error;
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
        else if (remoteNode === "Team 13"){
            return await team13Instance.get("/authors/" + authorID + "/posts/" + postID + "/comments")
            .then((response) => {
                return response.data
            }).catch((error) => {
                console.log(error)
            })
        }

    } 

    async getRemoteLikesOnPost(remoteNode, authorID, postID) {
        await this.getRemoteJWT(remoteNode)
        if (remoteNode === "Team 12"){
            return await team12Instance.get("/posts/" + postID + "/likes/")
            .then((response) => {
                // console.log(response)
                return response.data
            }).catch((error) => {
                console.log(error)
            })
        }
        else if (remoteNode === "Team 13"){
            return await team13Instance.get("/authors/" + authorID + "/posts/" + postID + "/likes")
            .then((response) => {
                return response.data
            }).catch((error) => {
                console.log(error)
            })
        }

    }

    async getRemoteLikesOnComment(remoteNode, authorID, postID, commentID) {
        await this.getRemoteJWT(remoteNode)
        if (remoteNode === "Team 12"){
            // return await team12Instance.get("/authors/" + currentAuthorID + "/" + currentAuthorUsername + "/posts/" + commentID + "/likes/")
            return await team12Instance.get("/comments/" + commentID + "/likes/")
            .then((response) => {
                return response.data
            }).catch((error) => {
                console.log(error)
            })
        }
        else if (remoteNode === "Team 13"){
            return await team13Instance.get("/authors/" + authorID + "/posts/" + postID + "/comments/" + commentID + "/likes")
            .then((response) => {
                return response.data
            }).catch((error) => {
                console.log(error)
            })
        }
    }

    async sendLikeRemotePost(remoteNode, authorID, postID){
        const currentAuthorID = getCurrentAuthorID()
        const currentAuthorUsername = sessionStorage.getItem('username') 
        await this.getRemoteJWT(remoteNode);
        if (remoteNode === "Team 12"){
            return await team12Instance.post("/authors/" + currentAuthorID + "/" + currentAuthorUsername + "/posts/" + postID + "/likes/")
            .then((response) => {
                return response.data
            }).catch((error) => {
                console.log(error)
            })
        }
        // from swagger, body is not required
        else if (remoteNode === "Team 13"){
            return await team13Instance.post("/authors/" + authorID + "/posts/" + postID + "/likes/" + currentAuthorID)
            .then((response) => {
                // return response.data
                console.log(response)
            }).catch((error) => {
                console.log(error)
            })
        }
    }

    async sendLikeRemoteComment(remoteNode, commentID, authorID, postID){
        await this.getRemoteJWT(remoteNode);
        if (remoteNode === "Team 12"){
            const authorUsername = sessionStorage.getItem("username")
            return await team12Instance.post("/authors/" + authorID + "/" + authorUsername  + "/comments/" + commentID + "/likes/")
            .then((response) => {
                return response.data
            }).catch((error) => {
                console.log(error)
            })
        }
        else if (remoteNode === "Team 13"){
            const currentAuthorID = getCurrentAuthorID()
            return await team13Instance.post("/authors/" + authorID + "/posts/" + postID + "/comments/" + commentID + "/likes/" + currentAuthorID)
            .then((response) => {
                // console.log(response)
                return response.data
            }).catch((error) => {
                console.log(error)
            })
        }
    }
}

export default new RemoteAuthService();
