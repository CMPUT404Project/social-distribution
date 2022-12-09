import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ClipLoader from 'react-spinners/ClipLoader';

import AuthService from "../services/AuthService";
import { regexPatterns, doesImageExist } from "../utils";

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
    const [isLoading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('Please fill in all the fields');

    useEffect(() => {
        sessionStorage.setItem('username', values.username)
    }, [values.username])

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
        var body = {};
        var imageError = false;

        try {
            setLoading(true);
            for (const value in values) {
                if (value !== "git" && value !== "imageUrl") {
                    if (!values[value]) {
                        setErrorMessage("Please fill in all required fields")
                        throw new Error("emptyField")
                    };
                }
            };

            if (!regexPatterns.namePattern.test(values.username)) {
                setErrorMessage("Username can only contain letters and numbers");
                throw new Error("usernameError")
            };
            if (!regexPatterns.namePattern.test(values.displayName)) {
                setErrorMessage("Display name can only contain letters and numbers");
                throw new Error("displayNameError")
            } else {
                body.displayName = values.displayName;
            };
            if (values.password !== values.confirmPassword) {
                setErrorMessage("Passwords do not match");
                throw new Error("passMatchError")
            };

            if (values.git) {
                if (!regexPatterns.gitPattern.test(values.git)) {
                    setErrorMessage("Invalid Git username");
                    throw new Error("gitError")
                } else {
                    body.github = "https://github.com/" + values.git.toLowerCase();
                }
            };

            if (values.imageUrl) {
                await doesImageExist(values.imageUrl).then((value) => {
                    if (!value) { imageError = true };
                });
                if (imageError) {
                    setErrorMessage("Could not load image");
                    throw new Error("imageError")
                } else {
                    body.profileImage = values.imageUrl
                };
            };

            const response = await AuthService.register(values.username, values.password, body)
                .then(() => {
                    navigate("/", {replace: true})
                }, error => {
                    return error
                })
            if (response) {
                throw response
            }
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
                            <p data-testid="register-error-message" className="error-message">{errorMessage}</p>
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
                                    placeholder="Git Username (Optional)"
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
                                    placeholder="Profile Image URL (Optional)"
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
