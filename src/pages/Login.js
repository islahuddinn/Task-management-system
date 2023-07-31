import { useRef, useState, useEffect, useContext } from 'react';
import AuthContext from "../context/AuthProvider";
// import { useDispatch, useSelector } from "react-redux";
// import boardsSlice from "../redux/boardsSlice";
// import Register from './Register';

import axios from '../api/axios';
import Register from './Register';
// import { divide } from 'lodash';
const LOGIN_URL = '/auth';

const Login = () => {
    const { setAuth } = useContext(AuthContext);
    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);
    const [showRegister, setShowRegister] = useState(false);


    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd])

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({ user, pwd }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            console.log(JSON.stringify(response?.data));
            //console.log(JSON.stringify(response));
            const accessToken = response?.data?.accessToken;
            const roles = response?.data?.roles;
            setAuth({ user, pwd, roles, accessToken });
            setUser('');
            setPwd('');
            setSuccess(true);
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
        }
    }

    return (
        <div className='flex items-center justify-center min-h-screen bg-gray-100'>
            <section className="">
                <p ref={errRef} className={`errmsg ${errMsg ? "" : "offscreen"}`} aria-live="assertive">{errMsg}</p>
                <h1 className="text-4xl font-bold mb-8">Sign In</h1>
                <form onSubmit={handleSubmit} className="mb-4">
                    <label htmlFor="username" className="block mb-2">Username:</label>
                    <input
                        type="text"
                        id="username"
                        ref={userRef}
                        autoComplete="off"
                        onChange={(e) => setUser(e.target.value)}
                        value={user}
                        required
                        className="border border-gray-300 rounded-md p-2 mb-4 w-full"
                    />

                    <label htmlFor="password" className="block mb-2">Password:</label>
                    <input
                        type="password"
                        id="password"
                        onChange={(e) => setPwd(e.target.value)}
                        value={pwd}
                        required
                        className="border border-gray-300 rounded-md p-2 mb-4 w-full"
                    />
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-md w-full">Sign In</button>
                </form>
                {showRegister && (
                    <Register
                        setShowRegister={setShowRegister}
                        type="add"
                        device="mobile"
                    />
                )}
                <p>
                    Need an Account?<br />
                    <button
                        className=" button hidden md:block "
                        onClick={() => {
                            setShowRegister((prevState) => !prevState);
                        }}
                    >
                        Signup
                    </button>
                </p>
            </section>
        </div>

    )
}

export default Login;
