import axiosClient from "./axiosClient";

const shippingAddressApi = {
    createShippingAddress(data) {
        const url = '/shipping-addresses';
        return axiosClient.post(url, data);
    },

    getShippingAddressesByUserId(userId) {
        const url = `/shipping-addresses/user/${userId}`;
        return axiosClient.get(url);
    },

    getAllShippingAddresses() {
        const url = '/shipping-addresses';
        return axiosClient.get(url);
    },

    deleteShippingAddress(id) {
        const url = `/shipping-addresses/${id}`;
        return axiosClient.delete(url);
    },
}

export default shippingAddressApi;
