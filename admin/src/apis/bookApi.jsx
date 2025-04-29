import axiosClient from './axiosClient';

const bookApi = {
    createBook(data) {
        const url = '/books';
        return axiosClient.post(url, data);
    },
    getDetailBook(id) {
        const url = '/books/' + id;
        return axiosClient.get(url);
    },
    getListBooks() {
        const url = '/books';
        return axiosClient.get(url);
    },
    updateBook(id, data) {
        const url = '/books/' + id;
        return axiosClient.put(url, data);
    },
    deleteBook(id) {
        const url = '/books/' + id;
        return axiosClient.delete(url);
    },
    
}

export default bookApi; 