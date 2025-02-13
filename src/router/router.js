import { createRouter, createWebHistory } from 'vue-router';
import TodoView from "@/todo/view/TodoView.vue";

const routes = [
    {
        path: '/',
        name: 'todos',
        component: TodoView
    }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
});

// Add this for debugging
router.beforeEach((to, from, next) => {
    console.log('Route change:', to.path);
    next();
});

export default router;