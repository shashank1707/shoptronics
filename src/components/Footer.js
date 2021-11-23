import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { isUserLoggedIn } from '../backend/auth';
import './Footer.css'

function Footer() {

    const [loginState, setLoginState] = useState(isUserLoggedIn());

    window.addEventListener('storage', (e) => {
        const uid = localStorage.getItem('uid');
        if (uid) {
            setLoginState(true);
        } else {
            setLoginState(false);
        }
    })

    const description = 'SHOTRONICS is one of the best places to buy Laptops and Smartphones online.'


    return (
        <div className='footer'>

            <div className='footer-col'>
                <div className='heading'>
                    SHOPTRONICS
                </div>
                <p className='footer-details'>{description}</p>
            </div>

            <div className='footer-col'>
                <div className='heading'>
                    LINKS
                </div>
                <Link to='/' className='footer-link' >Home</Link>
                <Link to='/products' className='footer-link' >Products</Link>
            </div>
            {
                loginState ? <div className='footer-col'>
                    <div className='heading'>
                        ACCOUNT
                    </div>
                    <Link to='/account' className='footer-link' >Profile</Link>
                    <Link to='/orders' className='footer-link' >Orders</Link>
                    <Link to='/cart' className='footer-link' >Cart</Link>
                    <Link to='/wishlist' className='footer-link' >Wishlist</Link>
                </div> :
                    <div className='footer-col'>
                        <div className='heading'>
                            ACCOUNT
                        </div>
                        <Link to='/signin' className='footer-link' >Sign In</Link>
                        <Link to='/signup' className='footer-link' >Register</Link>
                    </div>
            }
            <div className='footer-col'>
                <div className='heading'>
                    INFORMATION
                </div>
                <Link to='/about' className='footer-link' >About</Link>
                <Link to='/contact' className='footer-link' >Contact</Link>
            </div>
        </div>
    )
}

export default Footer
