import axiosClient from './axiosClient';
import axios from 'axios';

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
    searchOrder(name) {
        const params = {
            name: name.target.value
        }
        const url = '/orders/searchByName';
        return axiosClient.get(url, { params });
    },
   

    // API lấy danh sách đơn hàng của người dùng theo userId
    getOrdersByUserId(userId) {
        const url = `/orders/user/${userId}`;
        return axiosClient.get(url);
    },

    updateOrderStatus(id, status) {
        const url = `/orders/${id}/status`;
        return axiosClient.put(url, { status });
    },

  
}

export default orderApi;
