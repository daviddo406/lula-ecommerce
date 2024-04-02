import Medusa from "@medusajs/medusa-js"

const MEDUSA_BACKEND_URL = "http://localhost:7001"

const medusa = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
})

// must be previously logged in or use api token
medusa.admin.users.update(userId, {
  api_token,
})
.then(({ user }) => {
  console.log(user.api_token)
})

// console.log("STARTED")

//TODO
//Determine how to create sales channels
//should start with two by store, desktop and mobile

//TODO
// //Use fetch to create sales channel
// fetch(`{${BACKEND_URL}/admin/sales-channels`, {
//     method: "POST",
//     credentials: "include",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       name: "App",
//       description: "Mobile app",
//     }),
//   })
//   .then((response) => response.json())
//   .then(({ sales_channel }) => {
//     console.log(sales_channel.id)
//   })

//TODO
//add products to sales channel

// fetch(
//     `<BACKEND_URL>/admin/sales-channels/${salesChannelId}/products/batch`,
//     {
//       method: "POST",
//       credentials: "include",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         product_ids: [
//           {
//             id: productId,
//           },
//         ],
//       }),
//     }
//   )
//   .then((response) => response.json())
//   .then(({ sales_channel }) => {
//     console.log(sales_channel.id)
//   })