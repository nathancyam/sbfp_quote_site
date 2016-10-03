<template>
  <select v-model="selected" v-bind:name="name" v-bind:id="name" v-on:change="onChange">
    <option v-for="option in options" v-bind:value="option.value">
      {{ option.label }}
    </option>
  </select>
</template>

<script>
  export default {
    props: ['selectValue', 'selectOptions', 'nameValue'],
    template: '#tmpl-select',
    data() {
      return {
        name: this.nameValue,
        selected: this.selectValue,
        options: this.selectOptions
      }
    },
    methods: {
      onChange() {
        this.$emit('update', this.selected);
      }
    }
  }
</script>
