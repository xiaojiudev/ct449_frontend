<template>
    <div
        style="background-color: white;width: 400px; padding: 48px 16px; border: 1px solid rgb(235, 237, 240); box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1); border-radius: 5px;">
        <a-form :model="formState" name="normal_login" class="login-form" @finish="onFinish" @finishFailed="onFinishFailed"
            :label-col="{ span: 4 }" :wrapper-col="{ span: 8 }">
            <a-form-item label="Email" name="email" :label-col="{ offset: 0, span: 4 }"
                :wrapper-col="{ offset: 1, span: 20 }"
                :rules="[{ required: true, message: 'Please input your email!', pattern: new RegExp('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$') }]">
                <a-input v-model:value="formState.email">
                    <template #prefix>
                        <UserOutlined class="site-form-item-icon" />
                    </template>
                </a-input>
            </a-form-item>

            <a-form-item label="Password" name="password" :label-col="{ offset: 0, span: 4 }"
                :wrapper-col="{ offset: 1, span: 20 }"
                :rules="[{ required: true, message: 'Please input your password!' }]">
                <a-input-password v-model:value="formState.password">
                    <template #prefix>
                        <LockOutlined class="site-form-item-icon" />
                    </template>
                </a-input-password>
            </a-form-item>

            <a-form-item :label-col="{ span: 4 }" :wrapper-col="{ span: 20, offset: 5 }">
                <a-form-item name="remember">
                    <a-checkbox v-model:checked="formState.remember">Remember me</a-checkbox>
                    <a class="login-form-forgot" href="" style="float: right;">Forgot password</a>
                </a-form-item>
            </a-form-item>

            <a-form-item :label-col="{ span: 4 }" :wrapper-col="{ span: 24, offset: 8 }">
                <a-button :disabled="disabled" type="primary" html-type="submit" class="login-form-button">
                    Log in
                </a-button>
                <a-button type="dashed" style="margin-left: 32px;">
                    Register
                </a-button>
            </a-form-item>

        </a-form>
    </div>
</template>
<script lang="ts" setup>
import { reactive, computed } from 'vue';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
import axios from 'axios';
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';



interface FormState {
    email: string;
    password: string;
    remember: boolean;
}
const formState = reactive<FormState>({
    email: '',
    password: '',
    remember: true,
});

const router = useRouter();
const authStore = useAuthStore();
const cartStore = useCartStore();


const onFinish = async (values: any) => {
    try {
        const { email, password, remember } = values;

        const res = await axios.post('http://localhost:8080/api/v1/auth/login', {
            email,
            password
        }, {
            withCredentials: true,
        });

        const { user, msg } = res.data;

        if (msg === "Login successful!") {
            authStore.login(true);
            message.success('Login successfully', 2);
            await cartStore.fetchUserCartRequest()
            router.push({ name: 'home' })
        } else {
            message.error('Please check your account and try again');
        }

    } catch (error) {
        message.error('Something went wrong');
    }
};

const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
};
const disabled = computed(() => {
    return !(formState.email && formState.password);
});
</script>

<style>
.login-form {}
</style>
  