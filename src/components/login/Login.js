import { useEffect, useRef, useState } from 'react';
import './Login.css';
import { Container } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
import axiosClient from '../../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

import { Link,useLocation } from 'react-router-dom';

import React from 'react'
import axios from 'axios';

const Login = () => {

    const navigate = useNavigate();
    const userRef = useRef();
    const [user,setUser] = useState();
    const [pwd,setPwd] = useState('');
    const [errMsg,setErrMsg] = useState('');
    const {setAuth} = useAuth();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/";
    useEffect(() => {
        userRef.current.focus();
    },[])

    const postLogin = async (e) => {
        e.preventDefault();
        const userName = e.target.username.value;
        const pwd = e.target.pwd.value;

        try{
            const b64Encode = btoa(`${userName}:${pwd}`);

            const config = {
                headers: {
                Authorization:  `Basic ${b64Encode}`
           
                 }
                 }

            const resp = await axiosClient.get('/api/v1/auth/me',config);
            const data = resp.data;
            

            if(resp?.status === 200) {
                // TODO: login is failing for wrong password and username
                // Error handling is not done properly
                // Instead the page is giving an alert for signing into localhost:8080
                setErrMsg('');

                setAuth({user:data,password:pwd})

                navigate(from,{replace:true});
            }
            else{
                setErrMsg("You were unable to login into the system");
            }
        
        } catch (error) {
            setErrMsg("Something went wrong " + error);
        }
    }

      return (
  <Container>
    <header>
        <h4>Login</h4>
    </header>
    <main className="login-container">
        <div className = 'login-layout'>
            <Form onSubmit={postLogin}>
                <Form.Group className="mb-3">
                    <Form.Label>
                        Username:
                    </Form.Label>
                    <Form.Control type="text" placeholder='Enter Username'
                        id="username"
                        ref={userRef}
                        autoComplete='off'
                        onChange={(e) => setUser(e.target.value)}
                        required
                        value={user}
                    
                    />
                </Form.Group>

                <Form.Group className='mb-3'>
                    <Form.Label>
                        Password:
                    </Form.Label>
                    <Form.Control type="password" placeholder='Password'
                        id="pwd"
                        autoComplete='off'
                        onChange={(e) => setPwd(e.target.value)}
                        required
                        value={pwd}
                    
                    />
                </Form.Group>
                <Button variant='info' type="submit">
                    Submit
                </Button>
            </Form>
        </div>
        {
            (errMsg)?
            <div className = "login-error-message">
                <p>{errMsg}</p>
            </div>:null
        }
    </main>
  </Container>
  )
}

export default Login