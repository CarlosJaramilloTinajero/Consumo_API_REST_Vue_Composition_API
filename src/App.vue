<script setup>
import { computed } from "vue";
import router from "./routes";
import Navbar from './components/Navbar.vue';
import Footer from "./components/Footer.vue";

const routesGuest = ['login', 'register'];

// Esta propiedad computada verifica si se puede mostrar el navbar
const showNabvar = computed(() => {
  const route = router.currentRoute.value.name;
  return !routesGuest.includes(route);
})

</script>

<template>
  <div id="app">
    <Navbar v-if="showNabvar"></Navbar>
    <div class="container">
      <router-view></router-view>
    </div>
    <Footer v-if="showNabvar"></Footer>
  </div>
</template>

<style scoped></style>
