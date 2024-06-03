<template>
  <div class="create-todo">
    <h2>Create Todo</h2>
    <div class="row">
      <input
        type="number"
        min="1"
        :max="users.length"
        v-model="newTodo.userId"
        placeholder="User ID"
      />
      <input type="text" v-model="newTodo.title" placeholder="Title" />
      <button :class="{ disabled: !isFormFilled }" @click="createTodo">
        Add
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      newTodo: {
        userId: '',
        title: ''
      }
    };
  },
  computed: {
    isFormFilled() {
      return !!this.newTodo.userId && !!this.newTodo.title;
    }
  },
  methods: {
    async createTodo() {
      if (this.isFormFilled) {
        try {
          await this.$emit('create-todo', this.newTodo);
          this.newTodo.userId = '';
          this.newTodo.title = '';
        } catch (error) {
          console.error('Error creating todo:', error);
        }
      }
    }
  },
  props: ['users']
};
</script>
