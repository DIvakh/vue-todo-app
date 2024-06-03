<template>
  <div class="user-info" v-if="user">
    <div class="container">
      <h1>{{ user.name }}</h1>
      <div class="row">
        <p>
          Email: <a :href="`mailto:${user.email}`">{{ user.email }}</a>
        </p>
        <p>
          Phone: <a :href="`tel:+${user.phone}`">{{ user.phone }}</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['user']
};
</script>
