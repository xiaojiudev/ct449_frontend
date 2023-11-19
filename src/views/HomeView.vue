<template>
    <main>

        <a-row :gutter="[24, 24]">
            <a-col class="gutter-row" :span="6">
                <div class="gutter-box">left sidebar</div>
            </a-col>
            <a-col class="gutter-row" :span="18">
                <div class="gutter-box">
                    <a-row :gutter="[16, 16]">
                        <!-- List of product here a-col is 1 product -->
                        <a-col :span="6" v-for="product in products" :key="product._id" style="user-select: none;">
                            <a-card hoverable style="width: 200px;">
                                <template #cover>
                                    <img :alt="product.name" :src="product.image" height="180" style="object-fit: cover;" />
                                </template>
                                <template #actions>
                                    <PlusCircleOutlined />
                                </template>
                                <a-card-meta :title="product.name">
                                    <template #description>
                                        <div style="font-weight: bold; color: #333; font-size: 20px; text-align: center;">${{ product.price }}</div>
                                    </template>
                                </a-card-meta>
                            </a-card>
                        </a-col>

                    </a-row>

                </div>
            </a-col>
            <a-col class="gutter-row" :span="6"></a-col>
            <a-col class="gutter-row" :span="18" style="display: flex; justify-content: center;">
                <a-pagination v-model:current="current" :total="totalProducts" :default-page-size="8" />
            </a-col>

        </a-row>
    </main>
</template>

<script setup>
import { PlusCircleOutlined } from '@ant-design/icons-vue';
import { ref, onMounted } from 'vue';
import axios from 'axios';

const current = ref(1);
const products = ref([]);
const totalProducts = ref(0);

onMounted(async () => {
    try {
        const response = await axios.get('http://localhost:8080/api/v1/products');
        if (response.status === 200) {
            products.value = response.data.product;
            totalProducts.value = response.data.total_products;
        }
    } catch (error) {
        console.error('Error fetching products:', error);
    }
});
</script>
