import { Product, Store } from "@medusajs/medusa"
import { Metadata } from "next"

import { getCollectionsList, getProductsList } from "@lib/data"
import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import dynamic from 'next/dynamic';

const StoreInfoDisplay = dynamic(
  () => import('@modules/layout/components/store-information/store-info-display'),
  { 
    ssr: false,
    // Add a loading component or function here if needed for better UX
    loading: () => <p>Loading...</p>
  }
);

export const metadata: Metadata = {
  title: "Lula store template",
  description:
    "An example test store using Medusa and Next.js to demonstrate an example storefront for Lula."
}

const getCollectionsWithProducts = async () => {
  var { collections } = await getCollectionsList(0, 8).then(
    (collections) => collections
  )

  if (!collections) {
    return null
  }
  

  collections = collections.filter(x => x.metadata["sales-key"] == process.env.NEXT_PUBLIC_SALES_CHANNEL_POOL)
  const collectionIds = collections.map((collection) => collection.id)

  await Promise.all(
    collectionIds.map((id) =>
      getProductsList({ queryParams: { collection_id: [id] } })
    )
  ).then((responses) =>
    responses.forEach(({ response, queryParams }) => {
      let collection

      if (collections) {
        collection = collections.find(
          (collection) => collection.id === queryParams?.collection_id?.[0]
        )
      }

      if (!collection) {
        return
      }
      collection.products = (response.products as unknown as Product[]).slice(0, 5);
    })
  )

  return collections
}

export default async function Home() {
  const collections = await getCollectionsWithProducts()

  if (!collections) {
    return null
  }

  /*return (
    <>
      {/*<Hero />}
      <div className="py-12">
        <StoreInfoDisplay/>
        <ul className="flex flex-col gap-x-6">
          <FeaturedProducts collections={collections} />
        </ul>
      </div>
    </>
  )*/
  
  return (
    <>
      {/* Reduce padding here if needed */}
      <div className="py-6 flex flex-col items-center bg-gray-100"><StoreInfoDisplay /></div>
      <div className="py-2 flex flex-col items-center"> {/* Adjusted padding */}
        
        <ul className="flex flex-col gap-x-6 mt-4">
          <FeaturedProducts collections={collections} />
        </ul>
      </div>
    </>
);

  /*return (
    <>
      <header className="w-full py-4 px-12 bg-gray-100 flex justify-between items-center">
        <img src="/WawaEmblem.png" alt="Store Logo" style={{ maxWidth: '120px' }} />
        <StoreInfoDisplay />
      </header>
      <div className="py-12 flex flex-col items-center">
        <ul className="flex flex-col gap-x-6">
          <FeaturedProducts collections={collections} />
        </ul>
      </div>
    </>
);*/
}
