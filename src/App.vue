<script setup>
import Navbar from './components/NavBar.vue';
// import Sidebar from './components/Sidebar.vue';
import { RouterView } from 'vue-router';
</script>

<template>
  <div class="app-container">
    <Navbar />
    <div class="main-container">
      <!-- <Sidebar /> -->
      <div class="content">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;

}

.main-container {
  /* display: flex; */
  flex: 1;
}

.content {

}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

@media screen and (max-width: 768px) {
  .content {

  }
  
}
</style>
