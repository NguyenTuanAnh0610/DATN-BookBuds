import axiosClient from "./axiosClient";

const userApi = {

    login(loginData) {
        const url = '/login';
        return axiosClient
            .post(url, loginData)
            .then(response => {
                if (response.token) {
                    localStorage.setItem("token", response.token);
                    localStorage.setItem("user", JSON.stringify(response.user));
                }
                return response;
            });
    },
    register(data) {
        const url = '/register';
        console.log(data);
        return axiosClient.post(url, data);
    },
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },
    changePassword(data) {
        const url = '/users/change-password';
        return axiosClient.post(url, data);
    },
    getUserProfile() {
        const url = '/users/profile';
        return axiosClient.get(url);
    },

    
    
}

export default userApi;