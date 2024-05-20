"use client"
import React, { useEffect, useState } from 'react';
import { emitter } from '../../../../utils/emitter';



const StoreInfoDisplay = () => {
    //const [currentChannel, setCurrentChannel] = useState({});
    const [currentChannel, setCurrentChannel] = useState(() => {
        const savedChannel = localStorage.getItem('currentSalesChannel');
        return savedChannel ? JSON.parse(savedChannel) : {};
    });

    useEffect(() => {
        /*const handleSalesChannelChange = (channel) => {
            setCurrentChannel(channel);
        };*/
        const handleSalesChannelChange = (channel) => {
            setCurrentChannel(channel);
            localStorage.setItem('currentSalesChannel', JSON.stringify(channel));
        };

        emitter.on('salesChannelChange', handleSalesChannelChange);

        return () => {
            emitter.off('salesChannelChange', handleSalesChannelChange);
        };
    }, []);

    const formatDescription = (description) => {
        if (!description) return null;
    
        // Split the description at "Store Hours:"
        const parts = description.split("Store Hours:");
        const addressPart = parts[0].trim();
        const hoursPart = parts.length > 1 ? parts[1] : '';
    
        // Split the hours part on commas to create new lines
        const hoursFormatted = hoursPart.split(',').map((item, index) => (
            <span key={index} style={{ display: 'block', fontSize: '0.80em' }}>{item.trim()}</span>
        ));
    
        return (
            <>
                <p>{addressPart}</p>
                <p style={{ fontSize: '1em' }}>
                    <strong>Store Hours:</strong>
                    {hoursFormatted}
                </p>
            </>
        );
    };
    

    return (
        <div style={{ textAlign: 'center' }}>
            {currentChannel && currentChannel.name ? (
                <div>
                    <h1>{currentChannel.name}</h1>
                    <p>{formatDescription(currentChannel.description)}</p>
                </div>
            ) : (
                <p>No sales channel selected.</p>
            )}
        </div>
    );
};

export default StoreInfoDisplay;