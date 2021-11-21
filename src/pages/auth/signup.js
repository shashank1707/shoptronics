import React, { useState, useEffect } from 'react'
import { Container, Form, Button, Card } from 'react-bootstrap'
import { Redirect } from 'react-router';
import { isUserLoggedIn } from '../../backend/auth';
import { createUserDatabase, findUser } from '../../backend/database';

function Signup() {

    const [loginState, setLoginState] = useState(isUserLoggedIn());

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = (e) => {
        e.preventDefault();
        if (validateEmail() && validatePassword()) {
            signUp();
        }
    }

    const signUp = async () => {

        const userDetails = {
            name: name,
            email: email,
            password: password,
            cart: [],
            orders: [],
            wishList: [],
            address: {}
        }

        createUserDatabase(userDetails).then((user) => {
            if (user) {
                localStorage.setItem('uid', user.id)
                setLoginState(true);
                window.dispatchEvent(new Event('storage'));
                window.location.replace('/');
            }
        });

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
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>SIGN UP</div>
                <Form onSubmit={handleSignup} className='form'>

                    <Form.Group className="mb-3" >
                        <Form.Label>Name</Form.Label>
                        <Form.Control type='text' required placeholder="Enter Name" onChange={(e) => setName(e.target.value)} />
                    </Form.Group>

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

                    <Button variant="light" type="submit" className='mb-3' style={{ marginTop: '10px' }}>
                        SIGN UP
                    </Button>
                </Form>

            </div>
        </div>
    )
}

export default Signup
