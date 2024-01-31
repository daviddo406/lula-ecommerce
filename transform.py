import csv

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




with open('LULA_TO_MEDUSA_IMPORT.csv', 'w', newline='') as csvfile:
    spamwriter = csv.writer(csvfile, delimiter=';',
                            quotechar='|', quoting=csv.QUOTE_MINIMAL)

    ##read Lula csv
    with open('lula_store_item_data.csv', newline='') as csvfile:
        reader = csv.reader(csvfile, delimiter=',', quotechar='|', )
        next(reader, None)
        for ind, row in enumerate(reader):
            store_name = row[1].replace("\"","")
            si_name = row[2].replace("\"","")
            si_size = row[3].replace("\"","")
            git_size = row[4].replace("\"","")
            unit_count = row[5].replace("\"","")
            si_id = row[6].replace("\"","")
            git_id = row[7].replace("\"","")
            store_item_active = row[8].replace("\"","")
            si_instock = row[9].replace("\"","")
            si_image = row[10].replace("\"","")
            git_image = row[11].replace("\"","")
            price = row[12].replace("\"","")
            si_upc = row[13].replace("\"","")
            git_upc = row[14].replace("\"","")
        

            ##TODO
            ##map Lula obj into Medusa product
            spamwriter.writerow([
    si_id, "", si_name, "", "", store_item_active, "", git_size, "", "", "", "", "", "", "", "", "", "", "", "", 
    git_id, "", "", "", "", "", "", unit_count, "", "", "", "", "", "", "", "", "", "", "", price, "", "", si_image, git_image])

        




