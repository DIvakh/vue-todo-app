<template>
  <div class="filter-form">
    <div class="status">
      <label for="status-filter">Filter by status:</label>
      <select
        id="status-filter"
        :value="statusFilter"
        @change="updateStatusFilter($event.target.value)"
      >
        <option value="all">All</option>
        <option value="completed">Completed</option>
        <option value="uncompleted">Uncompleted</option>
        <option value="favorites">Favorites</option>
      </select>
    </div>
    <div class="user-id">
      <label for="user-filter">Filter by user ID:</label>
      <select
        id="user-filter"
        :value="userFilter"
        @change="updateUserFilter($event.target.value)"
      >
        <option value="all">All Users</option>
        <option v-for="user in users" :key="user.id" :value="user.id">
          {{ user.id }}
        </option>
      </select>
    </div>
    <div class="search">
      <input
        type="text"
        placeholder="Search by title"
        :value="searchQuery"
        @input="updateSearchQuery($event.target.value)"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: ['statusFilter', 'userFilter', 'searchQuery', 'users'],
  methods: {
    updateStatusFilter(value) {
      this.$emit('update:statusFilter', value);
    },
    updateUserFilter(value) {
      this.$emit('update:userFilter', value);
    },
    updateSearchQuery(value) {
      this.$emit('update:searchQuery', value);
    }
  }
};
</script>
