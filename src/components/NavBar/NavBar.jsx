import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'

function NavBar() {
    // const [data, setData] = useState(null)
    // useEffect(() => {
    //     const url = ""
    //     fetch(url).then(data => 
    //         {
    //             setData(data);
    //         })
    // }, [])
    
    return (
    <AppBar color='primary' position='static'>
        <Toolbar>
            <Typography variant='h4' style={{marginRight:"40%", whiteSpace:"nowrap"}}>Social Distribution</Typography>
            <Box sx={{display:"flex", width:"100%", justifyContent:"space-evenly"}}>
                <IconButton 
                    href='home'
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
                    href='profile'
                    sx={{color:'white', mx:"2em"}}>
                    <Typography variant='h6'>Profile</Typography>
                </IconButton>
                </Box>
        </Toolbar>
    </AppBar>
  )
}

export default NavBar