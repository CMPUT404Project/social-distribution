import axios from 'axios';
 
export const setAxiosAuthToken = token => {
   if (token) {
       axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
   }
   else
       delete axios.defaults.headers.common["Authorization"];
}

export function clearStorage() {
    localStorage.clear();
    sessionStorage.clear();
}