<script setup>
import {$axios} from '../utils/request'
import BaseModal from '../components/BaseModal.vue'
import ViewUserModal from '../components/ViewUserModal.vue'
import {useRoute} from 'vue-router'
import VPagination from "@hennge/vue3-pagination"
import "@hennge/vue3-pagination/dist/vue3-pagination.css"
import {
    onMounted,
    ref
} from "vue";

const route = useRoute()
let localPermissions = JSON.parse(localStorage.getItem('permissions'))
let selectedToDelUserId = ref();
const beforeDeleteModal = ref(null);
const modalActive = ref(null);
const users = ref([])
const input = ref('')
let canEdit =ref(false)
const currentPage = ref(1);
const payloadData = ref([]);
const modalWarningActive = ref(null);
const id = route.params.id ?? null;
let maxPage = 5;
let userdetail = ref()

const toggleModal = () => {
  modalActive.value = !modalActive.value;
};

const toggleBeforeDeleteModal = () => {
  beforeDeleteModal.value = !beforeDeleteModal.value;
};

const toggleWarningModal = () => {
  modalWarningActive.value = !modalWarningActive.value;
};

onMounted(() => {
    getData()
		editTaskRoleCheck()
})

const showDetail = (id) => {
	let item = JSON.parse(JSON.stringify(users.value))
	item.forEach(element => {
		if (element.id === id){
			userdetail = element
		}
	});
};

const editTaskRoleCheck = () =>{
	const requiredRole = localPermissions.find((roles)=>{
		return roles === 'USER-UPDATE'
	})
	if (requiredRole === 'USER-UPDATE'){
		canEdit = true
	} 
}

const deleteTaskRoleCheck = (userId) =>{
	const requiredRole = localPermissions.find((roles)=>{
		return roles === 'USER-DELETE'
	})

	if (requiredRole === 'USER-DELETE'){
		selectedToDelUserId = userId
		toggleBeforeDeleteModal()
	} else {
		toggleWarningModal()
	}
}

const viewUserDetailRoleCheck =(id) =>{
	const requiredRole = localPermissions.find((roles)=>{
		return roles === 'USER-READ'
	})

	if (requiredRole === 'USER-READ'){
		toggleModal()
		showDetail(id)
	} else {
		toggleWarningModal()
	}
}

const onClickHandler = (page) => {
		$axios.get(`/user?include=roles,permissions&per_page=1&page=${page}`).then((data) => {
			users.value = data.data.data
    })
  };

const getData = () => {
    $axios.get('/user?include=roles,permissions&per_page=1&page=1').then((data) => {
        users.value = data.data.data
				payloadData.value = data.data.payload.pagination
				maxPage = Math.round(data.data.payload.pagination.total / data.data.payload.pagination.per_page)
				
    })
    localPermissions= localPermissions.map(e => e.name)
}
const deleteUser = () => {
    $axios.post('/remove-user-team/' + {
			team_id: id,
			user_id: selectedToDelUserId
		}).then(() => {
        getData(id)
    })
}

</script>

<template class="container">
    <section class="table-header">

        <div class="table-search-and-add-box">

            <div class="input-group">
                <input type="text" v-model="input" placeholder="Search for user(s)"/>
            </div>

        </div>
    </section>

    <section class="table-body">
        <table>
            <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Actions</th>
            </tr>
            </thead>

            <tbody>
            <tr v-for="user in users" :key="user.id">
                <td data-cell="id">{{ user.id }}</td>
                <td data-cell="name"> {{ user.name }}</td>
                <td data-cell="actions">
									<div class="actions-box">
										<div @click="viewUserDetailRoleCheck(user.id)" class="btn view-btn">
												<font-awesome-icon :icon="['fas', 'eye']" />
										</div>
										<div v-if="canEdit === true">
												<router-link :to="{name: 'edit-user', params: { id: user.id }}" class="btn edit-btn">
													<font-awesome-icon :icon="['fas', 'pen-to-square']" />
												</router-link>
										</div>
										<div>
												<button @click="deleteTaskRoleCheck(user.id)" class="btn delete-btn">
													<font-awesome-icon :icon="['fas', 'delete-left']" />
												</button>
										</div>
                  </div>
                </td>
            </tr>

            </tbody>
        </table>
    </section>

		<BaseModal
			:modalActive="modalActive"
			@close-modal="toggleModal"
		>
			<ViewUserModal :userdetail="userdetail"/>
		</BaseModal>

		<BaseModal
			:modalActive="beforeDeleteModal"
			@close-modal="toggleBeforeDeleteModal"
		>		
			<div class="delete-modal-box">
				<h3>Are you sure u want to delete this user?</h3>
				<div class="delete-btn-box">
					<div @click="deleteUser" class="btn-main" type="button">Delete</div>
				</div>

			</div>
		</BaseModal>

		<div class="pagination-body">
			<v-pagination
				v-model="currentPage"
				:pages="maxPage"
				:range-size="1"
				active-color="#FDFDC9"
				@update:modelValue="onClickHandler"
			/>
		</div>
        
        <BaseModal
		:modalActive="modalWarningActive"
		@close-modal="toggleWarningModal"
	>		
		We are sorry but you do not have the permission to do this action
	</BaseModal>
</template>


<style lang="scss" scoped>

.delete-modal-box{
    
		.delete-btn-box{
			display: flex;
			align-items: center;
			flex-direction: column;
			.btn-main{
				background-color: rgb(170, 16, 16);
			}
		}
	}
.actions-box{
	display: flex;
	width: 100%;
}

.actions-box div{
	width: 33.3%;
	text-align: center;
}
.table-header {
    width: 100%;
    justify-content: space-between;
    text-align: center;
}
.pagination-body{
	width: 100%;
	.Pagination{
		justify-content: center;
	}
}

.input-group {
    width: 100%;
    height: 100%;
    background-color: #fff5;
    padding: 0.5rem 1rem;
    border-radius: 2rem;

    display: flex;
    justify-content: center;
    align-items: center;

    transition: .2s;
}

.task-setting {
    width: 100%;
    text-align: center;
}

.task-setting span {
    margin-right: 10px;
    cursor: pointer;
}

.table-search-and-add-box {
    padding: 20px;
}

.view-btn {
    color: green;
}

.edit-btn {
    color: #ebc474;
}

.delete-btn {
    color: red;
}

.table-header .input-group:hover {
    background-color: #FDFDC9;
    box-shadow: 0 .1rem .4rem #0002;
}

.table-header .input-group input {
    width: 100%;
    padding: 0 .5rem 0 .3rem;
    background-color: transparent;
    border: none;
    outline: none;
}

.table-body {
    width: 80%;
    max-height: calc(89% - 1.6rem);
    background-color: #fffb;

    margin: .8rem auto;
    border-radius: .6rem;

    overflow: auto;
    overflow: overlay;
}

.table-body::-webkit-scrollbar {
    width: 0.5rem;
    height: 0.5rem;
}

.table-body::-webkit-scrollbar-thumb {
    border-radius: .5rem;
    background-color: #0004;
    visibility: hidden;
}

.table-body:hover::-webkit-scrollbar-thumb {
    visibility: visible;
}

table {
    width: 100%;
}

table, th, td {
    border-collapse: collapse;
    padding: 1rem;
    text-align: left;
}

thead th {
    position: sticky;
    top: 0;
    left: 0;
    background-color: #1D5D9B;
    color: white;
    cursor: pointer;
    text-transform: capitalize;
}

tbody tr:nth-child(even) {
    background-color: #0000000b;
}

tbody tr {
    --delay: .1s;
    transition: .5s ease-in-out var(--delay), background-color 0s;
}

tbody tr:hover {
    background-color: #fff6 !important;
}

tbody tr td,
tbody tr td p {
    transition: .2s ease-in-out;
}

thead th:hover {
    color: #FDFDC9;
}

@media (max-width: 1000px) {
    th {
        display: none;
    }

    td {
        display: grid;
        gap: 0.5rem;
        grid-template-columns: 15ch auto;
        padding: 0.5rem 1rem;
    }

    td:first-child {
        padding-top: 2rem;
    }

    td:last-child {
        padding-bottom: 2rem;
    }

    td::before {
        content: attr(data-cell) ": ";
        font-weight: 700;
        text-transform: capitalize;
    }
}

</style>
