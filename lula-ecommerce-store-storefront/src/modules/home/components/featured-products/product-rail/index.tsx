import { ProductCollection } from "@medusajs/medusa"
import { Text } from "@medusajs/ui"

import InteractiveLink from "@modules/common/components/interactive-link"
import ProductPreview from "@modules/products/components/product-preview"

export default function ProductRail({
  collection,
}: {
  collection: ProductCollection
}) {
  const { products } = collection

  if (!products) {
    return null
  }

  return (
    <div className="content-container py-12 small:py-24">
      <div className="flex justify-between mb-8">
        <Text className="txt-xlarge">{collection.title}</Text>
        <InteractiveLink href={`/collections/${collection.handle}`}>
          View all
        </InteractiveLink>
      </div>
      {/* Adjusted to display 5 items in a row with `grid-cols-5` */}
      <ul className="grid grid-cols-5 gap-x-6 gap-y-12">
        {products.slice(0, 5).map((product) => ( // Also ensure only up to 5 products are displayed
          <li key={product.id}>
            <ProductPreview isFeatured {...product} />
          </li>
        ))}
      </ul>
    </div>
  );
}
