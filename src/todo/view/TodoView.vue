<template>
  <div class="todo-view container my-4">
    <h1 class="mb-4">Todo App</h1>

    <div class="row">
      <div class="col-md-4">
        <TodoForm
            :todo="selectedTodo"
            @submit="handleFormSubmit"
            @cancel="selectedTodo = null"
        />

        <div class="mt-4">
          <h3>Quick Stats</h3>
          <div class="stats mt-3">
            <div class="card mb-2">
              <div class="card-body">
                <h5 class="card-title">Overdue</h5>
                <p class="card-text text-danger">{{ overdueTasks.length }} tasks</p>
              </div>
            </div>
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">Upcoming (7 days)</h5>
                <p class="card-text text-primary">{{ upcomingTasks.length }} tasks</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-8">
        <TodoList
            :todos="todos"
            @refresh="fetchTodos"
            @edit="handleEdit"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import TodoList from "@/todo/components/TodoList.vue";
import TodoForm from "@/todo/components/TodoForm.vue";
import { todoService } from "@/service/todoService.js";

export default {
  name: 'TodoView',
  components: {
    TodoList,
    TodoForm
  },
  setup() {
    const todos = ref([]);
    const selectedTodo = ref(null);
    const overdueTasks = ref([]);
    const upcomingTasks = ref([]);

    const fetchTodos = async () => {
      try {
        const [allTodos, overdueResults, upcomingResults] = await Promise.all([
          todoService.getAllTodos(),
          todoService.getOverdueTasks(),
          todoService.getUpcomingTasks()
        ]);

        todos.value = allTodos;
        overdueTasks.value = overdueResults || [];
        upcomingTasks.value = upcomingResults || [];
      } catch (error) {
        console.error('Error fetching todos:', error);
        todos.value = [];
      }
    };

    const handleFormSubmit = async (newTodo) => {
      if (selectedTodo.value) {
        // Update existing todo in the list
        const index = todos.value.findIndex(t => t.id === selectedTodo.value.id);
        if (index !== -1) {
          todos.value[index] = newTodo;
        }
      } else {
        // Add new todo to the list
        todos.value = [...todos.value, newTodo];
      }

      // Update stats
      try {
        const [overdueResults, upcomingResults] = await Promise.all([
          todoService.getOverdueTasks(),
          todoService.getUpcomingTasks()
        ]);
        overdueTasks.value = overdueResults || [];
        upcomingTasks.value = upcomingResults || [];
      } catch (error) {
        console.error('Error updating stats:', error);
      }

      selectedTodo.value = null;
    };

    const handleEdit = (todo) => {
      selectedTodo.value = { ...todo };
    };

    onMounted(() => {
      fetchTodos();
    });

    return {
      todos,
      selectedTodo,
      overdueTasks,
      upcomingTasks,
      fetchTodos,
      handleFormSubmit,
      handleEdit
    };
  }
};
</script>