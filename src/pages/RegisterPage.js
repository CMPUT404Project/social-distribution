import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

// Import Material UI Icons
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PersonIcon from '@mui/icons-material/Person';
import GitHubIcon from '@mui/icons-material/GitHub';
import ImageIcon from '@mui/icons-material/Image';
import LockIcon from '@mui/icons-material/Lock';

// Import Material UI Components
import IconButton from '@mui/material/IconButton';

function RegisterPage() {
    const navigate = useNavigate();
    const usernamePattern = /^[A-Za-z0-9]*$/;
    const gitPattern = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;
    const [values, setValues] = useState({
        username: sessionStorage.getItem('username'),
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
        var imageError = false;

        try {
            for (const value in values) {
                if (!values[value]) {
                    setErrorMessage("Please fill in all the fields")
                    throw("emptyError")
                };
            };

            if (!usernamePattern.test(values.username)) {
                setErrorMessage("Username can only contain letters and numbers");
                throw("usernameError")
            };
            if (!gitPattern.test(values.git)) {
                setErrorMessage("Invalid Git username");
                throw("gitError")
            };
            if (values.password !== values.confirmPassword) {
                setErrorMessage("Passwords do not match");
                throw("passMatchError")
            };

            await doesImageExist(values.imageUrl).then((value) => {
                if (!value) {imageError = true};
            });
            if (imageError) {
                setErrorMessage("Bad Image URL.");
                throw("imageError")
            };
    
            const gitUrl = "https://github.com/" + values.git;

            // TODO:
            // AXIOS FOR REGISTER USER
        
        } catch (error) {
            setShowValues({ ...showValues, showError: true });
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
            <div className="register-card">
                <span className="register-title">
                    REGISTER
                </span>
                <div className="error-container" style={showValues.showError ? {visibility: "visible"} : {visibility: "hidden"}}>
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
                            <GitHubIcon fontSize="large"/>
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
                            <ImageIcon fontSize="large"/>
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
        </div>
    )
}

export default RegisterPage;
