<template>
    <a-breadcrumb :style="{ margin: '16px 0' }">
        <a-breadcrumb-item>Home</a-breadcrumb-item>
        <a-breadcrumb-item>Order Result</a-breadcrumb-item>
    </a-breadcrumb>
    <div :style="{ background: '#fff', padding: '24px', minHeight: '70vh', maxHeight: '70vh' }">
        <a-result status="success" title="Your Order Will Be Delivered Soon!"
            :sub-title="subTitle">
            <template #extra>
                <a-button type="primary">
                    <RouterLink to="/myOrders">Track Orders</RouterLink>
                </a-button>
                <a-button key="buy">
                    <RouterLink to="/">Buy Again</RouterLink>
                </a-button>
            </template>
        </a-result>
    </div>
</template>
<script lang="ts" setup>
import { useRoute } from 'vue-router';

const route = useRoute();
const orderId = route.params.id;
const subTitle  = `Your order has been successfully placed. Order number: ${orderId}`
</script>