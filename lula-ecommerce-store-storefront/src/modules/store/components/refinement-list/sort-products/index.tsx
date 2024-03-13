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
  { label: "Featured Products", url: "http://localhost:8000/collections/featured" },
  { label: "Snacks", url: "http://localhost:8000/collections/snack" },
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
        <span>Collections:</span>
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
