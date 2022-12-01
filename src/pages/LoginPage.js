import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ClipLoader from 'react-spinners/ClipLoader';

import AuthService from "../services/AuthService";


// Import Material UI Icons
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

// Import Material UI Components
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';

function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || "/homepage";
    const [values, setValues] = useState({
        username: sessionStorage.getItem('username') || "",
        password: "",
    });
    const [rememberMe, setRememberMe] = useState(false);
    const [showValues, setShowValues] = useState({
        showPassword: false,
        showError: false,
    })

    const [isLoading, setLoading] = useState(false);

    const [errorMessage, setErrorMessage] = useState('Please fill in all the fields');

    useEffect(() => {

    }, []);

    useEffect(() => {
        sessionStorage.setItem('username', values.username)
    }, [values.username])

    const handleClickShowPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword });
    };

    const handleInputChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const handleRememberChange = (event) => {
        setRememberMe(event.target.checked)
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            if (values.username && values.password) {
                const response = await AuthService.login(values.username, values.password, rememberMe)
                    .then(() => {
                        setLoading(false);
                        navigate(from, {replace: true})
                    }, error => {
                        return error
                    })
                if (response) {
                    throw response
                }
            } else {
                throw new Error("emptyField")
            }
        } catch (error) {
            setShowValues({ ...showValues, showError: true });
            if (error.message === "emptyField") {
                setErrorMessage("Please fill in the fields");
            } else if (!error.response) {
                setErrorMessage("Server did not respond");
            } else if (error.response.status === 401) {
                setErrorMessage("Username/password is incorrect");
            } else {
                setErrorMessage("Failed to login. Try again");
            }
            setLoading(false);
        };
    };

    return (
        <div className="container">
            {isLoading ? (
                <ClipLoader color={'#fff'} loading={isLoading} size={150} />
            ) : (
            <div className="login-card" >
                <span className="login-title">
                    LOGIN
                </span>
                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="input-container username">
                        <input 
                            className="input-field username"
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={values.username}
                            onChange={handleInputChange("username")}
                        />
                        <span className="input-field-focus"></span>
                        <span className="input-icon">
                            <PersonIcon fontSize="large"/>
                        </span>
                    </div>
                    <div className="input-container password">
                        <input 
                            className="input-field password"
                            type={values.showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            value={values.password}
                            onChange={handleInputChange("password")}
                        />
                        <span className="input-field-focus"></span>
                        <span className="input-icon">
                            <LockIcon fontSize="large"/>
                        </span>
                        <span className="show-password-icon">
                            <IconButton onClick={handleClickShowPassword}>
                                {values.showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                            </IconButton>
                        </span>
                    </div>
                    <div className="error-container" style={showValues.showError ? {visibility: "visible"} : {visibility: "hidden"}}>
                        <p className="error-message">{errorMessage}</p>
                    </div>
                    <div className="remember-container">
                        <FormControlLabel
                            control={<Checkbox
                                        checkedIcon={
                                            <CheckBoxOutlinedIcon sx={{color: "#bb397c"}}/>
                                        }
                                        checked={rememberMe}
                                    />}
                            label="Remember Me"
                            sx={{
                                fontFamily: "Arial, Helvetica, sans-serif"
                            }}
                            onChange={handleRememberChange}
                        />
                    </div>
                    <div className="login-btn-container">
                        <button className="login-btn">
                            LOGIN
                        </button>
                    </div>
                </form>
                <div className="register-link-container">
                    <Link className="register-link" to="/register">
                        Register
                    </Link>
                </div>
            </div>)};
        </div>
    )
}

export default LoginPage;
