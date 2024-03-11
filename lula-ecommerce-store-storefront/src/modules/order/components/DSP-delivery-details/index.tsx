"use client";
import { Order } from "@medusajs/medusa"
import { useEffect, useState } from 'react'
import "./driverObject.css" 
import GoogleMapReact from 'google-map-react';

type OrderCompletedTemplateProps = {
  order: Order
}

const DriverLocaton = ({ lat, lng, text }) =>   

<div className="car">
<div className="car-body"></div>
<div className="wheel left"></div>
<div className="wheel right"></div>
</div>
;

export default async function DSP()
 {
  // const isOnboarding = cookies().get("_medusa_onboarding")?.value === "true"

  


  const [temp, setTemp] = useState("https://www.openstreetmap.org/export/embed.html?bbox=-0.14568328857421875%2C51.49999412080967%2C-0.12450408935546875%2C51.510076097941275&layer=mapnik")
  // const [deliverDetails, setDeliveryDetails] = useState({});
  const [showData, setShowData] = useState(false);
  const [status, setStatus] = useState("Driver Heading to store")
  const [driverLocation, setDriverLocation] = useState({center: {lat: 10.99835602, lng: 77.01502627}}) 
  const [dropOffTime, setDropOffTime] = useState("1:00")
  const [trackingUrl, setTrackingUrl] = useState("URL HERE")
  const [number, setNumber] = useState("Phone number here")
  const [drivername, setDriverName] = useState("Driver NameHere")

  // might just end up using an object to store everything so I'm not setting a lot.

  
  useEffect(() => {
    
    //  make fetch request to check if user signed in 
    getDeliveryID();
    console.log('In use effect')

    // Call fetch request here
  
    }, []);




  async function getDeliveryID(){


    let endpoint = "http://localhost:9000/doordash/deliveryQuoteId";

    console.log(endpoint, "ENDPOINT")

  try {

      let response = await fetch(endpoint, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json'
              
          },
         
          
      });

      let data = await response.json()

      console.log(data, "DELIVERY ID OBJECT")

      let StatusEndpoint;

    //   console.log(data, "DSP OPTION")

      if (data.result[0].dspOption === "uber"){

       StatusEndpoint = "http://localhost:9000/uber/delivery"

      }

      else {
        StatusEndpoint = "http://localhost:9000/doordash/getDelivery"
      }


      handleGetData(StatusEndpoint, data.result[0].deliveryId)
      
  } catch (error) {
      
  }


  }


  // let interval;
  



  // fetch status here

  async function handleGetData(endpoint: string, id: string){

    let requestBody = {deliveryId: id}

    


    let deliveryDetails = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
            
        },
        body: JSON.stringify(requestBody)
       
        
    }).then(response =>{
        if (response.ok){
            return response.json()
        }
    }).then(data => {
        
        console.log(data)

        // setShowData(true)

        let eta = data.dropoff_eta

        eta = eta.split("T")
        eta = eta[1]
        eta = eta.split(":")
        let firstHand = eta[0]

        eta = eta[0] + ":" + eta[1]

        console.log(parseInt(eta[0]), "TIME VAR")

        if (parseInt(firstHand) >= 13){
            eta = eta + "pm"
        }

        else{
            eta = eta + "am"
        }

        console.log(eta, "THE ETA")
        setStatus(data.status)
        setDriverName(data.courier.name)
        setNumber(data.courier.phone_number)
        setDropOffTime(eta)
        setTrackingUrl(data.tracking_url)

        setShowData(true)



    }).catch(error =>{

    })

    // let data = await response.json()

    // console.log(data)

   

    // Set states here

    
    




  }

  return (

    <div>
    {showData ?(<div className="py-6 min-h-[calc(100vh-64px)]">
    
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
    
    
    <ul>
      <li><a href={trackingUrl}><button>TRACKING URL</button></a></li>

      <li>{status}</li>

      <li>{drivername}</li>

      <li>{number}</li>


      <li>{dropOffTime}</li>


    </ul>
    
  </div>
          
  

     
  </div>



</div>




    ):(null)}


    </div>
    
  )
}
