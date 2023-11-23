<template>
    <a-breadcrumb :style="{ margin: '16px 0' }">
        <a-breadcrumb-item>Home</a-breadcrumb-item>
        <a-breadcrumb-item>Checkout</a-breadcrumb-item>
    </a-breadcrumb>
    <div :style="{ background: '#fff', padding: '24px', minHeight: '80vh' }">
        <a-spin :spinning="isLoading">
            <a-row :gutter="[16, 16]">
                <a-col :span="16">
                    <a-table :row-selection="rowSelection" :columns="columns" :data-source="cartItems">
                        <template #bodyCell="{ column, text, record }">
                            <template v-if="column.dataIndex === 'price'">
                                <div>${{ text.toFixed(2) }}</div>
                            </template>
                            <template v-if="column.dataIndex === 'image'">
                                <a-image :width="48" :height="48" style="border-radius: 5px; object-fit: cover;"
                                    :src="text" />
                            </template>
                            <template v-if="column.dataIndex === 'subTotal'">
                                <div>${{ (record.quantity * record.price).toFixed(2) }}</div>
                            </template>
                            <template v-if="column.dataIndex === 'quantity'">
                                <a-input-number id="inputNumber" v-model:value="record.quantity" defaultValue="1" :min="1"
                                    :max="record.maxQuantity" @change="updateQuantity(record)" />
                            </template>
                            <template v-if="column.dataIndex === 'action'">
                                <a @click="removeItem(record.key)">Delete</a>
                            </template>
                        </template>
                    </a-table>
                </a-col>
                <a-col :span="2"></a-col>
                <a-col :span="6">
                    <a-list bordered :data-source="data">
                        <template #renderItem="{ item }">
                            <a-list-item>
                                <template v-if="item.type === 'address'">
                                    <strong>Address:</strong>
                                    <span
                                        style="display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden;">{{
                                            item.value }}</span>
                                </template>
                                <template v-if="item.type === 'shippingMethod'">
                                    <strong>Shipping Method:</strong>
                                    <a-radio :checked="true">COD</a-radio>
                                </template>
                                <template v-if="item.type === 'shippingFee'">
                                    <strong>Shipping Fee:</strong> {{ cartStore.totalPrice ? item.value : 0 }}
                                </template>
                                <template v-else-if="item.type === 'merchandiseFee'">
                                    <strong>Merchandise Fee:</strong> {{ cartStore.totalPrice }}
                                </template>
                                <template v-else-if="item.type === 'totalFee'">
                                    <strong>Total Fee:</strong> {{ cartStore.totalPrice ? cartStore.totalPrice + 10 : 0 }}
                                </template>
                            </a-list-item>
                        </template>
                        <template #header>
                            <strong style="font-size: 18px; text-align: center; display: block;">Detail Order</strong>
                        </template>
                        <template #footer>
                            <a-button type="primary" @click="checkout">Checkout</a-button>
                        </template>
                    </a-list>
                </a-col>
            </a-row>
        </a-spin>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref, unref, onMounted } from 'vue';
import { useCartStore } from '../store/cartStore';
import { message } from 'ant-design-vue';
import axios from 'axios';
import { useRouter } from 'vue-router';


const router = useRouter();
const isLoading = ref(false);

interface DataType {
    key: string | number;
    image: string;
    name: string;
    price: number;
    quantity: number;
    subtotal: number;
}

const columns = [
    {
        title: 'Image',
        dataIndex: 'image',
    },
    {
        title: 'Product name',
        dataIndex: 'name',
    },
    {
        title: 'Price',
        dataIndex: 'price',
    },
    {
        title: 'Quantity',
        dataIndex: 'quantity',
    },
    {
        title: 'Sub Total',
        dataIndex: 'subTotal',
    },
    {
        title: 'Action',
        dataIndex: 'action',
    },
];

const cartStore = useCartStore();
const cartItems = ref<any[]>([]);

const updateQuantity = async (record) => {
    isLoading.value = true;
    const { key, quantity } = record;

    try {
        await axios.post('http://localhost:8080/api/v1/carts',
            {
                productId: key,
                quantity: quantity,
            },
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        );

        await cartStore.fetchUserCartRequest()
        isLoading.value = false;
    } catch (error) {
        console.error('Error adding product to cart:', error);
        isLoading.value = false;
    }
};

const removeItem = async (key) => {
    isLoading.value = true;
    await cartStore.removeAnItemRequest(key);
    await cartStore.fetchUserCartRequest();

    cartItems.value = cartStore.cartItems.map((item) => ({
        key: item.product,
        image: item.image,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        subTotal: item.subTotal,
    }));

    message.success('Deleted product from cart successfully');
    isLoading.value = false;
};


const selectedRowKeys = ref<DataType['key'][]>([]);

const onSelectChange = (changableRowKeys: string[]) => {

    selectedRowKeys.value = changableRowKeys;
};

const rowSelection = computed(() => {
    return {
        selectedRowKeys: unref(selectedRowKeys),
        onChange: onSelectChange,
        hideDefaultSelections: true,
        selections: [
            {
                key: 'clear',
                text: 'Clear carts',
                onSelect: (changableRowKeys) => {

                    const selectedKeys = Object.keys(selectedRowKeys.value).map((key) => selectedRowKeys.value[key]);

                    removeItemsByKeys(selectedKeys)

                },
            },
        ]
    };
});

const removeItemsByKeys = async (keys) => {
    try {
        isLoading.value = true;
        for (const key of keys) {
            await cartStore.removeAnItemRequest(key);
        }

        await cartStore.fetchUserCartRequest();

        cartItems.value = cartStore.cartItems.map((item) => ({
            key: item.product,
            image: item.image,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            maxQuantity: item.maxQuantity,
            subTotal: item.subTotal,
        }));

        isLoading.value = false;
    } catch (error) {
        console.error('Error deleting selected products from cart:', error);
        isLoading.value = false;
    }
};

// Right column
const data = [
    { type: 'address', value: '137/24 Mau Than street, Ninh Kieu district, Can Tho City' },
    { type: 'shippingMethod' },
    { type: 'shippingFee', value: '$10' },
    { type: 'merchandiseFee' },
    { type: 'totalFee' },
];

// Checkout
const checkout = async () => {
    try {

        if (selectedRowKeys.value.length === 0) {
            message.warning('Please select at least one item to checkout.', 2);
            return;
        }

        isLoading.value = true;
        const unselectedKeys = cartItems.value.map(item => item.key).filter(key => !selectedRowKeys.value.includes(key));
        await removeItemsByKeys(unselectedKeys);

        const order = await axios.post('http://localhost:8080/api/v1/orders', {}, {
            withCredentials: true,
        });

        if (order.status === 201) {
            await cartStore.fetchUserCartRequest()
            isLoading.value = false;
            router.push({ path: `/orders/${order.data.order._id}` });
        }


    } catch (error) {
        console.log(error.response.data.message);
        if (error.response.data.message.includes('Insufficient quantity in stock for products')) {
            message.error(error.response.data.message, 2)
        } else {
            message.error('Nothing in your cart, please add product then checkout!', 2);
        }

        isLoading.value = false;
    }
};

onMounted(async () => {
    await cartStore.fetchUserCartRequest();

    cartItems.value = cartStore.cartItems.map((item, index) => ({
        key: item.product,
        image: item.image,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        maxQuantity: item.maxQuantity,
        subTotal: item.subTotal,
    }));
});


</script>
