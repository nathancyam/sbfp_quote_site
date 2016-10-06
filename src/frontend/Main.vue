<template>
  <section id="game">
    <nav>
      <router-link to="/start">Start Game</router-link>
      <router-link to="/join">Join Game</router-link>
      <a href="/">Difficulty is too strong. Back down like a coward</a>
    </nav>
    <router-view></router-view>
  </section>
</template>
