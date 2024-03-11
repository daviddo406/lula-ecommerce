"use client";
import { Order } from "@medusajs/medusa"
import { Heading } from "@medusajs/ui"
import { useEffect, useState } from 'react'
import "./driverObject.css" 
import GoogleMapReact from 'google-map-react';
import CartTotals from "@modules/common/components/cart-totals"
import Help from "@modules/order/components/help"
import Items from "@modules/order/components/items"
import OrderDetails from "@modules/order/components/order-details"
import ShippingDetails from "@modules/order/components/shipping-details"
import PaymentDetails from "@modules/order/components/payment-details"
import { retrieveOrder } from "@lib/data"
import { notFound } from "next/navigation"

type OrderCompletedTemplateProps = {
  order: Order
}

export default async function OrderCompletedTemplate({
  order,
}: OrderCompletedTemplateProps) {

  const [temp, setTemp] = useState("https://www.openstreetmap.org/export/embed.html?bbox=-0.14568328857421875%2C51.49999412080967%2C-0.12450408935546875%2C51.510076097941275&layer=mapnik")
  // const [deliverDetails, setDeliveryDetails] = useState({});
  const [showData, setShowData] = useState(true);
  const [status, setStatus] = useState("Driver Heading to store")
  const [driverLocation, setDriverLocation] = useState({center: {lat: 10.99835602, lng: 77.01502627}}) 

  // might just end up using an object to store everything so I'm not setting a lot.

  
  useEffect(() => {
    
    //  make fetch request to check if user signed in 
    getDeliveryID();
    console.log('In use effect')

    // Call fetch request here
  
    }, []);




  async function getDeliveryID(){


    let endpoint = "http://localhost:9000/doordash/deliveryQuoteId";

  try {

      let response = await fetch(endpoint, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json'
          },
         
          
      });

      let data = await response.json()

      console.log(data, "DELIVERY ID OBJECT")
      
  } catch (error) {
      
  }


  }


  // let interval;
  



  // fetch status here

  const orderWithTip = await retrieveOrder(order.id)

  if (!orderWithTip) {
    return notFound()
  }

  return (
    <div className="py-6 min-h-[calc(100vh-64px)]">
      <div className="content-container flex flex-col justify-center items-center gap-y-10 max-w-4xl h-full w-full">
        <div className="flex flex-col gap-4 max-w-4xl h-full bg-white w-full py-10">
          <Heading
            level="h1"
            className="flex flex-col gap-y-3 text-ui-fg-base text-3xl mb-4"
          >
            <span>Thank you!</span>
            <span>Your order was placed successfully.</span>
          </Heading>

          {!showData ?(
            <h1>Retrieving Status</h1>
          ):(
            <div style={{height: '50vh', width: '100%'}}>

              <GoogleMapReact
                bootstrapURLKeys={{ key: "AIzaSyAa_09YbkUp8WYwK-E55FK8yjTBW-OdR0M" }}
                defaultCenter={driverLocation.center}
                defaultZoom={20}
              >
                <DriverLocaton
                  lat={driverLocation.center.lat}
                  lng={driverLocation.center.lng}
                  text="DRIVER LOCATION"
                />
              </GoogleMapReact>

          <div style={{
  textAlign: 'center', marginTop: '5vh', // Center text horizontally
}}>
            <p>{status}</p>
            
            <ul>
              <li>Shawn Abraham</li>

              <li>268-882-0772</li>


              <li>12:30pm - 1:30pm</li>


            </ul>
            
          </div>
                  
          

             
          </div>
          )}

        <div>
        <OrderDetails order={order} />

        </div>
          
          <Heading level="h2" className="flex flex-row text-3xl-regular">
            Summary
          </Heading>
          <Items items={order.items} region={order.region} />
          <CartTotals data={orderWithTip} />
          <ShippingDetails order={order} />
          {/* <PaymentDetails order={order} /> */}
          <Help />
        </div>
      </div>
    </div>
  )
}
