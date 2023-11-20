import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        isLoggedIn: !!getCookie('token'), 
    }),
    actions: {
        login(isLoggedIn) {
            this.isLoggedIn = isLoggedIn;
        },
        logout() {
            document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC;'; 
            this.isLoggedIn = false;
        }
    },
    getters: {
        getIsLoggedIn() {
            return this.isLoggedIn;
        },
    },
});

export function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);

    if (parts.length === 2) {
        return parts.pop().split(';').shift();
    }
}
