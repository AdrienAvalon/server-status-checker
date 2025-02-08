<template>
  <div id="app">
    <ServerStatus />
  </div>
</template>

<script>
import ServerStatus from './components/ServerStatus.vue';

export default {
  components: {
    ServerStatus,
  },
};
</script>

<style>
body {
  margin: 0;
  padding: 0;
  background-color: #121212;
  color: #ffffff;
  font-family: Arial, sans-serif;
}

#app {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>