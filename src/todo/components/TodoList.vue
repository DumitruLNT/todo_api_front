<template>
  <div class="todo-list">
    <div class="filters mb-4">
      <button
          v-for="filter in filters"
          :key="filter.value"
          @click="currentFilter = filter.value"
          :class="['btn mr-2', currentFilter === filter.value ? 'btn-primary' : 'btn-outline-primary']"
      >
        {{ filter.label }}
      </button>
    </div>

    <div class="todo-items">
      <div v-for="todo in filteredTodos" :key="todo.id" class="todo-item mb-3 p-3 border rounded">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <input
                type="checkbox"
                :checked="todo.isCompleted"
                @change="toggleTodo(todo)"
                class="mr-2"
            >
            <span :class="{ 'text-decoration-line-through': todo.isCompleted }">
              {{ todo.title }}
            </span>
          </div>
          <div class="todo-actions">
            <button @click="$emit('edit', todo)" class="btn btn-sm btn-outline-primary mr-2">
              Edit
            </button>
            <button @click="deleteTodo(todo.id)" class="btn btn-sm btn-outline-danger">
              Delete
            </button>
          </div>
        </div>
        <div v-if="todo.description" class="mt-2 text-muted">
          {{ todo.description }}
        </div>
        <div v-if="todo.dueDate" class="mt-2 text-sm text-muted">
          Due: {{ formatDate(todo.dueDate) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { todoService} from "@/service/todoService.js";

export default {
  name: 'TodoList',
  props: {
    todos: {
      type: Array,
      required: true
    }
  },
  emits: ['refresh', 'edit'],
  setup(props, { emit }) {
    const currentFilter = ref('all');
    const filters = [
      { label: 'All', value: 'all' },
      { label: 'Active', value: 'active' },
      { label: 'Completed', value: 'completed' }
    ];

    const filteredTodos = computed(() => {
      switch (currentFilter.value) {
        case 'active':
          return props.todos.filter(todo => !todo.isCompleted);
        case 'completed':
          return props.todos.filter(todo => todo.isCompleted);
        default:
          return props.todos;
      }
    });

    const toggleTodo = async (todo) => {
      try {
        if (todo.isCompleted) {
          await todoService.reopenTodo(todo.id);
        } else {
          await todoService.completeTodo(todo.id);
        }
        emit('refresh');
      } catch (error) {
        console.error('Error toggling todo:', error);
      }
    };

    const deleteTodo = async (id) => {
      try {
        await todoService.deleteTodo(id);
        emit('refresh');
      } catch (error) {
        console.error('Error deleting todo:', error);
      }
    };

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString();
    };

    return {
      currentFilter,
      filters,
      filteredTodos,
      toggleTodo,
      deleteTodo,
      formatDate
    };
  }
};
</script>