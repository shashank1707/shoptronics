import React from 'react'
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Confirm() {
    return (
        
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
        <i className="far fa-check-circle fa-3x" style={{
            color: '#32cd32',
            margin: '20px'
        }}></i>
            <h3 style={{
                margin: '10px',
            }}>Order Placed</h3>
            <div>Thank You For Shopping</div>
            <Link to='/orders'><Button style={{
                margin: '30px'
            }}>View Orders</Button></Link>
        </div>
    )
}

export default Confirm
