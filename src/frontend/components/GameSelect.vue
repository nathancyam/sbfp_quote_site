<template>
  <div>
    <p class="quote-game" v-if="plainValue">{{ plainValue }}</p>
    <select-node v-else :options="options" @update="update" />
  </div>
</template>
<script>
  import SelectNode from './Select.vue';

  export default {
    components: {
      SelectNode
    },
    props: ['options', 'plainValue', 'update']
  }
</script>
