<script setup>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import TableClients from "../components/TableClients.vue";
import TableServices from "../components/TableServices.vue";

// Instancia del store de vuex
const store = useStore();

// Constante reactiva para saber que tabla se selecciona
const selected = ref(1);

// Propiedades computadas para guardar los state 'clients' y 'services' del store
const clients = computed(() => {
  return store.state.clients;
});

const services = computed(() => {
  return store.state.services;
});
</script>

<template>
  <div class="container-blocks row row-cols-1 row-cols-sm-2">
    <div class="col">
      <div class="container-block" @click="selected = 1">
        <div class="loanding-data" v-if="!clients"></div>
        <div v-if="clients">
          <p class="title">Clientes</p>
          <p class="count">#{{ clients.length }}</p>
        </div>
      </div>
    </div>
    <div class="col">
      <div class="container-block" @click="selected = 2">
        <div class="loanding-data" v-if="!services"></div>
        <div v-if="services">
          <p class="title">Servicios</p>
          <p class="count">#{{ services.length }}</p>
        </div>
      </div>
    </div>
  </div>

  <div class="container-view">
    <div class="container-view-header">
      <p class="title">{{ selected == 1 ? 'Clientes' : 'Servicios' }}</p>
    </div>
    <div class="container-view-body">
      <div class="table-data">
        <TableClients v-if="selected == 1"></TableClients>
        <TableServices v-else-if="selected == 2"></TableServices>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container-blocks {
  width: 95vw;
  max-width: 680px;
  margin: 30px 20px;
}

@media screen and (max-width: 700px) {
  .container-blocks {
    margin: 30px auto;
  }
}

.container-block {
  max-width: 100%;
  width: 310px;
  height: 160px;
  padding: 10px;
  background-color: white;
  box-shadow: 0 0 13px rgba(0, 0, 0, 0.4);
  border-radius: 3px;
  cursor: pointer;
  transition: transform .1s ease-in-out;
  position: relative;
  margin: 10px auto;
}

.container-block:hover {
  transform: translateY(-5px) translateX(5px);
}

.container-block .title {
  font-size: 24px;
  color: rgba(0, 0, 0, 0.86);
  font-weight: 700;
  font-family: 'Plus Jakarta Sans', sans-serif;
  margin-bottom: 5px;
}

.container-block .count {
  font-size: 28px;
  color: rgba(0, 0, 0, 0.86);
  font-weight: 700;
  font-family: 'Plus Jakarta Sans', sans-serif;
  position: absolute;
  right: 15px;
  bottom: 0;
  width: max-content;
}
</style>
