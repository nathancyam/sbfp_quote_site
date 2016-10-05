<template>
  <div>
    <p class="quote-speaker" v-if="plainValue">{{ plainValue }}</p>
    <select-node v-else :options="options" @update="update" />
  </div>
</template>
<style>
</style>
<script>
  import SelectNode from './Select.vue';

  export default {
    components: {
      SelectNode
    },
    props: ['options', 'plainValue', 'update']
  }
</script>
