import { defineStore } from 'pinia';
import axios from 'axios';
import { message } from 'ant-design-vue';



export const useCartStore = defineStore('cart', {
    state: () => ({
        totalItemsInCart: Number(localStorage.getItem('totalItemsInCart')) || 0,
        cartItems: JSON.parse(localStorage.getItem('cartItems')) || [],
    }),
    actions: {
        async updateTotalItems(count) {
            this.totalItemsInCart = count;
            localStorage.setItem('totalItemsInCart', JSON.stringify(count));
        },
        async fetchUserCartRequest() {
            try {
                const cartResponse = await axios.get('http://localhost:8080/api/v1/carts', {
                    withCredentials: true,
                });

                console.log(cartResponse.data);
                const cartItems = cartResponse.data.message.items.map((item) => ({
                    product: item.product,
                    name: item.name,
                    quantity: item.quantity,
                    maxQuantity: item.maxQuantity,
                    price: item.price,
                    subTotal: item.subTotal,
                    image: item.image,
                }));

                this.setCartItems(cartItems, cartItems.length);
            } catch (error) {
                console.error('Error fetching user cart:', error);
            }
        },
        async clearCartItemsRequest() {
            try {
                const res = await axios.delete('http://localhost:8080/api/v1/carts/clear', {
                    withCredentials: true
                })

                if (res.status === 200) {
                    clearCartItems()
                } else {
                    message.error('Delete cart items failed')
                }
            } catch (error) {
                console.log("Error when clearing cart items");
            }
        },
        async removeAnItemRequest(id) {
            try {
                const res = await axios.delete(`http://localhost:8080/api/v1/carts/${id}`,
                    {
                        withCredentials: true,
                    }
                );

            } catch (error) {
                throw new Error('Error when deleting product from cart');
            }
        },
        setCartItems(items, quantity) {
            this.cartItems = items;
            this.totalItemsInCart = quantity;
            localStorage.setItem('cartItems', JSON.stringify(items));
            localStorage.setItem('totalItemsInCart', JSON.stringify(quantity));
        },
        retrieveCartItems() {
            const storedCartItems = localStorage.getItem('cartItems');
            if (storedCartItems) {
                this.cartItems = JSON.parse(storedCartItems);
            }
        },
        clearCartItems() {
            this.cartItems = [];
            localStorage.removeItem('cartItems');
            localStorage.removeItem('totalItemsInCart');
        },
        setTotalItemsInCart(value) {
            this.totalItemsInCart = value ?? 0;
        }
    }
})