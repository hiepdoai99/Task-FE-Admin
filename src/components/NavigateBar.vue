<script setup>
import { ref, onMounted } from "vue";
import {$axios} from "../utils/request.js";
import {useRouter} from 'vue-router';
import store from '../store/store'
const router = useRouter()
let roledata = ref('')

// const trackRole = computed(() => {
// 	return store.state.userLoginRole
// })

let isOpen = ref(false);
let adminVisible = ref(false);
let loginVisible = ref(true);
let logoutVisible = ref(false);
let workspaceVisible = ref(false);
const userNameLocal = JSON.parse(localStorage.getItem('user'))

const openMenu = () => {
  isOpen.value = !isOpen.value;
};

onMounted(()=>{
	afterLoginRoleCheck();
	afterReloadRolecheck();
})


const afterLoginRoleCheck = () =>{
		window.addEventListener('role-added', () => {
    roledata.value = localStorage.getItem('loginRole');
		//console.log('roledata.value login check here',roledata.value)

		if (roledata.value === 'ROOT' || roledata.value ==="ADMIN"){
			adminVisible.value = !adminVisible.value
			loginVisible.value = !loginVisible.value
			logoutVisible.value = !logoutVisible.value		
			workspaceVisible.value = !workspaceVisible.value	
		}else if (roledata.value === 'TEAMLEADER') {
			loginVisible.value = !loginVisible.value
			logoutVisible.value = !logoutVisible.value
			workspaceVisible.value = !workspaceVisible.value		
		} else if (roledata.value === 'MEMBER') {
			loginVisible.value = !loginVisible.value
			logoutVisible.value = !logoutVisible.value
			workspaceVisible.value = !workspaceVisible.value		
		}
  });
}

const afterReloadRolecheck = () =>{
    roledata.value = localStorage.getItem('loginRole');
		//console.log('roledata.value reload check here',roledata.value)

		if (roledata.value === 'ROOT' || roledata.value ==="ADMIN"){
			adminVisible.value = !adminVisible.value
			loginVisible.value = !loginVisible.value
			logoutVisible.value = !logoutVisible.value
			workspaceVisible.value = !workspaceVisible.value		
		} else if (roledata.value === 'TEAMLEADER') {
			loginVisible.value = !loginVisible.value
			logoutVisible.value = !logoutVisible.value
			workspaceVisible.value = !workspaceVisible.value		
		} else if (roledata.value === 'MEMBER') {
			loginVisible.value = !loginVisible.value
			logoutVisible.value = !logoutVisible.value
			workspaceVisible.value = !workspaceVisible.value		
		}
  };

const logout = () =>{
    const token = localStorage.getItem('token');
    if (token) {
      $axios.post('/logout')
      localStorage.removeItem('token');
      localStorage.removeItem('user');
			localStorage.removeItem('permissions');
      localStorage.removeItem('loginRole');
			localStorage.removeItem('userTeams');
			localStorage.removeItem('selectedProjectId');
			localStorage.removeItem('projectsFromTeamLocal');
      router.push('/login')
    }
}

</script>

<template>

	<nav class="navbar navbar-expand-lg">
		<div class="container-fluid">
			<button class="navbar-toggler extra-opt-btn " type="button" @click="openMenu()">
				<font-awesome-icon :icon="['fas', 'bars']" style="color: #ffffff;" />

			</button>
			<div :class="isOpen === true ? 'collapse navbar-collapse show' : 'collapse navbar-collapse' " id="navbarSupportedContent">
				<ul class="navbar-nav">
					<li v-show="adminVisible === true" class="nav-item">
						<a class="nav-link" href="#">
								<span v-if="store.state.userLoginData.first_name !== undefined">
									WELCOME! {{ roledata }} user, {{store.state.userLoginData.first_name}} {{store.state.userLoginData.last_name}}
								</span>
								<span v-else-if="userNameLocal !== null">
									WELCOME! {{ roledata }} user, {{userNameLocal.first_name || ''}} {{userNameLocal.last_name || ''}}
								</span>
						</a>
					</li>

					<li v-show="loginVisible === true" class="nav-item">
							<a class="nav-link" href="#">
									<router-link to="/login">Login</router-link>
							</a>

					</li>
					<li  v-show="loginVisible === true" class="nav-item">
							<a class="nav-link" href="#">
									<router-link to="/register">Register</router-link>
							</a>
					</li>
					<li v-show="adminVisible === true" class="nav-item">
							<a class="nav-link" href="#">
									<router-link to="/admin">Admin</router-link>
							</a>
					</li>
					<li v-show="logoutVisible === true" class="nav-item">
							<a class="nav-link" href="/logout" @click="logout">
									Logout
							</a>
					</li>
			</ul>
			</div>
		</div>
	</nav>
</template>

<style scoped lang="scss">
.extra-opt-btn{
 width: 100%;
 text-align: center;
}

.navbar-toggler{
	color: white;
}

.navbar {
    display: flex;
    background-color: #1D5D9B;

    .navbar-nav {
        justify-content: right;
        width: 100%;
    }

    .nav-item {
        .nav-link {
					color: white;
					a {
						color: white;
						text-decoration: unset;
					}
        }
    }
}
</style>
