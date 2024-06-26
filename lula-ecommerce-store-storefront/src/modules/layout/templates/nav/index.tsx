import { cookies } from "next/headers"
import Link from "next/link"
import { Suspense } from "react";
import dynamic from 'next/dynamic';
import { emitter } from "../../../../utils/emitter"

import { listRegions } from "@lib/data"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import DeliveryToggle from "@modules/layout/components/delivery-toggle/deliveryToggle.client"
import PopupWithAddressForm from '@modules/layout/components/delivery-address-input/popup_with_address_form';

const SalesChannelSwitcher = dynamic(
  () => import('@modules/layout/components/store-location-switch/sales_channel_switch'),
  { 
    ssr: false,
    // Add a loading component or function here if needed for better UX
    loading: () => <p>Loading...</p>
  }
);

const ClientAddressDisplay = dynamic(() => import('../../components/delivery-address-input/ClientAddressDisplay'), { ssr: false });


interface Address {
  street?: string;
  city: string;
  state: string;
  zip?: string;
}

export default async function Nav() {
  const regions = await listRegions().then((regions) => regions)
  const regionCookie = cookies().get("_medusa_region")?.value
  const currentRegion = regionCookie && JSON.parse(regionCookie)




  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <header className="relative h-16 mx-auto border-b duration-200 bg-white border-ui-border-base">
        <nav className="content-container txt-xsmall-plus text-ui-fg-subtle flex items-center justify-between w-full h-full text-small-regular">
        <div className="flex-1 basis-0 h-full flex items-center" style={{ gap: '20px' }}>
            <div className="h-full">
              <SideMenu regions={regions} currentRegion={currentRegion} />
            </div>
            <DeliveryToggle />
            <PopupWithAddressForm />
            <ClientAddressDisplay />
          </div>
          
          

          <div className="flex items-center h-full">
            <Link
              href="/"
              className="txt-compact-xlarge-plus hover:text-ui-fg-base uppercase"
            >
              <img src="/WawaEmblem.png" alt="Store Logo" style={{ maxWidth: '120px' }} />
              
            </Link>
          </div>

          
          
        

          

          <div className="flex items-center gap-x-6 h-full flex-1 basis-0 justify-end">
            <SalesChannelSwitcher />
            <div className="hidden small:flex items-center gap-x-6 h-full">
              {process.env.FEATURE_SEARCH_ENABLED && (
                // Update the form to use a direct submission approach
                <Link
                  className="hover:text-ui-fg-base"
                  href="/search"
                  scroll={false}
                >
                  
                  <button 
                  type="submit" 
                  style={{
                    backgroundImage: `url('/search.png')`, // Make sure the path is correct
                    backgroundSize: 'cover', // This ensures that your image covers the button area
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    width: '25px', // Specify the width of your button
                    height: '25px', // Specify the height of your button
                    border: 'none', // Remove default button border
                    cursor: 'pointer', // Change cursor to pointer on hover
                  }}
                  aria-label="Search" // Accessibility for screen readers
                  >
                  </button>
                </Link>
                
                
              )}
              <Link className="hover:text-ui-fg-base" href="/account">
                Account
              </Link>
            </div>
            <Suspense
              fallback={
                <Link className="hover:text-ui-fg-base flex gap-2" href="/cart">
                  Cart (0)
                </Link>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>
      </header>
    </div>
  )
}
