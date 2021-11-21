import '../App.css';
import HeroSection from '../components/HeroSection';

import React from 'react'
import { Col } from 'react-bootstrap';
import BestProducts from '../components/BestProducts';

function Home() {

    const categoryIDs = {
        laptop: 'a8niJ4rt0LWMYKT4jl67',
        mobile: 'vd8GJXwQGEilFVCaMiev',
    }

    return (
        <>
            <Col>
                <HeroSection />
                <h2 className='best-title' id='best-title'>Best Selling Laptops</h2>
                <BestProducts type='Laptop' id={categoryIDs.laptop} />
                <h2 className='best-title' >Best Selling Smartphones</h2>
                <BestProducts type='Smartphone' id={categoryIDs.mobile} />
            </Col>

        </>
    )
}

export default Home
