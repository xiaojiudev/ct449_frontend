<template>
    <a-breadcrumb :style="{ margin: '16px 0' }">
        <a-breadcrumb-item>Home</a-breadcrumb-item>
        <a-breadcrumb-item>My Orders</a-breadcrumb-item>
    </a-breadcrumb>
    <div :style="{ background: '#fff', padding: '24px', minHeight: '80vh' }">
        <a-table bordered :data-source="dataSource" :columns="columns">
            <template #bodyCell="{ column, text, record }">
                <template v-if="column.dataIndex === 'total_amount'">
                    <a href="" @click.prevent="showDrawer(record.orderItems)">{{ text }}</a>
                    <!-- Render a list of product items here when clicking in appropriate showDrawer -->
                    <a-drawer v-model:open="open" width="530" root-class-name="root-class-name"
                        :root-style="{ color: 'blue' }" style="color: red" title="Order Details" placement="right"
                        @after-open-change="afterOpenChange">
                        <a-list item-layout="horizontal" :data-source="currentOrderItems">
                            <template #renderItem="{ item }">
                                <a-list-item>
                                    <template #actions>
                                        <div style="color: #333 !important; font-weight: bold; font-size: 18px;">${{
                                            (item.quantity * item.price).toFixed(2) }}</div>
                                    </template>
                                    <a-list-item-meta :description="item.price">
                                        <template #title>
                                            <a :href="'/products/' + item.product" style="font-size: 18px;">{{ item.name
                                            }}</a>
                                        </template>
                                        <template #avatar>
                                            <a-avatar :src="item.image" shape="square"
                                                style="object-fit: cover; height: 64px; width: 64px;" />
                                        </template>
                                    </a-list-item-meta>
                                    <div style="font-size: 18px;">x{{ item.quantity }}</div>
                                </a-list-item>
                            </template>
                        </a-list>
                    </a-drawer>
                </template>
                <template v-if="column.dataIndex === 'status'">
                    <a-tag
                        :color="text === 'pending' ? 'pink' : text === 'delivered' ? 'cyan' : text === 'paid' ? 'green' : 'red'">{{
                            text }}</a-tag>
                </template>
                <template v-if="column.dataIndex === 'operation'">
                    <a-popconfirm title="Sure to received?" :disabled="!shouldShowReceivedButton(record.status)"
                        @confirm="onConfirm(record.order_id)">
                        <a-button type="primary" :disabled="!shouldShowReceivedButton(record.status)">Received</a-button>
                    </a-popconfirm>
                </template>
            </template>
        </a-table>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { Ref } from 'vue';
import axios from 'axios';

interface DataItem {
    key: string;
    order_id: string;
    name: string;
    address: string;
    subtotal: number;
    shippingFee: number;
    total_amount: number;
    status: string;
    orderItems: OrderItem[];
}

interface OrderItem {
    product: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
}
const columns = [
    {
        title: 'Order ID',
        dataIndex: 'order_id',
    },
    {
        title: 'Name',
        dataIndex: 'name',
    },
    {
        title: 'Address',
        dataIndex: 'address',
    },
    {
        title: 'Date Order',
        dataIndex: 'date',
        sorter: (a, b) => {
            const dateA = new Date(a.date.replace(" at", "")).getTime();
            const dateB = new Date(b.date.replace(" at", "")).getTime();

            return dateA - dateB;
        },
    },
    {
        title: 'Subtotal',
        dataIndex: 'subtotal',
        sorter: (a, b) => a.subtotal - b.subtotal,
    },
    {
        title: 'Shipping Fee',
        dataIndex: 'shippingFee',
        sorter: (a, b) => a.shippingFee - b.shippingFee,
    },
    {
        title: 'Total Amount',
        dataIndex: 'total_amount',
        sorter: (a, b) => a.total_amount - b.total_amount,
    },
    {
        title: 'Status',
        dataIndex: 'status',
        filters: [
            { text: 'pending', value: 'pending' },
            { text: 'canceled', value: 'canceled' },
            { text: 'delivered', value: 'delivered' },
            { text: 'paid', value: 'paid' },
        ],
        onFilter: (value, record) => record.status.indexOf(value) === 0,
    },
    {
        title: 'Operation',
        dataIndex: 'operation',
    },
];
const dataSource: Ref<DataItem[]> = ref([]);

const currentOrderItems: Ref<OrderItem[]> = ref([]);
const open = ref<boolean>(false);

const onConfirm = async (orderId: string) => {

    try {

        const updateStatusUrl = `http://localhost:8080/api/v1/orders/${orderId}/updateStatus`;

        const response = await axios.patch(updateStatusUrl, { status: 'paid' }, {
            withCredentials: true,
        });

        if (response.status === 200) {
            fetchOrders()
        }
    } catch (error) {
        console.error('Error updating order status:', error);
    }

};

const shouldShowReceivedButton = (status: string) => {
    return status === 'delivered';
};

const afterOpenChange = (bool: boolean) => {
    console.log('open', bool);
};

const showDrawer = (orderItems: OrderItem[]) => {
    currentOrderItems.value = orderItems;
    open.value = true;
};

const fetchOrders = async () => {
    try {
        const response = await axios.get('http://localhost:8080/api/v1/orders/myOrders', { withCredentials: true });
        if (response.status === 200) {
            const userOrders = response.data.userOrder;
            dataSource.value = userOrders.map((order, index) => ({
                key: order._id,
                order_id: order._id,
                name: order.userFullname,
                address: order.address,
                date: new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    second: 'numeric',
                }),
                subtotal: order.subtotal,
                shippingFee: order.shippingFee,
                total_amount: order.total,
                status: order.status,
                orderItems: order.orderItems,
            }));

            console.log(userOrders);

        }
    } catch (error) {
        console.error('Error fetching orders:', error);
    }
};

fetchOrders();

</script>