<template>
    <a-breadcrumb :style="{ margin: '16px 0' }">
        <a-breadcrumb-item>Home</a-breadcrumb-item>

    </a-breadcrumb>
    <div :style="{ background: '#fff', padding: '24px', minHeight: '80vh' }">
        <main>
            <a-row :gutter="[24, 24]">
                <a-col class="gutter-row" :span="6">
                    <div class="gutter-box">
                        <a-menu v-model:selectedKeys="currentSidebar" mode="vertical" :items="items"
                            @click="handleMenuClick"
                            style="border: 1px solid rgb(235, 237, 240); border-radius: 5px; padding: 22px 8px; " />
                    </div>
                </a-col>
                <a-col class="gutter-row" :span="18">
                    <div class="gutter-box">
                        <a-row :gutter="[16, 16]">
                            <!-- Search -->
                            <a-col :span="24">
                                <a-input-search placeholder="Type to search" style="width: 200px; float: right;"
                                    @search="onSearch" :loading="isSearching" />
                            </a-col>
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
import { BankOutlined, CrownOutlined, KeyOutlined, LikeOutlined, ShopOutlined, ShoppingCartOutlined, ShoppingOutlined, SlackOutlined } from '@ant-design/icons-vue';
import { RouterLink, useRouter } from 'vue-router'
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
const router = useRouter();
const isSearching = ref(false);

const addToCart = async (productId) => {
    try {
        const isLoggedIn = authStore.getIsLoggedIn;

        if (!isLoggedIn) {
            message.info('Please login to add items to the cart', 2);
            router.push({ name: 'login' });
            return;
        } else {
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
        }


    } catch (error) {
        message.error('Failed to add product to cart');
    }
}


const onSearch = async (searchValue) => {
    // console.log('use value', searchValue);
    isSearching.value = true;
    await fetchAllProducts(searchValue);
    isSearching.value = false;
};

const handleMenuClick = async (e) => {
    //   console.log('click', e.key);
    if (e.key === 'flower') {
        await fetchAllProducts(null, 'flower');
        return;
    }

    if (e.key === 'bag') {
        await fetchAllProducts(null, 'bag');
        current.value = 1;
        return;
    }

    if (e.key === 'keychain') {
        await fetchAllProducts(null, 'keychain');
        current.value = 1;
        return;
    }

    if (e.key === 'beanie') {
        await fetchAllProducts(null, 'beanie');
        current.value = 1;
        return;
    }

    if (e.key === 'glove') {
        await fetchAllProducts(null, 'glove');
        current.value = 1;
        return;
    }

    await fetchAllProducts();

};

onMounted(async () => {
    try {

        await fetchAllProducts()

    } catch (error) {
        console.error('Error fetching products:', error);
    }
});

const fetchAllProducts = async (searchValue, category) => {

    let url = 'http://localhost:8080/api/v1/products'

    if (searchValue) {
        url += `?search=${searchValue}`
    }

    if (category) {
        url += `?category=${category}`
    }

    const response = await axios.get(url);
    if (response.status === 200) {
        products.value = response.data.product;
        totalProducts.value = response.data.total_products;
    }

    if (authStore.getIsLoggedIn === true) {
        await cartStore.fetchUserCartRequest();
        await showBadge();
    }
    isSearching.value = false;
};


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

import { h, } from 'vue';
import { UnorderedListOutlined, RightOutlined } from '@ant-design/icons-vue';

const currentSidebar = ref(['mail']);
const items = ref([
    {
        key: 'category',
        icon: () => h(UnorderedListOutlined),
        label: 'Category',
        title: 'Category',
    },
    { type: 'divider' },
    {
        key: 'all',
        icon: () => h(ShopOutlined),
        label: 'All Products',
        title: 'All Products',
    },
    {
        key: 'flower',
        icon: () => h(SlackOutlined),
        label: 'Flower',
        title: 'Flower',
    },
    {
        key: 'bag',
        icon: () => h(ShoppingOutlined),
        label: 'Hand Bag',
        title: 'Hand Bag',
    },
    {
        key: 'keychain',
        icon: () => h(KeyOutlined),
        label: 'Keychain',
        title: 'Keychain',
    },
    {
        key: 'beanie',
        icon: () => h(CrownOutlined),
        label: 'Beanie',
        title: 'Beanie',
    },
    {
        key: 'glove',
        icon: () => h(LikeOutlined),
        label: 'Glove',
        title: 'Glove',
    },

]);
</script>
