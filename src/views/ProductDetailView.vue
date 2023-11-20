<template>
    <a-breadcrumb :style="{ margin: '16px 0' }">
        <a-breadcrumb-item>Home</a-breadcrumb-item>
        <a-breadcrumb-item>Product</a-breadcrumb-item>
        <a-breadcrumb-item>{{ product?.name }}</a-breadcrumb-item>
    </a-breadcrumb>
    <div :style="{ background: '#fff', padding: '24px', minHeight: '80vh' }">
        <a-row :gutter="[24, 24]">
            <a-col class="gutter-row" :span="12">
                <div v-if="loading">
                    <a-skeleton-image active style="height: 450px; width: 80%;" />
                </div>
                <div v-else>
                    <a-image :src="product?.image" :alt="product?.name" :height="450" width="85%"
                        style="border-radius: 5px; object-fit: cover;" />
                </div>
            </a-col>
            <a-col class="gutter-row" :span="12">
                <div v-if="loading">
                    <a-skeleton active :paragraph="{ rows: 4 }"/>
                </div>
                <div v-else>
                    <a-descriptions :title="product.name" :column="2">
                        <a-descriptions-item label="Price" :span="1"
                            :content-style="{ color: '#bb0b0b', fontWeight: 'bold' }">${{
                                product.price }}</a-descriptions-item>
                        <a-descriptions-item label="Quantity" :span="1">{{ product.quantityInStock }}</a-descriptions-item>
                        <a-descriptions-item label="Description" :span="2" :content-style="{ textAlign: 'justify' }">
                            <div v-html="product.description"></div>
                        </a-descriptions-item>
                        <a-descriptions-item label="Category" :span="2">
                            <a-tag color="cyan">{{ product.category }}</a-tag>
                        </a-descriptions-item>
                        <a-descriptions-item label="Actions" :span="2">
                            <a-space wrap>
                                <a-button type="dashed" :icon="h(PlusOutlined)" size="large">Add to cart</a-button>
                                <a-button type="primary" :icon="h(ShoppingCartOutlined)" size="large">Buy now</a-button>
                            </a-space>
                        </a-descriptions-item>
                    </a-descriptions>
                </div>
            </a-col>
        </a-row>
    </div>
</template>

<script setup>
import { ref, onMounted, h } from 'vue';
import axios from 'axios';
import { useRouter, useRoute } from 'vue-router';
import { PlusOutlined, ShoppingCartOutlined } from '@ant-design/icons-vue';

const loading = ref(true);
const product = ref(null);

const route = useRoute();
const productId = route.params.id;

onMounted(async () => {
    try {

        const response = await axios.get(`http://localhost:8080/api/v1/products/${productId}`);
        if (response.status === 200) {
            product.value = response.data.product;
            loading.value = false;

        }
    } catch (error) {
        console.error('Error fetching product details:', error);
        loading.value = false;
    }
});

</script>

<style >
.ant-descriptions-title {
    font-size: 28px !important;
    font-weight: 700 !important;
}

span.ant-descriptions-item-label {
    font-size: 16px !important;
    font-weight: bold !important;
}

span.ant-descriptions-item-content {
    font-size: 16px !important;
}

.ant-skeleton-image {
    height: 100% !important;
    width: 100% !important;
}
</style>