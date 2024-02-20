import csv
import re


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


def is_null_or_empty(string):
    if (not string or string == "" or string == "NULL"):
        return True
    return False

## returns field1 if both are filled
def get_filled_field(field1, field2):
    if (is_null_or_empty(field1) and is_null_or_empty(field2)):
        return None
    elif (is_null_or_empty(field1)):
        return field2
    else:
        return field1

def generate_handle(title, upc):
    handle = "-".join(title.split(" ")).lower()
    handle += "-" + str(upc)
    return handle


def write_template_header(writer):
    ##write header
    writer.writerow([
        "Product Id",
        "Product Handle",
        "Product Title",
        "Product Subtitle",
        "Product Description",
        "Product Status",
        "Product Thumbnail",
        "Product Weight",
        "Product Length",
        "Product Width",
        "Product Height",
        "Product HS Code",
        "Product Origin Country",
        "Product MID Code",
        "Product Material",
        "Product Collection Title",
        "Product Collection Handle",
        "Product Type",
        "Product Tags",
        "Product Discountable",
        "Product External Id",
        "Product Profile Name",
        "Product Profile Type",
        "Variant Id",
        "Variant Title",
        "Variant SKU",
        "Variant Barcode",
        "Variant Inventory Quantity",
        "Variant Allow Backorder",
        "Variant Manage Inventory",
        "Variant Weight",
        "Variant Length",
        "Variant Width",
        "Variant Height",
        "Variant HS Code",
        "Variant Origin Country",
        "Variant MID Code",
        "Variant Material",
        "Price EUR",
        "Price USD",
        "Option 1 Name",
        "Option 1 Value",
        "Image 1 Url",
        "Image 2 Url"
    ])

skipped_count = 0
with open('LULA_TO_MEDUSA_IMPORT.csv', 'w', newline='') as csvfile:
    spamwriter = csv.writer(csvfile, delimiter=';',
                            quotechar='|', quoting=csv.QUOTE_MINIMAL)

    write_template_header(spamwriter)

    ##read Lula csv
    found = {}
    with open('./lula-store-data/lula_store_item_dataV2.csv', newline='') as csvfile:
        reader = csv.reader(csvfile, delimiter=',', quotechar='"', )
        next(reader, None)
        for ind, row in enumerate(reader):
            #region MAPPING
            si_id = row[1].replace("\"","")
            git_id = row[2].replace("\"","")
            si_name = row[3].replace("\"","")
            git_name = row[4].replace("\"","")
            si_size = row[5].replace("\"","")
            git_size = row[6].replace("\"","")
            si_count = row[7] # NULL
            git_count = row[8]
            si_desc = row[9]
            git_desc = row[10]
            si_price = row[11]
            si_upc = row[12] # NULL
            git_upc = row[13]
            category = row[14]
            si_image = row[15].replace("{", "").replace("}", "")
            git_image = row[16].replace("{", "").replace("}", "")
            si_active = row[17]
            si_instock = row[18]
            tags = row[19].replace("{", "").replace("}", "")
            #endregion

            #region Special Handling on Columns
            title = get_filled_field(si_name, git_name)

            if (title == None):
                print("SKIPPED: " + si_id)
                skipped_count += 1
                continue


            if (si_size == "NULL" or not si_size.isdigit()):
                si_size_without_units = 0
            else:
                size_without_units = re.search(r'\d+', si_size)
                if (size_without_units):
                    si_size_without_units = int(size_without_units.group())

            if (git_count == "NULL" or git_count == ""):
                git_count = 9999
            else:
                git_count_without_units = re.search(r'\d+', si_size)
                if (git_count_without_units):
                    git_count = int(git_count_without_units.group())

            if (is_null_or_empty(tags)):
                tags = ""

            upc = get_filled_field(git_upc, si_upc)
            handle = generate_handle(title, upc)
            image = get_filled_field(git_image, si_image)

            # if handle in found:
            #     found[handle] += 1
            # else:
            #     found[handle] = 0

            # handle = handle + "-" + str(found[handle])
            #endregion
            

            product = MedusaProduct(
                a_product_id="",
                a_product_handle=handle,
                a_product_title=title,
                a_product_subtitle="",
                a_product_description=git_desc,
                a_product_status="published",
                a_product_thumbnail=image,
                a_product_weight="",
                a_product_length="",
                a_product_width="",
                a_product_height="",
                a_product_hs_code="",
                a_product_origin_country="",
                a_product_mid_code="",
                a_product_material="",
                a_product_collection_title="",
                a_product_collection_handle="",
                a_product_type=category,
                a_product_tags=tags,
                a_product_discountable="true",
                a_product_external_id=upc,
                a_product_profile_name="",
                a_product_profile_type="",
                a_variant_id="",
                a_variant_title=title,
                a_variant_sku=upc,
                a_variant_barcode="",
                a_variant_inventory_quantity=git_count,
                a_variant_allow_backorder="false",
                a_variant_manage_inventory="true",
                a_variant_weight="",
                a_variant_length="",
                a_variant_width="",
                a_variant_height="",
                a_variant_hs_code="",
                a_variant_origin_country="",
                a_variant_mid_code="",
                a_variant_material="",
                a_price_eur=si_price, #TODO convert US to EU
                a_price_usd=si_price,
                a_option_1_name="",
                a_option_1_value="",
                a_image_1_url=image,
                a_image_2_url="" ## image acts as duplicate if using si_image here
                )

            spamwriter.writerow(product.getProps())


print("SKIPPED ENTRIES: " + str(skipped_count))