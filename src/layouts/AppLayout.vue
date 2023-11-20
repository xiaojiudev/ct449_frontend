<template>
    <component :is="currentLayout">
        <router-view />
    </component>
</template>

<script setup lang="ts">
import DefaultLayout from './DefaultLayout.vue'
import LoginLayout from './LoginLayout.vue'
import { shallowRef, watch } from 'vue'
import { useRoute } from 'vue-router'

const layoutMap = {
    DefaultLayout,
    LoginLayout,
}

const currentLayout = shallowRef(DefaultLayout)
const route = useRoute()

watch(
    () => route.meta?.layout as string | undefined,
    async (metaLayout) => {
        try {
            // if (metaLayout && layoutMap[metaLayout]) {
            //     currentLayout.value = LoginLayout
            // } else {
            //     currentLayout.value = DefaultLayout
            // }
            currentLayout.value = (metaLayout && layoutMap[metaLayout]) || DefaultLayout
        } catch (e) {
            currentLayout.value = DefaultLayout
        }
    },
    { immediate: true }
)
</script>
