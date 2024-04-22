"use client";
import { Order } from "@medusajs/medusa"
import { useEffect, useState, useRef } from 'react'
import GoogleMapReact from 'google-map-react';
import { Text, Container, Label } from "@medusajs/ui"

export default function DSPPickupDetails() {
  const [showData, setShowData] = useState(false);
  const [status, setStatus] = useState("")
  const [storeLocation, setStoreLocation] = useState({center: {lat: 39.9566, lng: -75.1899}}) 
  const [dropOffTime, setDropOffTime] = useState("")
  const [trackingUrl, setTrackingUrl] = useState("")
  const [driverPhoneNumber, setDriverPhoneNumber] = useState("")
  const [driverName, setDriverName] = useState("")

  return (
    <>
      <div>
      <div style={{height: '50vh', width: '100%'}}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyAa_09YbkUp8WYwK-E55FK8yjTBW-OdR0M" }}
          center={storeLocation.center}
          defaultZoom={17}
          options= {{zoomControl: false, fullscreenControl: false, scrollwheel: false, draggable: false}}
        >
        </GoogleMapReact>
      </div>

      <Container className="mt-3">
        <div className="flex items-start gap-x-8">
          <div className="flex flex-col w-1/2">
            <Label weight="plus">Pickup Details</Label>
            <Text className="mb-1">{"Medusa Store"}</Text>
            <Text className="mb-1">{"3141 Chestnut St, Philadelphia, PA, 19014"}</Text>
            <Text>{"(444)-444-4444"}</Text>
          </div>
          <div className="flex flex-col w-1/2">
            <Label weight="plus">Estimated Pickup Time</Label>
            <Text className="mb-3">{"Pending"}</Text>
            <Label weight="plus">Order Status</Label>
            <Text>{"Confirmed"}</Text>
          </div>
        </div>
      </Container>
      </div>
    </>
  )
}
