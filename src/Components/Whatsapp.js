import React from 'react'
import '../css/whatsapp.css';
import Leftsidebar from './section/Leftsidebar';
import Rightsidebar from './section/Rightsidebar';

export default function Whatsapp() {
    return (
        <div className='Whatsapp'>
            <Leftsidebar />
            <Rightsidebar />
        </div>
    )
}
