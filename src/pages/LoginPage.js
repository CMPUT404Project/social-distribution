import { useState, useEffect } from "react";
import axios from 'axios';

// Import Material UI Icons
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LockIcon from '@mui/icons-material/Lock';

// Import Material UI Components
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import Checkbox from '@mui/material/Checkbox';
// import TextField from '@mui/material/TextField';

import "./LoginPage.css";


function LoginPage() {
    const [values, setValues] = useState({
        username: "",
        password: "",
        showPassword: false,
      });
    // const [username, setUsername] = useState("");
    // const [password, setPassword] = useState("");
    // const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        console.log(values.username);
    }, [values.username]);

    const handleClickShowPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword });
    };

    const handleInputChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('api/auth/token/',
                {
                    username: values.username,
                    password: values.password
                }
            ).then(function (response) {
                alert('Login Successful')
            }
            ).catch(function (error) {
                alert('Login Failed')
            });
            
        } catch (err) {

        }

    };

    return (
        <div class="container">
            <div class="login-card">
                <span class="login-title">
                    LOGIN
                </span>
                <form class="login-form" onSubmit={handleSubmit}>
                    {/* <div class="input-container">
                        <TextField class="input-field"
                            required 
                            style={{padding: "0"}}
                            rows={1}
                            variant="outlined"
                            label="Username"
                            name="username" 
                            type="text"
                            onChange={e => outputter(e.target.value)}>
                        </TextField>
                        <span class="focus-input100"></span>
                        <span class="symbol-input100">
                            <PersonOutlineIcon fontSize="large"/>
                        </span>
                    </div> */}
                    <div class="input-container">
                        <input 
                            class="input-field username"
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={values.username}
                            onChange={handleInputChange("username")}/>
                        <span class="input-field-focus"></span>
                        <span class="input-icon">
                            <PersonOutlineIcon fontSize="large"/>
                        </span>
                    </div>
                    <div class="input-container">
                        <input 
                            class="input-field password"
                            type={values.showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            value={values.password}
                            onChange={handleInputChange("password")}
                        />
                        <span class="input-field-focus"></span>
                        <span class="input-icon">
                            <LockIcon fontSize="large"/>
                        </span>
                        <span class="show-password-icon">
                            <IconButton onClick={handleClickShowPassword}>
                                {values.showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                            </IconButton>
                        </span>
                    </div>
                    <div class="remember-container">
                        <FormControlLabel
                            control={<Checkbox
                                        checkedIcon={<CheckBoxOutlinedIcon sx={{color: "#bb397c"}}/>}
                                    />}
                            label="Remember Me"
                            sx={{
                                fontFamily: "Arial, Helvetica, sans-serif"
                            }}
                            onChange={() => {}}
                        />
                    </div>
                    <div class="login-btn-container">
                        <button class="login-btn">
                            LOGIN
                        </button>
                    </div>
                    <div class="register-link-container">
                        <a class="register-link" href="#">
                            Register
                        </a>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default LoginPage;
