// todoService.js
import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

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

    async getOverdueTasks() {
        try {
            const response = await apiClient.get('/todos/overdue');
            return response.data;
        } catch (error) {
            console.error('Error fetching overdue tasks:', error);
            return [];
        }
    },

    async getUpcomingTasks(days = 7) {
        try {
            const response = await apiClient.get(`/todos/upcoming/${days}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching upcoming tasks:', error);
            return [];
        }
    },
};