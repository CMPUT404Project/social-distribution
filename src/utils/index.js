import axios from 'axios';
import jwtDecode from "jwt-decode";


export const regexPatterns = {
    namePattern: /^[A-Za-z0-9]{1,30}$/,
    gitPattern: /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i
}

export const namePattern = /^[A-Za-z0-9]{1,30}$/;
export const gitPattern = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;

export const setAxiosDefaults = () => {
    const accessToken = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
    if (accessToken) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    } else {
        delete axios.defaults.headers.common["Authorization"];
    }
}

export const retrieveCurrentAuthor = () => {
    const author = sessionStorage.getItem('author') || localStorage.getItem('author')
    return JSON.parse(author);
}

export const getCurrentAuthorID = () => {
    const accessToken = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
    return jwtDecode(accessToken)["author_id"].split("authors/")[1];
}

export const getAccessToken = () => {
    return localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
}

export const getRefreshToken = () => {
    return localStorage.getItem('refresh_token') || sessionStorage.getItem('refresh_token');
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

export const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function clearStorage() {
    localStorage.clear();
    sessionStorage.clear();
}