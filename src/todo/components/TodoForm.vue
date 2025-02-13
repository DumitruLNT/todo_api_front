<template>
  <div class="todo-form">
    <form @submit.prevent="handleSubmit" class="mb-4">
      <div class="mb-3">
        <label for="title" class="form-label">Title</label>
        <input
            v-model="form.title"
            type="text"
            class="form-control"
            id="title"
            required
        >
      </div>

      <div class="mb-3">
        <label for="description" class="form-label">Description</label>
        <textarea
            v-model="form.description"
            class="form-control"
            id="description"
            rows="3"
        ></textarea>
      </div>

      <div class="mb-3">
        <label for="dueDate" class="form-label">Due Date</label>
        <input
            v-model="form.dueDate"
            type="datetime-local"
            class="form-control"
            id="dueDate"
        >
      </div>

      <button type="submit" class="btn btn-primary">
        {{ editMode ? 'Update' : 'Create' }} Todo
      </button>
      <button
          v-if="editMode"
          type="button"
          @click="$emit('cancel')"
          class="btn btn-outline-secondary ml-2"
      >
        Cancel
      </button>
    </form>
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import { todoService} from "@/service/todoService.js";

export default {
  name: 'TodoForm',
  props: {
    todo: {
      type: Object,
      default: null
    }
  },
  emits: ['submit', 'cancel'],
  setup(props, { emit }) {
    const form = ref({
      title: '',
      description: '',
      dueDate: ''
    });

    const editMode = ref(false);

    watch(() => props.todo, (newTodo) => {
      if (newTodo) {
        form.value = {
          title: newTodo.title,
          description: newTodo.description || '',
          dueDate: newTodo.dueDate ? new Date(newTodo.dueDate).toISOString().slice(0, 16) : ''
        };
        editMode.value = true;
      } else {
        form.value = {
          title: '',
          description: '',
          dueDate: ''
        };
        editMode.value = false;
      }
    }, { immediate: true });

    const handleSubmit = async () => {
      try {
        const todoData = {
          title: form.value.title,
          description: form.value.description || null,
          dueDate: form.value.dueDate || null
        };

        let result;
        if (editMode.value && props.todo) {
          result = await todoService.updateTodo(props.todo.id, todoData);
        } else {
          result = await todoService.createTodo(todoData);
        }

        // Emit the result along with the submit event
        emit('submit', result);

        form.value = {
          title: '',
          description: '',
          dueDate: ''
        };
      } catch (error) {
        console.error('Error submitting todo:', error);
      }
    };

    return {
      form,
      editMode,
      handleSubmit
    };
  }
};
</script>