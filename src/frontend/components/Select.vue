<template>
  <select v-model="options.selectedValue" :name="name" :id="name" @change="onUpdate">
    <option v-for="option in options.options" :value="option.value">
      {{ option.label }}
    </option>
  </select>
</template>

<script>
  export default {
    props: ['options'],
    computed: {
      name() {
        return this.options.nameAttr;
      }
    },
    methods: {
      onUpdate() {
        this.$emit('update', this.options.selectedValue);
      }
    }
  }
</script>
