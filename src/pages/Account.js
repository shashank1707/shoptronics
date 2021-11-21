import React, { useState, useEffect } from 'react'
import { getFirestore, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import app from '../backend/firebase';
import { Button, Col, Modal, Row, Form } from 'react-bootstrap';
import './Account.css'
import { getUid, signout } from '../backend/auth';
import { Link } from 'react-router-dom';

const db = getFirestore(app);

function Account() {

    const uid = getUid();


    const [userDetails, setUserDetails] = useState({
        name: '',
        email: '',
        password: '',
        cart: [],
        orders: [],
        wishList: [],
        address: {},
    });

    useEffect(() => {
        getUserDetails();
    }, [])

    const getUserDetails = () => {
        console.log(uid);
        if (uid) {
            onSnapshot(doc(db, 'users', uid), (snapshot) => {
                setUserDetails({
                    ...snapshot.data()
                })
            })
        }
    }

    const signoutUser = () => {
        signout();
        window.dispatchEvent(new Event('storage'));
    }

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [add_title, setTitle] = useState('');
    const [add_name, setName] = useState('');
    const [add_phone, setPhone] = useState('');
    const [add_address, setAddress] = useState('');
    const [add_pincode, setPincode] = useState('');

    const saveAddress = async (e) => {

        e.preventDefault();

        const newAddress = {
            name: add_name,
            title: add_title,
            phone: add_phone,
            address: add_address,
            pincode: add_pincode
        }

        await updateDoc(doc(db, 'users', uid), {
            address: newAddress
        })

        setTitle('');
        setName('');
        setAddress('');
        setPhone('');
        setPincode('');

    }


    const addAddressModal = () => {
        return <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add New Address</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={saveAddress}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Title</Form.Label>
                        <Form.Control type="text" placeholder="Enter Title for the Address" onChange={(e) => setTitle(e.target.value)} required />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter Name" onChange={(e) => setName(e.target.value)} required />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control type="text" placeholder="Enter Phone Number" onChange={(e) => setPhone(e.target.value)} required />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Pincode</Form.Label>
                        <Form.Control type="text" placeholder="Enter Pincode" onChange={(e) => setPincode(e.target.value)} required />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Address</Form.Label>
                        <Form.Control type="text" placeholder="Enter Complete Address" onChange={(e) => setAddress(e.target.value)} required />
                    </Form.Group>

                    <div>
                        <Button variant="primary" type="submit" style={{ marginRight: '10px', marginTop: '10px' }} onClick={handleClose}>
                            Save
                        </Button>
                        <Button variant="secondary" style={{ marginRight: '10px', marginTop: '10px' }} onClick={handleClose}>
                            Cancel
                        </Button>
                    </div>

                </Form>

            </Modal.Body>
        </Modal>
    }


    return (
        <div className='account'>
            <div className='side-box'>
                <h4>Links</h4>
                <Col className='details'>
                    <Link to='/orders' className='detail-text' style={{textDecoration: 'none'}}>
                        Orders
                    </Link>

                    <Link to='/cart' className='detail-text' style={{textDecoration: 'none'}}>
                        Cart
                    </Link>

                    <Link to='/wishlist' className='detail-text' style={{textDecoration: 'none'}}>
                        Wishlist
                    </Link>

                    <div className='detail-text'>
                        <Col style={{ color: 'red', cursor: 'pointer' }} onClick={signoutUser}>SIGN OUT</Col>
                    </div>
                </Col>
            </div>
            {addAddressModal()}
            <div className='main-box'>
                <div className='title'>
                    <h3>Personal Details</h3>
                </div>
                <div className='personal'>
                    <Row style={{marginTop: '10px'}}>
                        <Col>Name</Col>
                        <Col style={{ color: '#32cd32' }}>{userDetails.name}</Col>
                    </Row>
                    <Row style={{marginTop: '10px', marginBottom: '10px'}}>
                        <Col>Email</Col>
                        <Col style={{ color: '#32cd32' }}>{userDetails.email}</Col>
                    </Row>
                </div>
                <div className='title'>
                    <h3>Address</h3>
                    <i class="fas fa-pen" style={{ color: '#32cd32', margin: '20px', cursor: 'pointer'}} onClick={handleShow}></i>
                </div>
                {
                    Object.keys(userDetails.address).length <= 0 ? <div style={{ color: '#32cd32', cursor: 'pointer'}} onClick={handleShow}>Add address</div>
                        : <div className='address-details'>
                            <h5>{userDetails.address.title}</h5>
                            <div className='name-phone'>
                                <h6>{userDetails.address.name}</h6>
                                <h6>{userDetails.address.phone}</h6>
                            </div>
                            <p>{userDetails.address.address}</p>
                            <p>{userDetails.address.pincode}</p>
                        </div>
                }
            </div>

        </div>
    )
}

export default Account
