<template>
    <div style="width: 50vh">
        <a-form :model="formState" name="normal_login" class="login-form" @finish="onFinish" @finishFailed="onFinishFailed">
            <a-form-item label="Email" name="email" :rules="[{ required: true, message: 'Please input your email!' }]">
                <a-input v-model:value="formState.email">
                    <template #prefix>
                        <UserOutlined class="site-form-item-icon" />
                    </template>
                </a-input>
            </a-form-item>

            <a-form-item label="Password" name="password"
                :rules="[{ required: true, message: 'Please input your password!' }]">
                <a-input-password v-model:value="formState.password">
                    <template #prefix>
                        <LockOutlined class="site-form-item-icon" />
                    </template>
                </a-input-password>
            </a-form-item>

            <a-form-item>
                <a-form-item name="remember" no-style>
                    <a-checkbox v-model:checked="formState.remember">Remember me</a-checkbox>
                </a-form-item>
                <a class="login-form-forgot" href="">Forgot password</a>
            </a-form-item>

            <a-form-item>
                <a-button :disabled="disabled" type="primary" html-type="submit" class="login-form-button">
                    Log in
                </a-button>
                Or
                <a href="">register now!</a>
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
            message.success('Login successfully');
            await cartStore.fetchUserCart()
            router.push({ path: '/' })
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
<style scoped>
/* #components-form-demo-normal-login .login-form {
    max-width: 300px;
}

#components-form-demo-normal-login .login-form-forgot {
    float: right;
}

#components-form-demo-normal-login .login-form-button {
    width: 100%;
} */
</style>
  