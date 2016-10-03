<template>
  <div>
    <p class="quote-game" v-if="plainValue">{{ plainValue }}</p>
    <select-node v-else
     :name-value="showValue"
     :select-value="show"
     :select-options="options"
     @update="update"
    ></select-node>
  </div>
</template>
<script>
  import SelectNode from './Select.vue';

  export default {
    components: {
      SelectNode
    },
    props: ['showValue', 'show', 'options', 'update', 'plainValue']
  }
</script>
