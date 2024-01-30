import type {
    MiddlewaresConfig,
    MedusaRequest,
    MedusaResponse,
    MedusaNextFunction,
  } from "@medusajs/medusa";
import NodeCache from "node-cache";
import axios from"axios";

const authCache = new NodeCache({stdTTL: 2592000});

async function authToken(
    req: MedusaRequest,
    res: MedusaResponse,
    next: MedusaNextFunction
) {
    // Need to check TTL?
    if (!authCache.has("authToken")) {
        const data = {
            client_id: process.env.UBER_CLIENT_ID,
            client_secret: process.env.UBER_CLIENT_SECRET,
            grant_type: "client_credentials",
            scope: "eats.deliveries"
        }
        const authRes = await axios.post("https://auth.uber.com/oauth/v2/token", data, {headers: {"Content-Type": "multipart/form-data"}})
        authCache.set("authToken", authRes.data.access_token, authRes.data.expires_in);
    }
    req.headers.authorization = `Bearer ${authCache.get("authToken")}`;
    next();
}

export const config: MiddlewaresConfig = {
    routes: [
        {
        matcher: "/uber/*",
        middlewares: [authToken],
        },
    ],
};