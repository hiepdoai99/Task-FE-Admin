import Login from "../views/LoginPage.vue";
import Index from "../views/IndexPage.vue";
import AdminPage from "../views/AdminPage.vue";
import Logout from "../views/LogoutPage.vue";
import EditUser from "../views/EditUser.vue";
import NotFoundPage from "../views/NotFoundPage.vue";
import AddTeam from "../views/AddTeam.vue";

import { createRouter, createWebHistory } from "vue-router";
import store from "../store/store";
import { computed } from "vue";

let selectedProjectId = computed(() => {
    return store.state.selectedProjectId;
});

let storePermissionList = computed(() => {
    return store.state.storePermissions;
});

const routeGuardByPermission = (permissionName) => {
    const requiredRole = storePermissionList.value.find((roles) => {
        return roles === permissionName;
    });
    if (requiredRole === permissionName) {
        return true;
    } else {
        return {
            name: "notFoundPage",
        };
    }
};

const routeGuarding = (to) => {
    const currRouteName = to.name;
    const loginRole = localStorage.getItem("loginRole");
    let localPermissions = JSON.parse(localStorage.getItem("permissions"));
    localPermissions = localPermissions.map((e) => e.name);
    store.state.storePermissions = localPermissions;
    console.log("state storePermissions index", store.state.storePermissions);
    if (currRouteName === "admin") {
        if (loginRole === "ROOT" || loginRole === "ADMIN") {
            return true;
        } else {
            return {
                name: "notFoundPage",
            };
        }
    } else if (currRouteName === "team") {
        if (
            loginRole === "TEAMLEADER" ||
            loginRole === "ROOT" ||
            loginRole === "ADMIN"
        ) {
            return true;
        } else {
            return {
                name: "notFoundPage",
            };
        }
    } else if (currRouteName === "todo") {
        if (selectedProjectId.value !== null) {
            return true;
        } else {
            return {
                name: "notFoundPage",
            };
        }
    } else if (currRouteName === "edit") {
        return routeGuardByPermission("TASK-UPDATE");
    } else if (currRouteName === "edit-team") {
        return routeGuardByPermission("TEAM-UPDATE");
    } else if (currRouteName === "add-project") {
        return routeGuardByPermission("PROJECT-CREATE");
    } else if (currRouteName === "edit-project") {
        return routeGuardByPermission("PROJECT-UPDATE");
    } else if (currRouteName === "edit-user") {
        return routeGuardByPermission("USER-UPDATE");
    } else if (currRouteName === "add-team") {
        return routeGuardByPermission("TEAM-CREATE");
    } else {
        return true;
    }
};

const routerCustom = [
    {
        path: "/login",
        name: "login",
        component: Login,
    },
    {
        path: "/",
        name: "index",
        component: Index,
    },
    {
        path: "/logout",
        name: "logout",
        component: Logout,
    },
    {
        path: "/add-team",
        name: "add-team",
        component: AddTeam,
        beforeEnter: [routeGuarding],
    },
    {
        path: "/edit-team/:id",
        name: "edit-team",
        component: AddTeam,
        beforeEnter: [routeGuarding],
    },

    {
        path: "/admin",
        name: "admin",
        component: AdminPage,
        beforeEnter: [routeGuarding],
    },
    {
        path: "/EditUser/:id",
        name: "edit-user",
        component: EditUser,
        beforeEnter: [routeGuarding],
    },
    {
        path: "/notFound",
        name: "notFoundPage",
        component: NotFoundPage,
    },
];

const createCustomRouter = () =>
    createRouter({
        history: createWebHistory(""),
        routes: routerCustom,
        scrollBehavior(to) {
            if (to.hash) {
                return {
                    el: to.hash,
                    behavior: "smooth",
                };
            }
        },
    });

const router = createCustomRouter();

router.beforeEach(async (to, from, next) => {
    // set title
    const appName = "TodoList";
    document.title = to.meta?.title ? to.meta.title + " - " + appName : appName;

    const token = localStorage.getItem("token");
    const isProtectedRoute = to.name !== "login";
    const register = to.name !== "register";
    const error_mail = to.name !== "error-mail";
    const very_mail = to.name !== "verify-mail";

    if (very_mail && error_mail && register && isProtectedRoute && !token) {
        next({
            name: "login",
        });
        return;
    }
    next();
});

export default router;
