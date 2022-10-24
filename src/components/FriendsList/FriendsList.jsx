import {Card, Typography, Grid} from '@mui/material'
import React from 'react'
import "./FriendsList.css"

export const User = (props) => {
    let displayName = props.data.displayName
    let github = props.data.github
    let profileImage = props.data.profileImage ? props.data.profileImage : "https://i.imgur.com/w3UEu8o.jpeg"
    // var colours = ["red", "blue", "green"] // for future implementation
    var status = ["Friend", "True Friend", "Real Friend"]
    return (
        <Grid>
            <Card className='hoverCard' style={{margin:3, padding:"2% 2%", cursor:"pointer"}} elevation={15} onClick={() => {window.open(props.data.url)}}>
                <img style={{borderRadius:"50%", height:"100px", width:"100px", objectPosition:"center", objectFit:"cover"}} src={profileImage}/> 
                <Typography variant="h4" style={{display:"inline", padding:"0% 5%"}}>{displayName}</Typography>
                <Typography variant="h6" style={{display:"inline"}}>{github}</Typography>
                {/* Status of relationship is currently random for display */}
                <Typography variant="h7" style={{display:"inline", float:"right"}}>{status[Math.floor(Math.random() * status.length)]}</Typography> 
            </Card>
        </Grid>
    )
}



{/*
 get request for friend should AT LEAST return 
 {
    type: string // friend, true friend, real friend
    id: str      // url at where their profile originates from (could be from a different node?)
    host: str    // where the user originally had their user
    displayName str // 
 }type (of friend), id, host, displayName,  
 dasd
*/}

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
            },
            {
                type:"author",
                id:"http://127.0.0.1:8000/authors/9de17f29c12e8f97bcbbd34cc908fff1658e",
                host:"http://127.0.0.1:8000/",
                displayName:"Tyron Bung",
                url:"http://127.0.0.1:8000/authors/9de17f29c12e8f97bcbbd34cc908fff1658e",
                github: "http://github.com/tyronbung",
            },
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
