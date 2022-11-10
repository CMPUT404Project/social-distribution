import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ClipLoader from 'react-spinners/ClipLoader';
import jwt_decode from "jwt-decode";
import axios from 'axios';

// Import Material UI Icons
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PersonIcon from '@mui/icons-material/Person';
import GitHubIcon from '@mui/icons-material/GitHub';
import ImageIcon from '@mui/icons-material/Image';
import LockIcon from '@mui/icons-material/Lock';

// Import Material UI Components
import IconButton from '@mui/material/IconButton';

function RegisterPage() {
    const navigate = useNavigate();
    const usernamePattern = /^[A-Za-z0-9]{1,30}$/;
    const gitPattern = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;
    const [values, setValues] = useState({
        username: sessionStorage.getItem('username'),
        displayName: "",
        git: "",
        imageUrl: "",
        password: "",
        confirmPassword: "",
    });
    const [showValues, setShowValues] = useState({
        showPassword: false,
        showConfirmPassword: false,
        showError: false,
    });
    const [accessToken, setAccessToken] = useState(localStorage.getItem('access_token') || sessionStorage.getItem('access_token'));
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refresh_token') || sessionStorage.getItem('refresh_token'));
    const [isLoading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('Please fill in all the fields');

    useEffect(() => {
        sessionStorage.setItem('username', values.username)
    }, [values.username])

    useEffect(() => {
        if (accessToken) {
            sessionStorage.setItem('access_token', accessToken);
            sessionStorage.setItem('refresh_token', refreshToken);
        }
    }, [accessToken, refreshToken])

    const handleClickShowPassword = () => {
        setShowValues({ ...showValues, showPassword: !showValues.showPassword });
    };

    const handleClickShowConfirmPassword = () => {
        setShowValues({ ...showValues, showConfirmPassword: !showValues.showConfirmPassword });
    };

    const handleInputChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const toLogin = () => {
        navigate("/");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        var imageError = false;

        try {
            setLoading(true);
            for (const value in values) {
                if (!values[value]) {
                    setErrorMessage("Please fill in all the fields")
                    throw new Error("emptyField")
                };
            };

            if (!usernamePattern.test(values.username)) {
                setErrorMessage("Username can only contain letters and numbers");
                throw new Error("usernameError")
            };
            if (!gitPattern.test(values.git)) {
                setErrorMessage("Invalid Git username");
                throw new Error("gitError")
            };
            if (values.password !== values.confirmPassword) {
                setErrorMessage("Passwords do not match");
                throw new Error("passMatchError")
            };

            await doesImageExist(values.imageUrl).then((value) => {
                if (!value) { imageError = true };
            });
            if (imageError) {
                setErrorMessage("Bad Image URL.");
                throw new Error("imageError")
            };

            const gitUrl = "https://github.com/" + values.git;

            const registerResponse = await axios.post('api/users/register/',
                {
                    username: values.username,
                    password: values.password
                }
            );
            setAccessToken(registerResponse.data.access);
            setRefreshToken(registerResponse.data.refresh);
            await axios.put(jwt_decode(registerResponse.data.access).author_id,
                {
                    displayName: values.displayName,
                    github: gitUrl,
                    profileImage: values.imageUrl
                },
                {
                    headers: {
                        "Authorization": "Bearer " + registerResponse.data.access
                    }
                }
            );
            navigate("/homepage", {replace: true})

        } catch (error) {
            setShowValues({ ...showValues, showError: true });
            if (error.response) {
                if (error.response.status === 500) {
                    setErrorMessage("Server did not respond");
                } else if (error.response.status === 400) {
                    setErrorMessage("Username is taken");
                } else {
                    setErrorMessage("Failed to register. Try again");
                }
            }
            setLoading(false);
        }
    };

    /**
     * Code from https://stackoverflow.com/a/68333175
     * By Caleb Taylor
     */
    const doesImageExist = (url) => new Promise((resolve) => {
        const img = new Image();
        img.src = url;
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
    });

    return (
        <div className="container">
            {isLoading ?
                (
                    <ClipLoader color={'#fff'} loading={isLoading} size={150} />
                ) : (
                    <div className="register-card">
                        <span className="register-title">
                            REGISTER
                        </span>
                        <div className="error-container" style={showValues.showError ? { visibility: "visible" } : { visibility: "hidden" }}>
                            <p className="error-message">{errorMessage}</p>
                        </div>
                        <form className="register-form" onSubmit={handleSubmit}>
                            <div className="input-container username">
                                <input
                                    className="input-field username"
                                    type="text"
                                    name="username"
                                    placeholder="Username"
                                    value={values.username}
                                    onChange={handleInputChange("username")} />
                                <span className="input-field-focus"></span>
                                <span className="input-icon">
                                    <PersonIcon fontSize="large" />
                                </span>
                            </div>
                            <div className="input-container display-name">
                                <input
                                    className="input-field display-name"
                                    type="text"
                                    name="displayName"
                                    placeholder="Display Name"
                                    value={values.displayName}
                                    onChange={handleInputChange("displayName")} />
                                <span className="input-field-focus"></span>
                                <span className="input-icon">
                                    <AccountCircleIcon fontSize="large" />
                                </span>
                            </div>
                            <div className="input-container git-username">
                                <input
                                    className="input-field git-username"
                                    type="text"
                                    name="git-username"
                                    placeholder="Git Username"
                                    value={values.git}
                                    onChange={handleInputChange("git")} />
                                <span className="input-field-focus"></span>
                                <span className="input-icon">
                                    <GitHubIcon fontSize="large" />
                                </span>
                            </div>
                            {/* Possibly implement image choosing in the future */}
                            <div className="input-container image-url">
                                <input
                                    className="input-field image-url"
                                    type="text"
                                    name="image-url"
                                    placeholder="Profile Image URL"
                                    value={values.imageUrl}
                                    onChange={handleInputChange("imageUrl")} />
                                <span className="input-field-focus"></span>
                                <span className="input-icon">
                                    <ImageIcon fontSize="large" />
                                </span>
                            </div>
                            <div className="input-container">
                                <input
                                    className="input-field password"
                                    type={showValues.showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Password"
                                    value={values.password}
                                    onChange={handleInputChange("password")}
                                />
                                <span className="input-field-focus"></span>
                                <span className="input-icon">
                                    <LockIcon fontSize="large" />
                                </span>
                                <span className="show-password-icon">
                                    <IconButton onClick={handleClickShowPassword}>
                                        {showValues.showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                    </IconButton>
                                </span>
                            </div>
                            <div className="input-container confirm-password">
                                <input
                                    className="input-field confirm-password"
                                    type={showValues.showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    placeholder="Confirm Password"
                                    value={values.confirmPassword}
                                    onChange={handleInputChange("confirmPassword")}
                                />
                                <span className="input-field-focus"></span>
                                <span className="show-password-icon">
                                    <IconButton onClick={handleClickShowConfirmPassword}>
                                        {showValues.showConfirmPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                    </IconButton>
                                </span>
                            </div>
                            <div className="register-btn-container">
                                <button className="register-btn">
                                    REGISTER
                                </button>
                            </div>
                        </form>
                        <div className="signin-link-container">
                            <button className="signin-link" onClick={toLogin}>
                                Already have an account? Sign in
                            </button>
                        </div>
                    </div>
                )}
        </div>
    )
}

export default RegisterPage;
