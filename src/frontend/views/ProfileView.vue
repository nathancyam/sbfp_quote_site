<template>
  <div class="profile">
    <h1>Profile</h1>
    <div class="profile__input">
      <button type="button" @click="changeName" v-if="!isChangingName">Change Name</button>
      <button type="button" @click="updateName" v-if="isChangingName">Update</button>
    </div>
    <input type="text" v-model="playerName" v-if="isChangingName">
    <div class="profile__name" v-if="!isChangingName">Name: {{ playerName }}</div>
  </div>
</template>
<style>
</style>
<script>
  export default {
    data() {
      return {
        playerName: this.$store.state.player.name,
        isChangingName: this.$store.state.player.name === ''
      };
    },
    created() {
      if (this.$store.state.player.id === '') {
        this.$router.push('/join');
      }
    },
    methods: {
      updateName(event) {
        this.$store.dispatch('updatePlayerName', this.playerName);
        this.isChangingName = false;
      },
      changeName() {
        this.isChangingName = !this.isChangingName;
      }
    }
  }
</script>
