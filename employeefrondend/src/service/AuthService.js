import apiClient from "./apiClient";

const AUTH_BASE = "/auth";

class AuthService {

    register(username, email, password) {
        return apiClient.post(`${AUTH_BASE}/register`, { username, email, password })
            .then((res) => {
                this.storeSession(res.data);
                return res.data;
            });
    }

    login(username, password) {
        return apiClient.post(`${AUTH_BASE}/login`, { username, password })
            .then((res) => {
                this.storeSession(res.data);
                return res.data;
            });
    }

    logout() {
        localStorage.removeItem("ems_token");
        localStorage.removeItem("ems_username");
        localStorage.removeItem("ems_role");
    }

    storeSession(authResponse) {
        localStorage.setItem("ems_token", authResponse.token);
        localStorage.setItem("ems_username", authResponse.username);
        localStorage.setItem("ems_role", authResponse.role);
    }

    getToken() {
        return localStorage.getItem("ems_token");
    }

    getUsername() {
        return localStorage.getItem("ems_username");
    }

    getRole() {
        return localStorage.getItem("ems_role");
    }

    isAdmin() {
        return this.getRole() === "ADMIN";
    }

    isAuthenticated() {
        return !!this.getToken();
    }
}

export default new AuthService();
