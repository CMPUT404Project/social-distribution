import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ClipLoader from 'react-spinners/ClipLoader';

import NavBar from "../components/NavBar/NavBar";

function PostPage() {
    const {authorID, postID} = useParams();

    useEffect(() => {
        console.log(authorID, postID)
    })

    return (
        <>
        <NavBar />
            <div className="container">
                Post Page
            </div>
        </>
    )
}

export default PostPage;