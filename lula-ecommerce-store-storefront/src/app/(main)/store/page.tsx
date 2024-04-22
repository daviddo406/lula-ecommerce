import { Metadata } from "next"

import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"

export const metadata: Metadata = {
  title: "Product Page",
  description: "Explore all of our products.",
}

type Params = {
  searchParams: {
    sortBy?: SortOptions
    page?: string
  }
}

export default async function StorePage({ searchParams }: Params) {
  const { sortBy, page } = searchParams

  return <StoreTemplate sortBy={sortBy} page={page} />
}
