import axiosClient from "./axiosClient";

const userApi = {

    login(loginData) {
        const url = '/login';
        return axiosClient
            .post(url, loginData)
            .then(response => {
                console.log(response);
                if (response.token) {
                    localStorage.setItem("token", response.token);
                    localStorage.setItem("user", JSON.stringify(response.user));
                }
                return response;
            });
    },

    // User Controller APIs
    getUserById(id) {
        const url = `/users/${id}`;
        return axiosClient.get(url);
    },

    updateUser(id, data) {
        const url = `/users/${id}`;
        return axiosClient.put(url, data);
    },

    deleteUser(id) {
        const url = `/users/${id}`;
        return axiosClient.delete(url);
    },

    getAllUsers() {
        const url = '/users';
        return axiosClient.get(url);
    },

    createUser(data) {
        const url = '/register';
        return axiosClient.post(url, data);
    },

    
    
}

export default userApi;