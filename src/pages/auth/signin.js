import React, { useState, useEffect } from 'react'
import { Container, Form, Button, Card, Spinner } from 'react-bootstrap'
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import { isUserLoggedIn } from '../../backend/auth';
import { signinUser } from '../../backend/database';
import './auth.css'

function Signin() {

    const [loginState, setLoginState] = useState(isUserLoggedIn());

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [buttonLoading, setButtonLoading] = useState(false);

    const handleSignin = (e) => {
        e.preventDefault();
        if (validateEmail() && validatePassword()) {
            signIn();
        }
    }

    const signIn = async () => {

        setButtonLoading(true);

        const userDetails = {
            email: email,
            password: password
        }

        await signinUser(userDetails).then((user) => {
            if (user) {
                localStorage.setItem('uid', user.uid);
                setLoginState(true);
                console.log(user)
                window.dispatchEvent(new Event('storage'))
            } else {
                alert('Incorrect Email or Password')
            }

        });

        setButtonLoading(false);
    };

    const validateEmail = () => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email));
    }

    const validatePassword = () => {
        if (password.length >= 6) return true;
        return false;
    }


    if (loginState) {
        return <Redirect to='/' />
    }

    return (
        <div className='auth'>
            <div className='card'>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>SIGN IN</div>
                <Form onSubmit={handleSignin} className='form'>

                    <Form.Group className="mb-3" >
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type='email' required isInvalid={!validateEmail() && email} placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} />
                        <Form.Control.Feedback type='invalid'>Enter valid Email</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control required isInvalid={password && !validatePassword()} type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                        <Form.Control.Feedback type='invalid'>Password should be 6 characters long</Form.Control.Feedback>
                    </Form.Group>

                    <Button variant="light" type="submit" className='mb-3' style={{ marginTop: '10px', width: '100px' }}>
                        {buttonLoading ? <Spinner
                            animation="border"
                            size="sm"
                          /> : <div>SIGN IN</div>}
                    </Button>
                    OR
                    <Link to='/signup' replace={true} style={{ color: '#fff' }}>Register Now</Link>
                </Form>

            </div>
        </div>
    )
}

export default Signin
