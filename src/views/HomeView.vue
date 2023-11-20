<template>
    <a-breadcrumb :style="{ margin: '16px 0' }">
        <a-breadcrumb-item>Home</a-breadcrumb-item>
    </a-breadcrumb>
    <div :style="{ background: '#fff', padding: '24px', minHeight: '80vh' }">
        <main>
            <a-row :gutter="[24, 24]">
                <a-col class="gutter-row" :span="6">
                    <div class="gutter-box">left sidebar</div>
                </a-col>
                <a-col class="gutter-row" :span="18">
                    <div class="gutter-box">
                        <a-row :gutter="[16, 16]">
                            <!-- List of product here a-col is 1 product -->
                            <a-col :span="6" v-for="product in displayedProducts" :key="product._id"
                                style="user-select: none;">
                                <RouterLink :to="`/products/${product._id}`">
                                    <a-card hoverable style="width: 200px;">
                                        <template #cover>
                                            <img :alt="product.name" :src="product.image" height="180"
                                                style="object-fit: cover;" />
                                        </template>
                                        <template #actions>
                                            <a-button type="dashed" shape="circle" size="default"
                                                @click.prevent="addToCart(product._id)">
                                                <template #icon>
                                                    <ShoppingCartOutlined />
                                                </template>
                                            </a-button>
                                        </template>
                                        <a-card-meta :title="product.name">
                                            <template #description>
                                                <div
                                                    style="font-weight: bold; color: #333; font-size: 20px; text-align: center;">
                                                    ${{ product.price }}</div>
                                            </template>
                                        </a-card-meta>
                                    </a-card>
                                </RouterLink>
                            </a-col>

                        </a-row>

                    </div>
                </a-col>
                <a-col class="gutter-row" :span="6"></a-col>
                <a-col class="gutter-row" :span="18" style="display: flex; justify-content: center;">
                    <a-pagination v-model:current="current" :total="totalProducts" @change="handleChangePage"
                        :page-size="8" />
                </a-col>

            </a-row>
        </main>
    </div>
</template>

<script setup>
import { ShoppingCartOutlined } from '@ant-design/icons-vue';
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { message } from 'ant-design-vue';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';



const current = ref(1);
const products = ref([]);
const totalProducts = ref(0);
const cartStore = useCartStore();
const authStore = useAuthStore();


const addToCart = async (productId) => {
    try {
        const addtoCartResponse = await axios.post('http://localhost:8080/api/v1/carts',
            {
                productId,
                quantity: 1
            },
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        );

        if (addtoCartResponse.status == 201) {
            message.success('Product added to cart successfully');
            await cartStore.fetchUserCartRequest();
        } else {
            message.error('Add product to cart failed')
        }

        await showBadge();

    } catch (error) {
        console.error('Error adding product to cart:', error);
        message.error('Failed to add product to cart');
    }
}

onMounted(async () => {
    try {
        const response = await axios.get('http://localhost:8080/api/v1/products');
        if (response.status === 200) {
            products.value = response.data.product;
            totalProducts.value = response.data.total_products;
        }

        if(authStore.getIsLoggedIn === true) {
            await cartStore.fetchUserCartRequest();
            await showBadge();
        }

    } catch (error) {
        console.error('Error fetching products:', error);
    }
});


const showBadge = async () => {
    const cartResponse = await axios.get('http://localhost:8080/api/v1/carts', {
        withCredentials: true
    });

    if (cartResponse.status === 200) {
        const cartItems = cartResponse.data.message.items;
        await cartStore.setTotalItemsInCart(cartItems.length);
    }
}

const displayedProducts = computed(() => {
    const start = (current.value - 1) * 8;
    const end = start + 8;
    return products.value.slice(start, end);
});

const handleChangePage = (pageNumber) => {
    current.value = pageNumber;
};
</script>
