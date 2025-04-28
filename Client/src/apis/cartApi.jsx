import axiosClient from './axiosClient';

const cartApi = {
    getCart() {
        const url = '/cart';
        return axiosClient.get(url);
    },

    addToCart(data) {
        const url = '/cart';
        return axiosClient.post(url, data);
    },

    updateQuantity(id, quantity) {
        const url = `/cart/${id}`;
        return axiosClient.put(url, { quantity });
    },

    removeFromCart(id) {
        const url = `/cart/${id}`;
        return axiosClient.delete(url);
    },

    clearCart() {
        const url = '/cart';
        return axiosClient.delete(url);
    },

};

export default cartApi; 