import { Box, Container, Card, Typography} from '@mui/material'
import React from 'react'

const User = (props) => {
    return (
        <Card>
            {props.url}
            <h1>{props.displayName}</h1>
        </Card>
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
            }
        ]
    }
    let users = data.items.map((item) => <User key={item.id} value={item}/>)
    console.log(users)
    return (
        <Container >
            {data.items.map((d) => {
                return (<User props={d}/>)
            })}
        </Container>

    )
}
