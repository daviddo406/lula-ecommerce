"use client"
import { useState } from 'react';
import Link from 'next/link';
import { ChangeEvent } from "react"

import FilterRadioGroup from "@modules/common/components/filter-radio-group"

export type SortOptions = "price_asc" | "price_desc" | "created_at"

type SortProductsProps = {
  sortBy: SortOptions
  setQueryParams: (name: string, value: SortOptions) => void
}

const hardcodedCollections = [
  { label: "All Products", url: "http://localhost:8000/store"},
  { label: "Beverages", url: "http://localhost:8000/collections/beverages" },
  { label: "Snacks", url: "http://localhost:8000/collections/snacks" },
  { label: "Quick Meals", url: "http://localhost:8000/collections/quickmeals" },
  { label: "Grocery", url: "http://localhost:8000/collections/grocery" },
  { label: "Milk", url: "http://localhost:8000/collections/milk" },
  { label: "Bakery", url: "http://localhost:8000/collections/bakery" },
  { label: "Candy", url: "http://localhost:8000/collections/candy" },
  { label: "Seltzer", url: "http://localhost:8000/collections/seltzer" },
  { label: "Water", url: "http://localhost:8000/collections/water" },
  { label: "Alcohol", url: "http://localhost:8000/collections/alcohol" },
  { label: "Wine", url: "http://localhost:8000/collections/wine" },
  { label: "Beer", url: "http://localhost:8000/collections/beer" },
  { label: "Personal Care", url: "http://localhost:8000/collections/personalcare" },
  { label: "Automotive", url: "http://localhost:8000/collections/automotive" },
  { label: "Others", url: "http://localhost:8000/collections/others" },

];

const sortOptions = [
  {
    value: "created_at",
    label: "Latest Arrivals",
  },
  {
    value: "price_asc",
    label: "Price: Low -> High",
  },
  {
    value: "price_desc",
    label: "Price: High -> Low",
  },
]

const SortProducts = ({ sortBy, setQueryParams }: SortProductsProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSortBy = e.target.value as SortOptions;
    setQueryParams("sortBy", newSortBy);
};

  const [selectedCollection, setSelectedCollection] = useState('');

  return (
    <div>
      <div>
        <select value={sortBy} onChange={handleChange}>
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-4">
        <span style={{fontWeight: "bold"}}>Collections</span>
        <ul>
          {hardcodedCollections.map((collection) => (
            <li key={collection.label}>
              <Link href={collection.url}>{collection.label}</Link>

            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};


export default SortProducts
