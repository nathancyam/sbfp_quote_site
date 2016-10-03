<template>
  <div>
    <p class="quote-speaker" v-if="plainValue">{{ plainValue }}</p>
    <select-node v-else
     :name-value="personValue"
     :select-value="person"
     :select-options="options"
     @update="update"
    ></select-node>
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
    props: ['personValue', 'person', 'options', 'update', 'plainValue']
  }
</script>
