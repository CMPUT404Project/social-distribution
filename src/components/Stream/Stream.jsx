import { Box, Card, Grid, Typography } from "@mui/material";
import axios from "axios";
import jwtDecode from "jwt-decode";
import React, { useEffect, useState } from "react";

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
    console.log(props);
    return (
        <Box style={{ display: "flex", flexDirection: "column", width:"70%"}}>
            <Card
                style={{
                    textAlign: "center",
                    padding: "2em",
                    margin: "2em 0 0",
                    borderRadius: "10px 10px 0 0"
                }}
                elevation={10}
            >
                <Typography variant="h4">{props.data.title}</Typography>
                <Typography variant="h6">{props.data.content}</Typography>
            </Card>
            <Card
                elevation={10}
                style={{ backgroundColor: "#D3D3D3"}}
            >
                <Typography variant="body1" border="1px solid" padding="1em">
                    Posted comment
                </Typography>
                <Typography variant="body1" border="1px solid" padding="1em">
                    Posted comment
                </Typography>
            </Card>
        </Box>
    );
};

function Stream() {
    const [post, setPost] = useState({});
    useEffect(() => {
        const token =
            sessionStorage.getItem("access_token") ||
            localStorage.getItem("access_token");
        const aID = jwtDecode(token)["author_id"].split("/authors")[1];
        axios
            .get("services/authors/" + aID + "posts", {
                headers: { Authorization: "Bearer " + token },
            })
            .then((res) => {
                setPost(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);
    let fakeData = data;
    return (
        <Grid container justifyContent="center" minHeight={"100%"}>
            {fakeData.map((d) => {
                return <Post key={d.id} data={d} />;
            })}
        </Grid>
    );
}

export default Stream;
