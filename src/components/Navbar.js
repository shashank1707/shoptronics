import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import Button from './Button';
import { getUid, isUserLoggedIn, signout } from '../backend/auth';
import { Badge, Row } from 'react-bootstrap';
import IconBadge from './IconBadge';
import { getFirestore, collection, getDocs, getDoc, doc, setDoc, addDoc, query, where, onSnapshot, onSnapshotsInSync } from 'firebase/firestore';
import app from '../backend/firebase';

const db = getFirestore(app);


function Navbar() {

    const [loginState, setLoginState] = useState(isUserLoggedIn());

    window.addEventListener('storage', (e) => {
        const uid = localStorage.getItem('uid');
        if (uid) {
            setLoginState(true);
        } else {
            setLoginState(false);
        }
    })


    const [click, setClick] = useState(false);
    const [button, setButton] = useState(true);

    const [userDetails, setUserDetails] = useState({
        name: '',
        email: '',
        password: '',
        cart: [],
        orders: [],
        wishList: [],
    });
    const [isLoading, setIsLoading] = useState(true)

    const handleClick = () => {
        setClick(!click);
    }

    const closeMobileMenu = () => {
        setClick(false);
    }

    const showButton = () => {
        if (window.innerWidth <= 960) {
            setButton(false);
        } else {
            setButton(true);
        }
    }

    useEffect(() => {
        showButton();
        getUserDetails();
    }, [loginState]);

    window.addEventListener('resize', showButton);

    const signoutUser = () => {
        signout();
        window.dispatchEvent(new Event('storage'));
    }

    const getUserDetails = () => {
        const uid = getUid();
        console.log(uid);
        if (uid) {
            onSnapshot(doc(db, 'users', uid), (snapshot) => {
                setUserDetails({
                    uid: uid,
                    ...snapshot.data()
                })
            })
            setIsLoading(false);
        }


    }

    const renderLoginLinks = () => {
        return <ul className={click ? 'nav-menu active' : 'nav-menu'}>
            <li className='nav-item'>
                <Link to='/products' className='nav-links' onClick={closeMobileMenu}>Products</Link>
            </li>
            <li className='nav-item'>
                <Link to='/signin' className='nav-links' target='_blank' onClick={closeMobileMenu}>SIGN IN</Link>
            </li>
        </ul>
    }

    const renderProfileLinks = () => {
        return <ul className={click ? 'nav-menu active' : 'nav-menu'}>
            <li className='nav-item'>
                <Link to='/products' className='nav-links' onClick={closeMobileMenu}>Products</Link>
            </li>
            <li className='nav-item'>
                <Link to='/orders' className='nav-links' onClick={closeMobileMenu}>Orders</Link>
            </li>
            <li className='nav-item'>
                <Link to='/cart' className='nav-links' onClick={closeMobileMenu}>
                    <i className="fas fa-cart-plus" style={{ marginTop: '10px' }}><IconBadge count={userDetails.cart.length} /></i>
                </Link>

            </li>
            <li className='nav-item'>
                <Link to='/wishlist' className='nav-links' onClick={closeMobileMenu}>
                    <i className="fas fa-heart" style={{ marginTop: '10px' }}> <IconBadge count={userDetails.wishList.length} /></i>
                </Link>

            </li>
            <li className='nav-item'>
                <Link to='/account' className='nav-links' onClick={closeMobileMenu}>
                    <i class="fas fa-user"></i>
                </Link>

            </li>
        </ul>
    }

    return (
        <>
            <nav className='navbar'>
                <div className='navbar-container'>
                    <Link to='/' className='navbar-logo' onClick={closeMobileMenu}>
                        SHOPTRONICS <i className='fab fa-typo3' />
                    </Link>
                    <div className='menu-icon' onClick={handleClick}>
                        <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
                    </div>
                    {loginState ? !isLoading && renderProfileLinks() : renderLoginLinks()}
                </div>
            </nav>
        </>
    )
}

export default Navbar
