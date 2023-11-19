<template>
    <!-- <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header> -->
    <a-layout>
        <a-layout-header
            :style="{ position: 'fixed', zIndex: 1, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }">
            <a class="logo" href="/"></a>
            <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="horizontal"  :style="{ lineHeight: '64px' }">
                <a-menu-item key="1">
                    <RouterLink to="/">Home</RouterLink>
                </a-menu-item>
                <a-menu-item key="2">nav 2</a-menu-item>
                <a-menu-item key="3">
                    <RouterLink to="/about">About</RouterLink>
                </a-menu-item>
            </a-menu>
            <div style="display: flex; justify-content: space-between; width: 60px;">
                <ShoppingCartOutlined style="z-index: 99999; color: #fff; font-size: large;" />
                <LoginOutlined style="z-index: 99999; color: #fff; font-size: large;"/>
            </div>
        </a-layout-header>
        <a-layout-content :style="{ padding: '0 50px', marginTop: '64px' }">
            <a-breadcrumb :style="{ margin: '16px 0' }">
                <a-breadcrumb-item>Home</a-breadcrumb-item>
                <a-breadcrumb-item>List</a-breadcrumb-item>
                <a-breadcrumb-item>App</a-breadcrumb-item>
            </a-breadcrumb>
            <div :style="{ background: '#fff', padding: '24px', minHeight: '80vh' }">
                <!-- Content here -->
                <RouterView />
            </div>
        </a-layout-content>
        <a-layout-footer :style="{ textAlign: 'center' }">
            ©2023 Created by Ly Phat
        </a-layout-footer>
    </a-layout>

    <!-- <RouterView /> -->
</template>

<script lang="ts" setup>
import { RouterLink, RouterView } from 'vue-router'
import { ref } from 'vue';
import { ShoppingCartOutlined, LoginOutlined } from '@ant-design/icons-vue';

const selectedKeys = ref<string[]>([]);
</script>

<style scoped>
.logo {
    width: 48px;
    height: 48px;
    background: rgba(255, 255, 255, 0.2);
    background-image: url(./assets/d.png);
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