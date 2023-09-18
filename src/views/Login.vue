<script setup>
import {$axios} from '../utils/request'
import { useRouter } from 'vue-router'
import store from '../store/store'
const router = useRouter()

import {
    ref,reactive
} from "vue";

const formState = reactive(store.state.registerFormState)
let error = ref(false);
let userdata = ref();

const handleLogin = ()=> {
    const token = localStorage.getItem('token')
    if (token){
        localStorage.clear()
        router.push('/login')
    }
    $axios.post('login',{
        email:formState.email,
        password:formState.password})
        .then((data) => {
            if (data.data.access_token){
            localStorage.setItem('token',data.data.access_token)
            localStorage.setItem('user',JSON.stringify(data.data.user) )
            userdata = data.data.user
            store.state.userLoginData = data.data.user
            $axios.get(`/user/${userdata.id}?include=roles,permissions`).then((data) => {
                store.state.userLoginRole = data.data.data.roles[0].name
								localStorage.setItem('loginRole',store.state.userLoginRole)
								localStorage.setItem('permissions',(JSON.stringify(data.data.data.permissions)))

								window.dispatchEvent(new CustomEvent('role-added', {
									detail: {
										storage: localStorage.getItem('loginRole')
									}
								}));
            })

						$axios.get(`/get-team`).then((data) => {
								localStorage.setItem('userTeams',(JSON.stringify(data.data)))
								store.state.usersTeamData = data.data
								
            })
                router.push('/')
                
            }if(data.data.status) {
                
                router.push('/error-mail')
            }
        }).catch((err) => {
        if(err.response.status == 422) {
            error.value = true
        }
    });

}
</script>

<template>
    <main class="form-register">
        <h1 class="form-header">Please log in</h1>
        <form class="form-container">
            <div class="form-item">
                <label>Email</label>
                <input v-model="formState.email" type="email" class="form-control" name="email" placeholder="name@example.com">
            </div>

            <div class="form-item">
                <label>Password</label>
                <input v-model="formState.password" type="password" class="form-control" name="password" placeholder="Password">
            </div>
            <div v-if="error" class="text-center">
                <span class="text-red-700">Please enter your correct login information</span>
            </div>

            <div class="form-item">
                <button class="btn-main" @click="handleLogin" type="button">Login</button>
            </div>

        </form>
    </main>
</template>

<style>
.form-signin {
    width: 100%;
    max-width: 330px;
    padding: 15px;
    margin: auto;
}

.form-signin .checkbox {
    font-weight: 400;
}

.form-signin .form-floating:focus-within {
    z-index: 2;
}

.form-signin input[type="email"] {
    margin-bottom: -1px;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
}

.form-signin input[type="password"] {
    margin-bottom: 10px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
}
.form-register {
  width: 100%;
  max-width: 600px;
  padding: 0px;
  margin: 10px auto auto auto;
  background-color: #75C2F6;
  border-radius: 0px 0px 15px 15px;
}
.form-header{
  background-color: #1D5D9B;
  color: white;
  border-radius: 0px 0px 15px 15px;
  padding: 10px;
  text-align: center;
}
.btn-main{
  background-color: #1D5D9B;
  padding: 10px 0px 10px 0px;
  height: 100%;
  width: 30%;
  border-radius: 20px;
  border: none;
  color: white;
  text-align: center;
}

.errtext{
  background-color: #ebeb39;
  border-radius: 15px;
  color: red;
  width: 100%;
  display: flex;
  margin-bottom: 10px;
  justify-content: center;
}

.form-item{
  width: 100%;
  display: flex;
  margin-bottom: 10px;
  color: white;
  justify-content: center;

}
.form-item label{
  background-color: #1D5D9B;
  width: 30%;
  border-radius: 15px 0px 0px 15px;
  color: white;
  text-align:left;
  padding: 15px;
}
.form-item input{
  width: 70%;
  border-radius: 0px 15px 15px 0px;
  background-color: #FDFDC9;
}
.form-item .form-floating:focus-within {
  z-index: 2;
}
.form-container {
  width: 100%;
  background-color: #75C2F6;
  padding: 10px 25px 5px 25px;
  box-shadow: -30px 30px 20px rgba(0, 0, 0, 0.2);
  border-radius: 0px 0px 15px 15px;
}
</style>
