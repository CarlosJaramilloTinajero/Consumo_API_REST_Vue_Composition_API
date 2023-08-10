<script setup>
import { computed } from "vue";
import router from "./routes";
import Navbar from './components/Navbar.vue';

// Esta propiedad computada verifica si se puede mostrar el navbar
const showNabvar = computed(() => {
  const route = router.currentRoute.value.name;
  return route != 'login' && route != 'register';
})

</script>

<template>
  <div id="app">
    <Navbar v-if="showNabvar"></Navbar>
    <div class="container">
      <router-view></router-view>
    </div>
  </div>
</template>

<style scoped></style>
