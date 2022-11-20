import axios from 'axios';
import { Slide, SlideProps} from '@mui/material';

export const regexPatterns = {
    namePattern: /^[A-Za-z0-9]{1,30}$/,
    gitPattern: /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i
}

export const namePattern = /^[A-Za-z0-9]{1,30}$/;
export const gitPattern = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;

export const setAxiosAuthToken = () => {
    const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
    if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete axios.defaults.headers.common["Authorization"];
    }
}

/**
* Code from https://stackoverflow.com/a/68333175
* By Caleb Taylor
*/
export const doesImageExist = (url) => new Promise((resolve) => {
   const img = new Image();
   img.src = url;
   img.onload = () => resolve(true);
   img.onerror = () => resolve(false);
});

export function SlideTransition(props: SlideProps) {
    return <Slide{...props} direction="down"/>;
}

export const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

export function clearStorage() {
    localStorage.clear();
    sessionStorage.clear();
}