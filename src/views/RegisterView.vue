<template>
    <div
        style="background-color: white;width: 400px; padding: 48px 16px; border: 1px solid rgb(235, 237, 240); box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1); border-radius: 5px;">
        <a-form :model="formState" name="register" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" autocomplete="off"
            @finish="onFinish" @finishFailed="onFinishFailed" :rules="rules">
            <a-form-item label="Email" name="email">
                <a-input v-model:value="formState.email" />
            </a-form-item>

            <a-form-item label="Password" name="password">
                <a-input-password v-model:value="formState.password" />
            </a-form-item>

            <a-form-item label="Confirm Password" name="confirmpw">
                <a-input-password v-model:value="formState.confirmpw" />
            </a-form-item>

            <a-form-item label="Name" name="name">
                <a-input v-model:value="formState.name" />
            </a-form-item>

            <a-form-item name="agree" :wrapper-col="{ offset: 8, span: 16 }">
                <a-checkbox-group v-model:value="formState.agree">
                    <a-checkbox value="true" name="agree">I agree to the <a href="">Dandelion Terms</a></a-checkbox>
                </a-checkbox-group>
            </a-form-item>

            <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
                <a-button type="primary" html-type="submit">Submit</a-button>
                <a-button type="dashed" style="margin-left: 32px;">
                    <RouterLink to="/login">Login</RouterLink>
                </a-button>
            </a-form-item>
        </a-form>
    </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import type { Rule } from 'ant-design-vue/es/form';
import { message } from 'ant-design-vue';
import axios from 'axios';
import { useRouter } from 'vue-router';


const router = useRouter();

interface FormState {
    email: string;
    password: string;
    confirmpw: string;
    name: string;
    agree: string[];
}

const formState = reactive<FormState>({
    email: '',
    password: '',
    confirmpw: '',
    name: '',
    agree: [],
});

const rules: Record<string, Rule[]> = {
    email: [
        {
            required: true,
            message: 'Please input your email!',
            pattern: new RegExp('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')
        }
    ],
    password: [
        {
            required: true,
            message: 'Please input your password!',
        }
    ],
    confirmpw: [
        {
            required: true,
            message: 'Please input your confirm password!',
        }
    ],
    name: [
        {
            required: true,
            message: 'Please input your name!',
        }
    ],
    agree: [
        {
            type: 'array',
            required: true,
            message: 'Please select at least one activity type',
            trigger: 'change',
        },
    ],
}


const onFinish = async (values: any) => {

    try {
        const { email, password, name } = values;

        const res = await axios.post('http://localhost:8080/api/v1/auth/register', {
            email,
            password,
            name
        })


        if (res.status === 201) {
            router.push({ name: 'login' })
            message.success('Registration successfull', 2);
        } else {
            message.error('Registration failed', 2)
        }

    } catch (error) {
        
        if(error.response?.data?.msg) {
            message.error(error.response?.data?.msg);
        } else {
            message.error('Something went wrong while registering', 2);
        }
        
    }

};

const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
};
</script>

