<template>
  <p class="quote-text">{{ quote.text }}</p>
</template>
<script>
  export default{
    props: ['currentQuote'],
    computed: {
      quote() {
        return { text: this.currentQuote.quote };
      }
    }
  }
</script>
