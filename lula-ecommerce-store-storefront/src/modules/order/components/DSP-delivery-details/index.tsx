"use client";
import { Order } from "@medusajs/medusa"
import { useEffect, useState, useRef } from 'react'
import "./driverObject.css" 
import GoogleMapReact from 'google-map-react';
import { Spinner, ArrowUpRightMini } from "@medusajs/icons"
import { Text, Container, Label } from "@medusajs/ui"
import dayjs from "dayjs"

type OrderCompletedTemplateProps = {
  order: Order
}

const DriverLocaton = ({ lat, lng, text }) => {
  return (
    <div className="car">
      <div className="car-body"></div>
      <div className="wheel left"></div>
      <div className="wheel right"></div>
    </div>
  )
}

export default function DSPDeliveryDetails() {
  // might just end up using an object to store everything so I'm not setting a lot.
  // const [deliverDetails, setDeliveryDetails] = useState({});
  const [showData, setShowData] = useState(false);
  const [status, setStatus] = useState("")
  const [driverLocation, setDriverLocation] = useState({center: {lat: 0, lng: 0}}) 
  const [dropOffTime, setDropOffTime] = useState("")
  const [trackingUrl, setTrackingUrl] = useState("")
  const [driverPhoneNumber, setDriverPhoneNumber] = useState("")
  const [driverName, setDriverName] = useState("")
  const interval = useRef<NodeJS.Timeout | null>(null);

  const getDeliveryID = async () => {
    const deliveryIdEndpoint: string = "http://localhost:9000/doordash/deliveryQuoteId";
    try {
      let response = await fetch(deliveryIdEndpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });

      let data = await response.json()
      let dspDetailsEndpoint: string;

      if (data.result[0].dspOption === "uber"){
        dspDetailsEndpoint = "/uber/delivery"
      } else {
        dspDetailsEndpoint = "/doordash/getDelivery"
      }

      handleGetData(`http://localhost:9000${dspDetailsEndpoint}`, data.result[0].deliveryId)
    } catch (error) {
      console.log(error)
    }
  }

  async function handleGetData(endpoint: string, id: string){
    let requestBody = {deliveryId: id}

    let deliveryDetails = await fetch(endpoint,{
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      if (response.ok){
        return response.json()
      }
    }).then(data => {
      if (data.courier !== null){
        setDriverLocation({center: {lat: data.courier.location.lat, lng: data.courier.location.lng}})
        setDriverName(data.courier.name)
        setDriverPhoneNumber(data.courier.phone_number)
      }
      let eta = dayjs(data.dropoff_eta).format("h:mm A")
      setDropOffTime(eta)
      setStatus(data.status)
      if (data.status === "delivered"){
        clearInterval(interval.current!)
      }
      setTrackingUrl(data.tracking_url)
      setShowData(true)
    }).catch(error => {
      console.log(error)
    })
  }

  useEffect(() => {
    if (status !== "delivered"){
      getDeliveryID()
      interval.current = setInterval(() => {
        getDeliveryID()
      }, 20000)
      console.log(interval.current, "INTERVAL")
    }
    return () => clearInterval(interval.current!)
  }, []);

  return (
    <>
      {showData ? (
      <div>
      <div style={{height: '50vh', width: '100%'}}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyAa_09YbkUp8WYwK-E55FK8yjTBW-OdR0M" }}
          center={driverLocation.center}
          defaultZoom={20}
          options= {{zoomControl: false, fullscreenControl: false, scrollwheel: false, draggable: false}}
        >
          <DriverLocaton
            lat={driverLocation.center.lat}
            lng={driverLocation.center.lng}
            text="DRIVER LOCATION"
          />
        </GoogleMapReact>
      </div>

      <Container className="mt-3">
        <div className="flex items-start gap-x-8">
          <div className="flex flex-col w-1/2">
            <Label weight="plus">Driver Details</Label>
            <Text className="mb-1">{driverName !== "" ? driverName : "Pending"}</Text>
            <Text className="mb-2">{driverPhoneNumber}</Text>
            <Label weight="plus">{status === "delivered" ? "Delivered at" : "Estimated Arrival"}</Label>
            <Text>{dropOffTime}</Text>
          </div>
          <div className="flex flex-col w-1/2">
            <Label weight="plus">Delivery Status</Label>
            <Text className="mb-3">{status.charAt(0).toUpperCase() + status.slice(1)}</Text>
            <Label weight="plus">Tracking URL</Label>
            <a className="flex gap-x-1 items-center group" href={trackingUrl} target="_blank">
              <Text className="text-ui-fg-interactive">Link</Text>
              <ArrowUpRightMini
                className="group-hover:rotate-45 ease-in-out duration-150"
                color="var(--fg-interactive)"
              />
            </a>
          </div>
        </div>
      </Container>
      </div>
      ):(
        <div className="flex content-center justify-center mb-5">
          <Spinner className="animate-spin"/>
        </div>)}
    </>
  )
}
