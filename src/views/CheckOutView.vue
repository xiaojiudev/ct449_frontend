<template>
    <a-breadcrumb :style="{ margin: '16px 0' }">
        <a-breadcrumb-item>Home</a-breadcrumb-item>
        <a-breadcrumb-item>Checkout</a-breadcrumb-item>
    </a-breadcrumb>
    <div :style="{ background: '#fff', padding: '24px', minHeight: '80vh' }">
        <a-row :gutter="[16, 16]">
            <a-col :span="16">
                <a-table :row-selection="rowSelection" :columns="columns" :data-source="cartItems">
                    <template #bodyCell="{ column, text, record }">
                        <template v-if="column.dataIndex === 'image'">
                            <a-image :width="48" :height="48" style="border-radius: 5px; object-fit: cover;" :src="text" />
                        </template>
                        <template v-if="column.dataIndex === 'subTotal'">
                            <div v-html="record.quantity * record.price"></div>
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
            <a-col :span="8">total column</a-col>
        </a-row>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref, unref, onMounted } from 'vue';
import { useCartStore } from '../store/cartStore';
import { message } from 'ant-design-vue';
import axios from 'axios';


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
const cartItems = ref([]);

const updateQuantity = async (record) => {
    // Update quantity logic
    const { key, quantity } = record;

    console.log(`Quantity change: ${quantity} with key: ${key}`);

    console.log("product id", key);

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
    } catch (error) {
        console.error('Error adding product to cart:', error);
    }
};

const removeItem = async (key) => {
    // Remove item logic
    console.log(key);
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

};

const getTotalPrice = () => {
    // Calculate total price logic
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

        message.success('Deleted selected products from cart successfully');
    } catch (error) {
        console.error('Error deleting selected products from cart:', error);
        message.error('Failed to delete selected products from cart');
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
