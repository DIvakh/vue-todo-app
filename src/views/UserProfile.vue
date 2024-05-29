<template>
  <div class="user-profile">
    <div v-if="user">
      <h1>{{ user.name }}</h1>
      <p>Email: {{ user.email }}</p>
      <p>Phone: {{ user.phone }}</p>
    </div>
    <div>
      <h2>Todo List</h2>
      <div>
        <label for="status-filter">Filter by status:</label>
        <select id="status-filter" v-model="statusFilter">
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="uncompleted">Uncompleted</option>
          <option value="favorites">Favorites</option>
        </select>
      </div>
      <div>
        <label for="user-filter">Filter by user ID:</label>
        <select id="user-filter" v-model="userFilter">
          <option value="all">All Users</option>
          <option v-for="user in users" :key="user.id" :value="user.id">
            {{ user.id }}
          </option>
        </select>
      </div>
      <div>
        <input
          type="text"
          placeholder="Search by title"
          v-model="searchQuery"
        />
      </div>
      <ul>
        <li v-for="todo in filteredTodos" :key="todo.id">
          <input
            type="checkbox"
            :checked="todo.completed"
            @change="toggleComplete(todo.id)"
          />
          {{ todo.title }}
          <button @click="toggleFavorite(todo.id)">★</button>
        </li>
      </ul>
    </div>
    <div>
      <h2>Create Todo</h2>
      <input type="number" v-model="newTodo.userId" placeholder="User ID" />
      <input type="text" v-model="newTodo.title" placeholder="Title" />
      <button @click="createTodo">Add</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: ['userId'],
  data() {
    return {
      user: null,
      todos: [],
      users: [],
      statusFilter: 'all',
      userFilter: 'all',
      searchQuery: '',
      newTodo: {
        userId: '',
        title: ''
      },
      favorites: JSON.parse(localStorage.getItem('favorites')) || []
    };
  },
  computed: {
    filteredTodos() {
      return this.todos.filter((todo) => {
        let matchesStatus = true;
        if (this.statusFilter === 'completed') {
          matchesStatus = todo.completed;
        } else if (this.statusFilter === 'uncompleted') {
          matchesStatus = !todo.completed;
        } else if (this.statusFilter === 'favorites') {
          matchesStatus = this.favorites.includes(todo.id);
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
      const [userResponse, todosResponse, usersResponse] = await Promise.all([
        axios.get(`https://jsonplaceholder.typicode.com/users/${this.userId}`),
        axios.get('https://jsonplaceholder.typicode.com/todos'),
        axios.get('https://jsonplaceholder.typicode.com/users')
      ]);
      this.user = userResponse.data;
      this.todos = todosResponse.data;
      this.users = usersResponse.data;
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
    async createTodo() {
      try {
        const response = await axios.post(
          'https://jsonplaceholder.typicode.com/todos',
          this.newTodo
        );
        this.todos.push(response.data);
        this.newTodo.userId = '';
        this.newTodo.title = '';
      } catch (error) {
        console.error('Error creating todo:', error);
      }
    }
  },
  mounted() {
    this.fetchData();
  }
};
</script>

<style scoped>
.user-profile {
  max-width: 600px;
  margin: auto;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  display: flex;
  align-items: center;
}

button {
  margin-left: auto;
}
</style>
