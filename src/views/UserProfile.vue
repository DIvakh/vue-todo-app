<template>
  <section class="user-profile">
    <UserInfo :user="user" />
    <div class="container">
      <h2>Todo List:</h2>

      <FilterForm
        v-model:statusFilter="statusFilter"
        v-model:userFilter="userFilter"
        v-model:searchQuery="searchQuery"
        :users="users"
      />
      <div class="todo-list">
        <ul v-if="filteredTodos.length">
          <TodoItem
            @toggleFavorite="toggleFavorite"
            @toggleComplete="toggleComplete"
            :todo="todo"
            v-for="todo in filteredTodos"
            :key="todo.id"
          />
        </ul>
        <div class="empty-list" v-else>Nothing to show...</div>
      </div>
      <CreateTodo :users="users" @create-todo="createTodo" />
    </div>
  </section>
  <div class="error">{{ error }}</div>
</template>

<script>
import axios from 'axios';
import TodoItem from '../components/TodoItem.vue';
import FilterForm from '../components/FilterForm.vue';
import CreateTodo from '../components/CreateTodo.vue';
import UserInfo from '../components/UserInfo.vue';

const USERS_API = 'https://jsonplaceholder.typicode.com/users';
const TODOS_API = 'https://jsonplaceholder.typicode.com/todos';

export default {
  props: ['userId'],
  data() {
    return {
      error: null,
      user: null,
      todos: [],
      users: [],
      statusFilter: 'all',
      userFilter: 'all',
      searchQuery: '',
      favorites: JSON.parse(localStorage.getItem('favorites')) || []
    };
  },
  components: { TodoItem, FilterForm, CreateTodo, UserInfo },
  computed: {
    filteredTodos() {
      return this.todos
        .map((todo) => ({
          ...todo,
          isFavorite: this.favorites.includes(todo.id)
        }))
        .filter((todo) => {
          let matchesStatus = true;
          if (this.statusFilter === 'completed') {
            matchesStatus = todo.completed;
          } else if (this.statusFilter === 'uncompleted') {
            matchesStatus = !todo.completed;
          } else if (this.statusFilter === 'favorites') {
            matchesStatus = todo.isFavorite;
          }

          let matchesUser =
            this.userFilter === 'all' || todo.userId === +this.userFilter;

          let matchesSearch = todo.title
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase());

          return matchesStatus && matchesUser && matchesSearch;
        });
    }
  },
  methods: {
    async fetchData() {
      try {
        const [userResponse, todosResponse, usersResponse] = await Promise.all([
          axios.get(`${USERS_API}/${this.userId}`),
          axios.get(TODOS_API),
          axios.get(USERS_API)
        ]);
        this.user = userResponse.data;
        this.todos = todosResponse.data;
        this.users = usersResponse.data;
        this.error = null;
      } catch (error) {
        this.error = error;
      }
    },
    toggleComplete(id) {
      const todo = this.todos.find((todo) => todo.id === id);
      todo.completed = !todo.completed;
    },
    toggleFavorite(id) {
      if (this.favorites.includes(id)) {
        this.favorites = this.favorites.filter((favId) => favId !== id);
      } else {
        this.favorites.push(id);
      }
      localStorage.setItem('favorites', JSON.stringify(this.favorites));
    },
    async createTodo(newTodo) {
      try {
        this.error = null;
        const response = await axios.post(TODOS_API, newTodo);
        this.todos.push(response.data);
      } catch (error) {
        this.error = `Error creating todo: ${error}`;
      }
    }
  },
  mounted() {
    this.fetchData();
  }
};
</script>
<style lang="scss">
@import '../assets/scss/components/user-profile';
</style>
