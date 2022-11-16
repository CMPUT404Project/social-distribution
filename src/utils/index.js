import axios from 'axios';

export const setAxiosAuthToken = () => {
    const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
    if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete axios.defaults.headers.common["Authorization"];
    }
}



export function clearStorage() {
    localStorage.clear();
    sessionStorage.clear();
}