import requests
import json

BACKEND_URL = "http://localhost:9000"
EMAIL = "drexel-sd-shopping@gmail.com"
PASSWORD = "SeniorDesign#1234"

s = requests.Session();

headers = {'Content-Type': 'application/json'}

## Authorize session
url = f"{BACKEND_URL}/admin/auth"
payload = {"email": EMAIL, "password": PASSWORD}
res = s.post(url, headers=headers, json=payload)

SALES_CHANNEL_NAMES = [
  "Test Channel 1",
  "Test Channel 2",
  "Test Channel 3"
]

## create sales channels
sales_channel_ids = {}
for name in SALES_CHANNEL_NAMES:
  url = f"{BACKEND_URL}/admin/sales-channels"
  payload = {"name": f"{name}", "description": f"{name} description"}
  res = s.post(url, headers=headers, json=payload)
  res_json = res.json()["sales_channel"];
  sales_channel_ids[name] = res_json['id']
  print(f"Created sales channel {name}: {res_json['id']}")


API_KEY_NAME = "Test API Key"
## create publishable api key
url = f"{BACKEND_URL}/admin/publishable-api-keys"
payload = {"title": f"{API_KEY_NAME}"}
res = s.post(url, headers=headers, json=payload)
pak_json = res.json()["publishable_api_key"]
print("API KEY CREATED")

## link sales channels to api key
url = f"{BACKEND_URL}/admin/publishable-api-keys/{pak_json["id"]}/sales-channels/batch"
parts = []
for i, sales_channel in enumerate(sales_channel_ids.items()):
  parts.append({"id": f"{sales_channel[1]}"})

payload = {"sales_channel_ids": parts}
res = s.post(url, headers=headers, json=payload)
print(f"SALES CHANNEL LINK RES: {res}")