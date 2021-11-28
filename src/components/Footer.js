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

    const description = 'Shoptronics is one of world’s leading e-commerce websites, having over 500+ million users each month. Looking for a phone? A laptop? Headphones? Shoptronics is the place to be! Browse from over thousands of products from hundreds of brands.';


    return (
        <div className='footer'>

            <div className='footer-col'>
                <div className='heading'>
                    SHOPTRONICS
                </div>
                <p className='footer-details'>{description}</p>
                <p className='footer-details'>Have a query? Call us anytime on our 24x7 hotline to get your questions answered!</p>
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
