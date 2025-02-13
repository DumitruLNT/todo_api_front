// todoService.js
import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Simple error handler
apiClient.interceptors.response.use(
    response => response,
    error => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export const todoService = {
    async getAllTodos() {
        const response = await apiClient.get('/todos');
        return response.data;
    },

    async createTodo(todo) {
        const response = await apiClient.post('/todos', todo);
        return response.data;
    },

    async updateTodo(id, todo) {
        const response = await apiClient.put(`/todos/${id}`, todo);
        return response.data;
    },

    async deleteTodo(id) {
        await apiClient.delete(`/todos/${id}`);
    },

    async completeTodo(id) {
        const response = await apiClient.post(`/todos/${id}/complete`);
        return response.data;
    },

    async reopenTodo(id) {
        const response = await apiClient.post(`/todos/${id}/reopen`);
        return response.data;
    },

    // Add back these methods for the stats
    async getOverdueTasks() {
        const response = await apiClient.get('/todos/overdue');
        return response.data;
    },

    async getUpcomingTasks(days = 7) {
        const response = await apiClient.get(`/todos/upcoming/${days}`);
        return response.data;
    }
};