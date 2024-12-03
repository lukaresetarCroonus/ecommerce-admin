import App from "./App";
import ReactDOM from "react-dom/client";
import "./assets/scss/index.scss";
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "./store/auth-contex";

const local = "http://192.168.1.174:4400/api/v1/";
const net = "http://25.19.215.162:4400/api/v1/";
const staging = "https://api.staging.croonus.com/api/v1/";
const nenad = "http://192.168.1.83:4400/api/v1/";
const dejan = "http://192.168.1.223:4400/api/v1/";
const bojke = "http://192.168.1.249:4400/api/v1/";
const hamachi_zeljko = "http://25.59.211.111:4400/api/v1/";
//"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vYXBpLnN0YWdpbmcuY3Jvb251cy5jb20vYXBpL3YxL2FkbWluL3NpZ24taW4vbG9naW4iLCJpYXQiOjE2OTM1NzI2MDIsImV4cCI6MTY5MzU3NjIwMiwibmJmIjoxNjkzNTcyNjAyLCJqdGkiOiJlOGc2bHhJVVNIRllqQjJXIiwic3ViIjoiMSIsInBydiI6IjE1NDA5NTUyMDFmYjcxZTVjYjgwZmFhYjRkOGY5ZjQzNjA4YjVlNGMifQ.LqO_WUjWbPdiO40NZfhVzfEGtVCMvBOte7drBmZatSg"

const root = ReactDOM.createRoot(document.getElementById("root"));

// Assert sure base URL for the API set
if (process.env.REACT_APP_URL || dejan) {
    localStorage.setItem("api", process.env.REACT_APP_URL || dejan);

    root.render(
        <BrowserRouter>
            <AuthContextProvider>
                <App />
            </AuthContextProvider>
        </BrowserRouter>
    );
} else {
    root.render(<h1>Required env variable is not set: REACT_APP_URL</h1>);
}
