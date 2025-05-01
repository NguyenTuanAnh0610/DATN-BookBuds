import axiosClient from './axiosClient';

const orderApi = {
    /*Danh sách api orders */

    createOrder(data) {
        const url = '/orders';
        return axiosClient.post(url, data);
    },

    getDetailOrder(id) {
        const url = '/orders/' + id;
        return axiosClient.get(url);
    },

    getListOrder() {
        const url = '/orders';
        return axiosClient.get(url);
    },

    deleteOrder(id) {
        const url = "/orders/" + id;
        return axiosClient.delete(url);
    },

    updateOrderStatus(id, status) {
        const url = `/orders/${id}/status`;
        return axiosClient.put(url, { status });
    },
     // API lấy danh sách đơn hàng của người dùng theo userId
     getOrdersByUserId(userId) {
        const url = `/orders/user/${userId}`;
        return axiosClient.get(url);
    },

    
}

export default orderApi;
