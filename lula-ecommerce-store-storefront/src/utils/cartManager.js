"use client"
import medusaClient from './medusaClient'

const CART_KEY_PREFIX = "cart_id_for_sales_channel_";

export const getCartIdForChannel = (salesChannelId) => {
    return localStorage.getItem(`${CART_KEY_PREFIX}${salesChannelId}`);
}

export const setCartIdForChannel = (salesChannelId, cartId) => {
    localStorage.setItem(`${CART_KEY_PREFIX}${salesChannelId}`, cartId);
}


export const createOrUpdateCart = async (salesChannelId) => {
    let cartId = getCartIdForChannel(salesChannelId);
    console.log(cartId + " for sales channel: " + salesChannelId);
    let cart;

    if (cartId) {
        try {
            cart = await medusaClient.carts.retrieve(cartId);
        } catch (error) {
            console.error("Failed to retrieve cart:", error);
        }
    }

    if (!cart) {
        try {
            const response = await medusaClient.carts.create({
                sales_channel_id: salesChannelId
            });
            cart = response.cart;
            setCartIdForChannel(salesChannelId, cart.id);
        } catch (error) {
            console.error("Failed to create cart:", error);
        }
    }

    return cart;
};



