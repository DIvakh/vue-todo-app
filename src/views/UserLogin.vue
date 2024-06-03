<template>
  <section class="user-login">
    <div class="container">
      <form class="login-form" @submit.prevent="handleLogin">
        <div :class="{ error: error }" class="login-form_title">
          {{ error ? error : 'Please, login:' }}
        </div>

        <div class="login-form_body">
          <div class="form-inputs">
            <input
              type="text"
              id="username"
              v-model="username"
              @input="validateInput('username', $event)"
              placeholder="Username"
              required
            />

            <input
              type="text"
              id="phone"
              v-model="phone"
              @input="validateInput('phone', $event)"
              placeholder="Phone Number"
              required
            />
          </div>

          <button :class="{ disabled: isFormEmpty }" type="submit">
            Login
          </button>
        </div>
      </form>
    </div>
  </section>
</template>

<script>
const USERS_API = 'https://jsonplaceholder.typicode.com/users';
import axios from 'axios';

export default {
  data() {
    return {
      username: '',
      phone: '',
      error: null,
      users: []
    };
  },
  watch: {
    error: {
      handler() {
        (this.username = ''), (this.phone = '');
      }
    }
  },
  computed: {
    isFormEmpty() {
      return !this.phone.length || !this.username.length;
    }
  },
  methods: {
    validateInput(field, event) {
      this.error = null;
      let value = event.target.value;
      if (field === 'username') {
        this.username = value.replace(/[^a-zA-Z]/g, '');
      } else if (field === 'phone') {
        this.phone = value.replace(/[^0-9\s\W]/g, '');
      }
    },
    handleLogin() {
      if (!this.isFormEmpty) {
        if (this.users.length === 0) {
          this.error = 'No users loaded';
          return;
        }

        const user = this.users.find(
          (user) => user.username === this.username && user.phone === this.phone
        );

        if (user) {
          this.$router.push({
            name: 'UserProfile',
            params: { userId: user.id }
          });
        } else {
          this.error = 'Login error. Please, try again';
        }
      }
    }
  },
  async mounted() {
    try {
      const response = await axios.get(USERS_API);
      this.users = response.data;
    } catch (error) {
      this.error = 'An error occurred while loading users';
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../assets/scss/components/user-login.scss';
</style>
