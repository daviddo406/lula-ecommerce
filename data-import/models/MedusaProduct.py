class MedusaProduct():

    def __init__(self,
        a_product_id,
        a_product_handle,
        a_product_title,
        a_product_subtitle,
        a_product_description,
        a_product_status,
        a_product_thumbnail,
        a_product_weight,
        a_product_length,
        a_product_width,
        a_product_height,
        a_product_hs_code,
        a_product_origin_country,
        a_product_mid_code,
        a_product_material,
        a_product_collection_title,
        a_product_collection_handle,
        a_product_type,
        a_product_tags,
        a_product_discountable,
        a_product_external_id,
        a_product_profile_name,
        a_product_profile_type,
        a_variant_id,
        a_variant_title,
        a_variant_sku,
        a_variant_barcode,
        a_variant_inventory_quantity,
        a_variant_allow_backorder,
        a_variant_manage_inventory,
        a_variant_weight,
        a_variant_length,
        a_variant_width,
        a_variant_height,
        a_variant_hs_code,
        a_variant_origin_country,
        a_variant_mid_code,
        a_variant_material,
        a_price_eur,
        a_price_usd,
        a_option_1_name,
        a_option_1_value,
        a_image_1_url,
        a_image_2_url):
            self.product_id = a_product_id
            self.product_handle = a_product_handle
            self.product_title = a_product_title
            self.product_subtitle = a_product_subtitle
            self.product_description = a_product_description
            self.product_status = a_product_status
            self.product_thumbnail = a_product_thumbnail
            self.product_weight = a_product_weight
            self.product_length = a_product_length
            self.product_width = a_product_width
            self.product_height = a_product_height
            self.product_hs_code = a_product_hs_code
            self.product_origin_country = a_product_origin_country
            self.product_mid_code = a_product_mid_code
            self.product_material = a_product_material
            self.product_collection_title = a_product_collection_title
            self.product_collection_handle = a_product_collection_handle
            self.product_type = a_product_type
            self.product_tags = a_product_tags
            self.product_discountable = a_product_discountable
            self.product_external_id = a_product_external_id
            self.product_profile_name = a_product_profile_name
            self.product_profile_type = a_product_profile_type
            self.variant_id = a_variant_id
            self.variant_title = a_variant_title
            self.variant_sku = a_variant_sku
            self.variant_barcode = a_variant_barcode
            self.variant_inventory_quantity = a_variant_inventory_quantity
            self.variant_allow_backorder = a_variant_allow_backorder
            self.variant_manage_inventory = a_variant_manage_inventory
            self.variant_weight = a_variant_weight
            self.variant_length = a_variant_length
            self.variant_width = a_variant_width
            self.variant_height = a_variant_height
            self.variant_hs_code = a_variant_hs_code
            self.variant_origin_country = a_variant_origin_country
            self.variant_mid_code = a_variant_mid_code
            self.variant_material = a_variant_material
            self.price_eur = a_price_eur
            self.price_usd = a_price_usd
            self.option_1_name = a_option_1_name
            self.option_1_value = a_option_1_value
            self.image_1_url = a_image_1_url
            self.image_2_url = a_image_2_url

    def getProps(self):
        return [
            self.product_id,
            self.product_handle,
            self.product_title,
            self.product_subtitle,
            self.product_description,
            self.product_status,
            self.product_thumbnail,
            self.product_weight,
            self.product_length,
            self.product_width,
            self.product_height,
            self.product_hs_code,
            self.product_origin_country,
            self.product_mid_code,
            self.product_material,
            self.product_collection_title,
            self.product_collection_handle,
            self.product_type,
            self.product_tags,
            self.product_discountable,
            self.product_external_id,
            self.product_profile_name,
            self.product_profile_type,
            self.variant_id,
            self.variant_title,
            self.variant_sku,
            self.variant_barcode,
            self.variant_inventory_quantity,
            self.variant_allow_backorder,
            self.variant_manage_inventory,
            self.variant_weight,
            self.variant_length,
            self.variant_width,
            self.variant_height,
            self.variant_hs_code,
            self.variant_origin_country,
            self.variant_mid_code,
            self.variant_material,
            self.price_eur,
            self.price_usd,
            self.option_1_name,
            self.option_1_value,
            self.image_1_url,
            self.image_2_url
            ]

