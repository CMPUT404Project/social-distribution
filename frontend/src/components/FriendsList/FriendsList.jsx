import {Card, Typography, Grid} from '@mui/material'
import React from 'react'
import "./FriendsList.css"

export const User = (props) => {
    let displayName = props.data.displayName
    let github = props.data.github
    let profileImage = props.data.profileImage ? props.data.profileImage : "https://imgur.com/gallery/AizUHEf"
    return (
        <Grid>
            <Card className='hoverCard' style={{margin:3, padding:"5% 5%", cursor:"pointer"}} elevation={15} onClick={() => {window.open(props.data.url)}}>
                <img style={{borderRadius:"50%", height:"150px", width:"150px", objectPosition:"center", objectFit:"cover", marginBottom:"1em"}} src={profileImage} /> 
                <Typography variant="h4">{displayName}</Typography>
                <Typography variant="h6">{github}</Typography>
            </Card>
        </Grid>
    )
}

export const FriendsList = () => {
    var data = {
        type: "authors",      
        items:[
            {
                type:"author",
                id:"http://127.0.0.1:5454/authors/1d698d25ff008f7538453c120f581471",
                url:"http://127.0.0.1:5454/authors/1d698d25ff008f7538453c120f581471",
                host:"http://127.0.0.1:5454/",
                displayName:"Greg Johnson",
                github: "http://github.com/gjohnson",
                profileImage: "https://i.imgur.com/k7XVwpB.jpeg"
            },
            {
                type:"author",
                id:"http://127.0.0.1:5454/authors/9de17f29c12e8f97bcbbd34cc908f1baba40658e",
                host:"http://127.0.0.1:5454/",
                displayName:"Lara Croft",
                url:"http://127.0.0.1:5454/authors/9de17f29c12e8f97bcbbd34cc908f1baba40658e",
                github: "http://github.com/laracroft",
                profileImage: "https://i.imgur.com/k7XVwpB.jpeg"
            },
            {
                type:"author",
                id:"http://127.0.0.1:8000/authors/9de17f29c12e8f97bcbbd34cc908f1658e",
                host:"http://127.0.0.1:8000/",
                displayName:"Byron Tung",
                url:"http://127.0.0.1:8000/authors/9de17f29c12e8f97bcbbd34cc908f1658e",
                github: "http://github.com/byrontung",
                profileImage: "https://i.imgur.com/LRoLTlK.jpeg"
            }
        ]
    }
    let users = data.items
    // console.log(users)
    return (
        < >
            {users.map((d) => {
                // return (<Card style={{margin:20}}>{d.displayName}</Card>)
                return(<User key={d.id} data={d}></User>)
            })}
        </>

    )
}
