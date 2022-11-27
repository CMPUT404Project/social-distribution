import { Avatar, Box, Card, Grid, Menu, MenuItem, TextField, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";

import AuthService from "../../services/AuthService";

let data = [
    {
        type: "post",
        // title of a post
        title: "A post title about a post about web dev",
        // id of the post
        id: "http://127.0.0.1:5454/authors/9de17f29c12e8f97bcbbd34cc908f1baba40658e/posts/764efa883dda1e11db47671c4a3bbd9e",
        // where did you get this post from?
        source: "http://lastplaceigotthisfrom.com/posts/yyyyy",
        // where is it actually from
        origin: "http://whereitcamefrom.com/posts/zzzzz",
        // a brief description of the post
        description: "This post discusses stuff -- brief",
        // The content type of the post
        // assume either
        // text/markdown -- common mark
        // text/plain -- UTF-8
        // application/base64
        // image/png;base64 // this is an embedded png -- images are POSTS. So you might have a user make 2 posts if a post includes an image!
        // image/jpeg;base64 // this is an embedded jpeg
        // for HTML you will want to strip tags before displaying
        contentType: "text/plain",
        content:
            "Þā wæs on burgum Bēowulf Scyldinga, lēof lēod-cyning, longe þrāge folcum gefrǣge (fæder ellor hwearf, aldor of earde), oð þæt him eft onwōc hēah Healfdene; hēold þenden lifde, gamol and gūð-rēow, glæde Scyldingas. Þǣm fēower bearn forð-gerīmed in worold wōcun, weoroda rǣswan, Heorogār and Hrōðgār and Hālga til; hȳrde ic, þat Elan cwēn Ongenþēowes wæs Heaðoscilfinges heals-gebedde. Þā wæs Hrōðgāre here-spēd gyfen, wīges weorð-mynd, þæt him his wine-māgas georne hȳrdon, oð þæt sēo geogoð gewēox, mago-driht micel. Him on mōd bearn, þæt heal-reced hātan wolde, medo-ærn micel men gewyrcean, þone yldo bearn ǣfre gefrūnon, and þǣr on innan eall gedǣlan geongum and ealdum, swylc him god sealde, būton folc-scare and feorum gumena. Þā ic wīde gefrægn weorc gebannan manigre mǣgðe geond þisne middan-geard, folc-stede frætwan. Him on fyrste gelomp ǣdre mid yldum, þæt hit wearð eal gearo, heal-ærna mǣst; scōp him Heort naman, sē þe his wordes geweald wīde hæfde. Hē bēot ne ālēh, bēagas dǣlde, sinc æt symle. Sele hlīfade hēah and horn-gēap: heaðo-wylma bād, lāðan līges; ne wæs hit lenge þā gēn þæt se ecg-hete āðum-swerian 85 æfter wæl-nīðe wæcnan scolde. Þā se ellen-gǣst earfoðlīce þrāge geþolode, sē þe in þȳstrum bād, þæt hē dōgora gehwām drēam gehȳrde hlūdne in healle; þǣr wæs hearpan swēg, swutol sang scopes. Sægde sē þe cūðe frum-sceaft fīra feorran reccan",
        // the author has an ID where by authors can be disambiguated
        author: {
            type: "author",
            // ID of the Author
            id: "http://127.0.0.1:5454/authors/9de17f29c12e8f97bcbbd34cc908f1baba40658e",
            // the home host of the author
            host: "http://127.0.0.1:5454/",
            // the display name of the author
            displayName: "Lara Croft",
            // url to the authors profile
            url: "http://127.0.0.1:5454/authors/9de17f29c12e8f97bcbbd34cc908f1baba40658e",
            // HATEOS url for Github API
            github: "http://github.com/laracroft",
            // Image from a public domain (optional, can be missing)
            profileImage: "https://i.imgur.com/k7XVwpB.jpeg",
        },
        // categories this post fits into (a list of strings
        categories: ["web", "tutorial"],
        // comments about the post
        // return a maximum number of comments
        // total number of comments for this post
        count: 1023,
        // the first page of comments
        comments:
            "http://127.0.0.1:5454/authors/9de17f29c12e8f97bcbbd34cc908f1baba40658e/posts/de305d54-75b4-431b-adb2-eb6b9e546013/comments",
        // commentsSrc is OPTIONAL and can be missing
        // You should return ~ 5 comments per post.
        // should be sorted newest(first) to oldest(last)
        // this is to reduce API call counts
        commentsSrc: {
            type: "comments",
            page: 1,
            size: 5,
            post: "http://127.0.0.1:5454/authors/9de17f29c12e8f97bcbbd34cc908f1baba40658e/posts/764efa883dda1e11db47671c4a3bbd9e",
            id: "http://127.0.0.1:5454/authors/9de17f29c12e8f97bcbbd34cc908f1baba40658e/posts/de305d54-75b4-431b-adb2-eb6b9e546013/comments",
            comments: [
                {
                    type: "comment",
                    author: {
                        type: "author",
                        // ID of the Author (UUID)
                        id: "http://127.0.0.1:5454/authors/1d698d25ff008f7538453c120f581471",
                        // url to the authors information
                        url: "http://127.0.0.1:5454/authors/1d698d25ff008f7538453c120f581471",
                        host: "http://127.0.0.1:5454/",
                        displayName: "Greg Johnson",
                        // HATEOS url for Github API
                        github: "http://github.com/gjohnson",
                        // Image from a public domain
                        profileImage: "https://i.imgur.com/k7XVwpB.jpeg",
                    },
                    comment: "Sick Olde English",
                    contentType: "text/markdown",
                    // ISO 8601 TIMESTAMP
                    published: "2015-03-09T13:07:04+00:00",
                    // ID of the Comment (UUID)
                    id: "http://127.0.0.1:5454/authors/9de17f29c12ed8f97bcbbd34cc908f1baba40658e/posts/de305d54-75b4-431b-adb2-eb6b9e546013/comments/f6255bb01c648fe967714d52a89e8e9c",
                },
                {
                    type: "comment",
                    author: {
                        type: "author",
                        // ID of the Author (UUID)
                        id: "http://127.0.0.1:5454/authors/1d698d2d5ff008f7538453c120f581471",
                        // url to the authors information
                        url: "http://127.0.0.1:5454/authors/1d698d2d5ff008f7538453c120f581471",
                        host: "http://127.0.0.1:5454/",
                        displayName: "Greg asdad",
                        // HATEOS url for Github API
                        github: "http://github.com/gjasadohnson",
                        // Image from a public domain
                        profileImage: "https://i.imgur.com/k7XVwpB.jpeg",
                    },
                    comment: "Sick asdasdsd English",
                    contentType: "text/markdown",
                    // ISO 8601 TIMESTAMP
                    published: "2015-03-09T13:07:04+00:00",
                    // ID of the Comment (UUID)
                    id: "http://127.0.0.1:5454/authors/9de17f29c12e8f97bcbbd34cc908f1baba40658e/posts/de305d54-75b4-431b-adb2-eb6b9e546013/comments/f6255bb01c648fe967714d52a89e8e9c",
                },
            ],
        },
        // ISO 8601 TIMESTAMP
        published: "2015-03-09T13:07:04+00:00",
        // visibility ["PUBLIC","FRIENDS"]
        visibility: "PUBLIC",
        // for visibility PUBLIC means it is open to the wild web
        // FRIENDS means if we're direct friends I can see the post
        // FRIENDS should've already been sent the post so they don't need this
        unlisted: false,
        // unlisted means it is public if you know the post name -- use this for images, it's so images don't show up in timelines
    },
    {
        type: "post",
        // title of a post
        title: "btung custom post",
        // id of the post
        id: "http://127.0.0.1:5454/authors/9de17f29c12e8f9cbbd34cc908f1baba40658e/posts/764efa883dda1e11db47671c4a3bbd9e",
        // where did you get this post from?
        source: "http://lastplaceigotthisfrom.com/posts/yyyyy",
        // where is it actually from
        origin: "http://whereitcamefrom.com/posts/zzzzz",
        // a brief description of the post
        description: "This post discusses stuff -- brief",
        // The content type of the post
        // assume either
        // text/markdown -- common mark
        // text/plain -- UTF-8
        // application/base64
        // image/png;base64 // this is an embedded png -- images are POSTS. So you might have a user make 2 posts if a post includes an image!
        // image/jpeg;base64 // this is an embedded jpeg
        // for HTML you will want to strip tags before displaying
        contentType: "text/plain",
        content: "random",
        // the author has an ID where by authors can be disambiguated
        author: {
            type: "author",
            // ID of the Author
            id: "http://127.0.0.1:5454/authors/9de17f29c12e8f97bcbbd34cc908f1baba40658e",
            // the home host of the author
            host: "http://127.0.0.1:5454/",
            // the display name of the author
            displayName: "byron tung",
            // url to the authors profile
            url: "http://127.0.0.1:5454/authors/9de17f29c12e8f97bcbbd34cc908f1baba40658e",
            // HATEOS url for Github API
            github: "http://github.com/laracroft",
            // Image from a public domain (optional, can be missing)
            profileImage: "https://i.imgur.com/k7XVwpB.jpeg",
        },
        // categories this post fits into (a list of strings
        categories: ["web", "tutorial"],
        // comments about the post
        // return a maximum number of comments
        // total number of comments for this post
        count: 1023,
        // the first page of comments
        comments:
            "http://127.0.0.1:5454/authors/9de17f29c12e8f97bcbbd34cc908f1baba40658e/posts/de305d54-75b4-431b-adb2-eb6b9e546013/comments",
        // commentsSrc is OPTIONAL and can be missing
        // You should return ~ 5 comments per post.
        // should be sorted newest(first) to oldest(last)
        // this is to reduce API call counts
        commentsSrc: {
            type: "comments",
            page: 1,
            size: 5,
            post: "http://127.0.0.1:5454/authors/9de17f29c12e8f97bcbbd34cc908f1baba40658e/posts/764efa883dda1e11db47671c4a3bbd9e",
            id: "http://127.0.0.1:5454/authors/9de17f29c12e8f97bcbbd34cc908f1baba40658e/posts/de305d54-75b4-431b-adb2-eb6b9e546013/comments",
            comments: [
                {
                    type: "comment",
                    author: {
                        type: "author",
                        // ID of the Author (UUID)
                        id: "http://127.0.0.1:5454/authors/1d698d25ff008f7538453c120f581471",
                        // url to the authors information
                        url: "http://127.0.0.1:5454/authors/1d698d25ff008f7538453c120f581471",
                        host: "http://127.0.0.1:5454/",
                        displayName: "Greg Johnson",
                        // HATEOS url for Github API
                        github: "http://github.com/gjohnson",
                        // Image from a public domain
                        profileImage: "https://i.imgur.com/k7XVwpB.jpeg",
                    },
                    comment: "Sick Olde English",
                    contentType: "text/markdown",
                    // ISO 8601 TIMESTAMP
                    published: "2015-03-09T13:07:04+00:00",
                    // ID of the Comment (UUID)
                    id: "http://127.0.0.1:5454/authors/9de17f29c12e8f97bcbbd34cc908f1baba40658e/posts/de305d54-75b4-431b-adb2-eb6b9e546013/comments/f6255bb01c648fe967714d52a89e8e9c",
                },
            ],
        },
        // ISO 8601 TIMESTAMP
        published: "2015-03-09T13:07:04+00:00",
        // visibility ["PUBLIC","FRIENDS"]
        visibility: "PUBLIC",
        // for visibility PUBLIC means it is open to the wild web
        // FRIENDS means if we're direct friends I can see the post
        // FRIENDS should've already been sent the post so they don't need this
        unlisted: false,
        // unlisted means it is public if you know the post name -- use this for images, it's so images don't show up in timelines
    },
];

export const Post = (props) => {
    const [show, setShow] = useState(false);
    const [anchor, setAnchor] = useState(null);
    const [comments, setComments] = useState([]);
    const [isCommentsSubmitted, setIsCommentSubmitted] = useState(false);

    const aID = JSON.parse(AuthService.retrieveCurrentUser()).id.split("/authors/")[1];
    const pID = props.data.id.split("/posts/")[1];

    // isSubmitted is used to let the webpage know to reload the comments
    useEffect(() => {
        axios
            .get("/authors/" + aID + "/posts/" + pID + "/comments", {
                headers: {
                    Authorization: "Bearer " + AuthService.getAccessToken(),
                },
            })
            .then((res) => {
                console.log("/authors/" + aID + "/posts/" + pID + "/comments")
                console.log(AuthService.getAccessToken())
                setComments(res.data.comments);
            })
            .catch((err) => console.log(err));
    }, [isCommentsSubmitted]);

    // let comments = props.data.comments;

    /* 
    Not implemented yet, but will check if you can follow/send friend request to user.
    */
    const onClickHandler = (e) => {
        setAnchor(e.currentTarget);
        setShow(!show);
    };

    /* 
    When making a comment, pressing the "Enter" key will be the trigger for posting a comment.
    */
    const handleEnter = (e) => {
        if (e.key === "Enter" && e.target.value !== "") {
            e.preventDefault();
            const postTextBox = e.target.value;

            let split = props.data.id.split("/");
            let aID = split[4];
            let pID = split[6];
            // TODO: data variable should be sent, postTextBox.value is the text that should be sent.
            let data = {
                type: "comment",
                author: JSON.parse(AuthService.retrieveCurrentUser()),
                comment: postTextBox,
                post: props.data.id.split("/posts/")[1],
                contentType: "text/plain",
            };

            const postAuthorID = props.data.author.id.split("/authors/")[1];
            axios
                .post("/authors/" + postAuthorID + "/inbox", data, {
                    headers: {
                        Authorization: "Bearer " + AuthService.getAccessToken(),
                        ContentType: "application/json",
                    },
                })
                .then(() => {
                    setIsCommentSubmitted(!isCommentsSubmitted);
                    e.target.value = "";
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };
    return (
        <Box style={{ display: "flex", flexDirection: "column", width: "70%" }}>
            {show && (
                <Menu onClose={() => setShow(!show)} open={show} anchorEl={anchor}>
                    <MenuItem>Follow</MenuItem>
                    <MenuItem>Send Friend Request</MenuItem>
                </Menu>
            )}
            <Card
                style={{
                    textAlign: "center",
                    padding: "2em",
                    margin: "2em 0 0",
                    borderRadius: "10px 10px 0 0",
                }}
                elevation={10}
            >
                <Box
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                    }}
                    onClick={onClickHandler}
                >
                    <Avatar alt="user image" src={props.data.author.profileImage} style={{ margin: "1ex 1ex" }} />
                    <Typography variant="h5">{props.data.author.displayName}</Typography>
                </Box>
                <Typography variant="h4">{props.data.title}</Typography>
                <Typography variant="h6" textAlign="left">
                    {props.data.content}
                </Typography>
                
            </Card>
            {/* slice is to prevent mutation of the original array of comments */}
            {comments.slice().reverse().map((com) => {
                return (
                    <Card
                        key={com.id}
                        elevation={10}
                        style={{
                            backgroundColor: "#D3D3D3",
                            borderRadius: "0",
                            display: "flex",
                        }}
                    >
                        <Avatar alt="user image" src={com["author"]["profileImage"]} style={{ margin: "1ex 1ex" }} />
                        <div>
                            <Typography variant="body1" padding="1em" fontWeight="bold">
                                {com.author.displayName}
                            </Typography>
                            <Typography variant="body1" padding="1em">
                                {com["comment"]}
                            </Typography>
                        </div>
                    </Card>
                );
            })}
            <TextField
                id="commentData"
                onKeyDown={handleEnter}
                label="Post a comment!"
                variant="filled"
                style={{
                    backgroundColor: "#E5E5E5",
                    borderRadius: "0 0 5px 5px",
                }}
            />
        </Box>
    );
};

function Stream() {
    const [posts, setPosts] = useState([]);

    const [accessToken, setAccessToken] = useState(
        localStorage.getItem("access_token") || sessionStorage.getItem("access_token")
    );
    const [refreshToken, setRefreshToken] = useState(
        localStorage.getItem("refresh_token") || sessionStorage.getItem("refresh_token")
    );

    useEffect(() => {
        const aID = JSON.parse(AuthService.retrieveCurrentUser()).id.split("/authors/")[1];
        axios
            .get("/authors/" + aID + "/inbox?type=posts", {
                headers: { Authorization: "Bearer " + accessToken },
            })
            .then((res) => {
                setPosts(res.data.items);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    let fakeData = data;
    return (
        <Grid container justifyContent="center" minHeight={"100%"}>
            {/* {fakeData.length === 0 ? <h1>bruh no posts</h1>:fakeData.map((d) => {
                return <Post key={d.id} data={d} accessToken={accessToken} />
            })} */}
            {posts.length === 0 ? (
                <h1>You currently have no posts!</h1>
            ) : (
                posts.map((post) => {
                    if (post.type === "post") {
                        return <Post key={post.id} data={post} />;
                    }
                })
            )}
        </Grid>
    );
}

export default Stream;
