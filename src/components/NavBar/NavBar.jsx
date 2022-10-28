import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import jwt_decode from "jwt-decode";

function NavBar() {
    const [host, setHost] = useState("")
    const [authorID, setauthorID] = useState("")
    useEffect(() => {
        const token = sessionStorage.getItem("access_token") || localStorage.getItem("access_token")
        const decode = jwt_decode(token, {payload:true})["author_id"].split("/authors")
        setHost(decode[0])
        setauthorID(decode[1])
        console.log(decode)
    }, [])
    
    return (
    <AppBar color='primary' position='static'>
        <Toolbar>
            <Typography variant='h4' style={{marginRight:"40%", whiteSpace:"nowrap"}}>Social Distribution</Typography>
            <Box sx={{display:"flex", width:"100%", justifyContent:"space-evenly"}}>
                <IconButton 
                    href='/'
                    sx={{color:'white', mx:"2em"}}>
                    <Typography variant='h6'>Home</Typography>
                </IconButton>
                <IconButton 
                    href='friends'
                    sx={{color:'white', mx:"2em"}}>
                    <Typography variant='h6'>Friends</Typography>
                </IconButton>
                {/* use User.profileImage when User is done */}
                <IconButton 
                    href={'authors' + authorID}
                    sx={{color:'white', mx:"2em"}}>
                    <Typography variant='h6'>Profile</Typography>
                </IconButton>
                </Box>
        </Toolbar>
    </AppBar>
  )
}

export default NavBar