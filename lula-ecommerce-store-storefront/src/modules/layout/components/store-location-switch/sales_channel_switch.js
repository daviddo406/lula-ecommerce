"use client"
import React, { useEffect, useState } from 'react';
import medusaClient from '../../../../utils/medusaClient'
import { updateCartSalesChannel, createOrUpdateCart } from '../../../../utils/cartManager';
import { emitter } from "../../../../utils/emitter"




const SalesChannelSwitcher = () => {
    const [salesChannels, setSalesChannels] = useState([]);
    const [currentSalesChannelId, setCurrentSalesChannelId] = useState("");
    const [loading, setLoading] = useState(false);
    const publishableApiKeyId = process.env.NEXT_PUBLIC_SALES_CHANNEL_POOL;


  
    useEffect(() => {
        setLoading(true);
        const fetchSalesChannels = async () => {
          try {
            // Fetch all sales channels
            const { sales_channels } = await medusaClient.admin.salesChannels.list();
            setSalesChannels(sales_channels);
    
            // Fetch currently associated sales channels
        if (publishableApiKeyId) {
            const { sales_channels: associatedChannels } = await medusaClient.admin.publishableApiKeys.listSalesChannels(publishableApiKeyId);
            if (associatedChannels.length > 0) {
                setCurrentSalesChannelId(associatedChannels[0].id); // Assuming only one is associated at a time

            }
          } else {
            console.error("Publishable API Key ID is undefined.");
          }
        } catch (error) {
          console.error('Failed to fetch sales channels:', error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchSalesChannels();
    }, [publishableApiKeyId]);



  

    
    
    const handleSwitchSalesChannel = async (salesChannelId) => {
        setLoading(true);
        try {
            
            // First delete the current sales channel association if it exists
            if (currentSalesChannelId) {
                await medusaClient.admin.publishableApiKeys.deleteSalesChannelsBatch(publishableApiKeyId, { sales_channel_ids: [{ id: currentSalesChannelId }] });
            }
            // Add the new sales channel association
            if (publishableApiKeyId) {
                await medusaClient.admin.publishableApiKeys.addSalesChannelsBatch(publishableApiKeyId, { sales_channel_ids: [{ id: salesChannelId }] });
                
                // Update the sales channel & create/retrieve cart
                const cart = await createOrUpdateCart(salesChannelId);

                setCurrentSalesChannelId(salesChannelId); // Bind new selected sales channel to publishable api key

                const selectedChannel = salesChannels.find(channel => channel.id === salesChannelId);
                console.log(selectedChannel);
                if (selectedChannel) {
                    localStorage.setItem('currentSalesChannel', JSON.stringify(selectedChannel));
                }
                //emitter.emit('salesChannelChange', selectedChannel);  // Emit event with channel data
                
                
                location.reload(); // refresh the page
                
                console.log('Switched sales channel successfully');
            }else{
                console.error("Publishable API Key ID is undefined.");
            }
            } catch (error) {
                console.error('Failed to switch sales channels:', error);
            } finally {
                setLoading(false);
            }
    };
  
    if (loading) return <div>Loading...</div>;
  
    return (
      <div>
        <h3>Select Store Location:</h3>
        <select value={currentSalesChannelId} onChange={(e) => handleSwitchSalesChannel(e.target.value)}>
        {salesChannels.map(channel => (
          <option key={channel.id} value={channel.id}>
            {channel.name}
            </option>
          ))}
        </select>
      </div>
    );
};
  
export default SalesChannelSwitcher;