<template>
    <a-layout>
        <a-layout-header
            :style="{ position: 'fixed', zIndex: 1, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }">
            <a class="logo" href="/"></a>
            <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="horizontal"
                :style="{ lineHeight: '64px', minWidth: '300px' }">
                <a-menu-item key="1">
                    <RouterLink to="/">Home</RouterLink>
                </a-menu-item>
                <a-menu-item key="2">Products</a-menu-item>
                <a-menu-item key="3">
                    <RouterLink to="/about">About Us</RouterLink>
                </a-menu-item>
            </a-menu>
            <div style="display: flex; justify-content: space-between; width: 100px;">
                <div style="display: flex; align-items: center;">
                    <a-dropdown :overlay-style="{ width: '500px' }">
                        <a-badge :count="cartStore.totalItemsInCart" size="small">
                            <a-avatar shape="circle" size="large" style="background-color: transparent;">
                                <template #icon>
                                    <ShoppingCartOutlined />
                                </template>
                            </a-avatar>
                        </a-badge>
                        <template #overlay>
                            <a-menu>
                                <a-list item-layout="horizontal" :data-source="cartStore.cartItems">
                                    <template #renderItem="{ item }">
                                        <a-list-item>
                                            <a-list-item-meta>
                                                <template #title>
                                                    <RouterLink :to="`/products/${item.product}`">{{ item.name }}</RouterLink>
                                                </template>
                                                <template #avatar>
                                                    <a-avatar :src="item.image" shape="square" />
                                                </template>
                                            </a-list-item-meta>
                                            <div style="display: flex; justify-content: space-between; width: 30%;">
                                                <div>${{item.price}}</div>
                                                <div>{{item.quantity}}</div>
                                                <div>${{item.subTotal}}</div>
                                            </div>
                                            <template #actions>
                                                <a key="list-loadmore-more">
                                                    <DeleteOutlined />
                                                </a>
                                            </template>
                                        </a-list-item>
                                    </template>
                                </a-list>
                                <div style="width: 100%; display: flex; justify-content: flex-end; padding: 16px 12px;">
                                    <a-button type="primary" size="large">
                                        <RouterLink to="/checkout">Check out</RouterLink>
                                    </a-button>
                                </div>
                            </a-menu>

                        </template>
                    </a-dropdown>
                </div>
                <div v-if="isLoggedIn" style="display: flex; align-items: center;">
                    <a-dropdown>
                        <a-avatar style="background-color: #87d068"
                            src="https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper-thumbnail.png">
                            <template #icon>
                                <UserOutlined />
                            </template>
                        </a-avatar>
                        <template #overlay>
                            <a-menu>
                                <a-menu-item>
                                    <a href="javascript:;">My Cart</a>
                                </a-menu-item>
                                <a-menu-item>
                                    <a href="javascript:;">My Favorite</a>
                                </a-menu-item>
                                <a-menu-item @click="handleLogout">
                                    <a href="javascript:;">Logout</a>
                                </a-menu-item>
                            </a-menu>
                        </template>
                    </a-dropdown>
                </div>
                <div v-else>
                    <RouterLink to="/login">
                        <LoginOutlined style="z-index: 99999; color: #fff; font-size: 24px;"></LoginOutlined>
                    </RouterLink>
                </div>
            </div>
        </a-layout-header>
        <a-layout-content :style="{ padding: '0 50px', marginTop: '64px' }">
            <!-- Content here -->
            <RouterView />
        </a-layout-content>
        <a-layout-footer :style="{ textAlign: 'center' }">
            ©2023 Created by Ly Phat
        </a-layout-footer>
    </a-layout>

    <!-- Slot here -->
    <!-- <slot /> -->
</template>
  
<script lang="ts" setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { ref } from 'vue';
import { message } from 'ant-design-vue';
import { ShoppingCartOutlined, LoginOutlined, UserOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore'; // Import the cart store

import axios from 'axios'



const selectedKeys = ref<string[]>([]);

const authStore = useAuthStore();
const cartStore = useCartStore();
const isLoggedIn = authStore.getIsLoggedIn;

const router = useRouter();

const handleLogout = async () => {
    try {
        await cartStore.clearCartItems();
        await axios.get('http://localhost:8080/api/v1/auth/logout')
        authStore.logout();
        router.push({ path: '/' });
        message.success('Logged out successfully');
        window.location.reload();
    } catch (error) {
        // Handle error
        message.error('Failed to logout');
    }
};

</script>

<style scoped>
.logo {
    width: 48px;
    height: 48px;
    background: rgba(255, 255, 255, 0.2);
    background-image: url(../assets/d.png);
    background-size: cover;
    border-radius: 5px;
    line-height: 100%;
    margin-right: 10px;
    float: left;
}

.site-layout .site-layout-background {
    background: #fff;
}

[data-theme='dark'] .site-layout .site-layout-background {
    background: #141414;
}
</style>
  