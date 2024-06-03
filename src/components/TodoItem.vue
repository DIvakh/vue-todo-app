<template>
  <li class="todo-item">
    <input
      type="checkbox"
      :checked="todo.completed"
      @change="toggleComplete(todo.id)"
    />
    {{ todo.title }}
    <button @click="toggleFavorite(todo.id)">
      <span :class="{ star: true, favorite: todo.isFavorite }">★</span>
    </button>
  </li>
</template>

<script>
export default {
  name: 'TodoItem',
  props: ['todo'],
  methods: {
    toggleFavorite(id) {
      this.$emit('toggleFavorite', id);
    },
    toggleComplete(id) {
      this.$emit('toggleComplete', id);
    }
  }
};
</script>
