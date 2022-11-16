/**
 * Some code was taken from the material UI <Menu> component documentation
 * https://mui.com/material-ui/react-menu/
 */

import {
    AppBar,
    Avatar,
    Box,
    Button,
    Container,
    Divider,
    IconButton,
    Menu,
    MenuItem,
    Toolbar,
    Tooltip,
    Typography,
} from "@mui/material";

import MenuIcon from '@mui/icons-material/Menu';

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import axios from "axios";

import { clearStorage, setAxiosAuthToken } from "../../utils";
import AuthService from "../../services/AuthService";
import "./NavBar.css";

const pages = ['Inbox', 'Friends', 'Github'];
// Keep logout last in array
const settings = ['Profile', 'Account', 'Logout'];

function NavBar() {
    const navigate = useNavigate();
    setAxiosAuthToken();
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);

    const [accessToken, setAccessToken] = useState(localStorage.getItem('access_token') || sessionStorage.getItem('access_token'));

    useEffect(() => {
        if (!accessToken) {
            navigate('/', {replace: true})
        }
    }, [accessToken, navigate]);

    const [user, setUser] = useState({});

    useEffect(() => {
        if (accessToken) {
            try {
                const decode = jwt_decode(accessToken)["author_id"].split("/authors");
                axios.get("/authors" + decode[1])
                    .then((res) => {
                        setUser(res["data"]);
                    })
                    .catch((err) => {
                        handleLogout();
                        console.log(err);
                    });
            } catch (error) {
                handleLogout();
            }
        }
    }, [accessToken]);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = (event) => {
        for (let page of pages) {
            if (event.target.innerText === page) {
                let link = page.toLowerCase();
                navigate("/" + link);
            }
        }
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = (event) => {
        if (event.target.innerText === "Logout") {
            handleLogout();
        } else {
            for (let setting of settings) {
                if (event.target.innerText === setting) {
                    let link = setting.toLowerCase();
                    navigate("/" + link);
                }
            }
        }
        setAnchorElUser(null);
    };

    const handleLogout = () => {
        setAccessToken("");
        clearStorage();
    }

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Typography
                        variant="h4"
                        component="a"
                        href="/homepage"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' }, 
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        Social Distribution
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            {pages.map((page) => (
                                <MenuItem key={page} onClick={handleCloseNavMenu}>
                                    <Typography textAlign="center" fontSize="20px">{page}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <Typography
                        variant="h4"
                        noWrap
                        component="a"
                        href=""
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        Social Distribution
                    </Typography>
                    <Box sx={{ flexGrow: 0, display: { xs: 'none', md: 'flex' }, marginLeft: 'auto', marginRight: '30px'}}>
                        {pages.map((page) => (
                            <Button
                                key={page}
                                onClick={handleCloseNavMenu}
                                sx={{ fontSize: '20px', my: 2, color: 'white', display: 'block', textTransform: 'none' }}
                            >
                                {page}
                            </Button>
                        ))}
                    </Box>

                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Open settings">
                            <IconButton
                                onClick={handleOpenUserMenu}
                                sx={{ color: "white", p: 0}}
                            >
                                <Avatar 
                                    alt="user image"
                                    src={user["profileImage"]}
                                    sx={{width: 60, height: 60}}
                                />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            {settings.map((setting) => (setting === "Logout") ? (
                                <div key={setting}>
                                    <Divider sx={{backgroundColor: "#d0d0d0"}}/>
                                    <MenuItem onClick={handleCloseUserMenu}>
                                        <Typography textAlign="center" fontSize="20px" color="red">{setting}</Typography>
                                    </MenuItem>
                                </div>
                            ) : (
                                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                                    <Typography textAlign="center" fontSize="20px">{setting}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default NavBar;
