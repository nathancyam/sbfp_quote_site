<template>
  <ul>
    <li v-for="challenger in challengers">
      <p>{{ challenger.name }}</p>
    </li>
  </ul>
</template>
<style>
</style>
<script>
  export default {
    computed: {
      challengers() {
        return this.$store.state.challengers;
      }
    },
    data() {
      return {};
    }
  }
</script>
