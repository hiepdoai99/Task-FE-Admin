<template>
<div></div>
</template>

<script setup>
import {$axios} from '../utils/request'
import {useRouter} from 'vue-router'
import {onMounted, } from "vue";

const router = useRouter()

onMounted(() => {
        const token = localStorage.getItem('token');
        if (token) {
            $axios.post('/logout/')
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('permissions');
            localStorage.removeItem('loginRole');
            localStorage.removeItem('userTeams');
            localStorage.removeItem('selectedProjectId');
			localStorage.removeItem('projectsFromTeamLocal');
            router.push('/login')
        }

})

</script>

<style scoped>

</style>
