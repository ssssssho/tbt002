import { Admin, Resource, ListGuesser } from 'react-admin';
import App from './App'
import simpleRestProvider from 'ra-data-simple-rest';
import { API_BASE_URL } from "./constants";

// 認証処理
const authProvider = {
    login: ({ username, password }) => {
      return fetch(`${ API_BASE_URL }/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })
      .then((res) => {
        if (!res.ok) throw new Error("Login failed");
        return res.json();
      })
      .then((data) => {
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username);
      });
    },
    logout: () => {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      return Promise.resolve();
    },
    checkAuth: () => {
      return localStorage.getItem("token") ? Promise.resolve() : Promise.reject();
    },
    checkError: () => Promise.resolve(),
    getPermissions: () => Promise.resolve(),
  };
  
  const dataProvider = simpleRestProvider(`${ API_BASE_URL }/login`);
  function Login() {
    return (
      <Admin dataProvider={dataProvider} authProvider={authProvider}>
        <Resource name="task" list={App} />
      </Admin>
    );
  }
  
  export default Login;