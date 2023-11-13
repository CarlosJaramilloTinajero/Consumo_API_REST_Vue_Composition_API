<script setup>
import { useStore } from 'vuex';
import router from '../routes';
const store = useStore();

// Funcion para deslogear al usuario usando el action 'logout' del store y redireccionar al login
const logout = () => {
  if (store.dispatch('logout')) {
    router.push('/login');
  }
};
</script>

<template>
  <div class="navbar-c">
    <div class="router-links">
      <router-link class="router-link" to="/"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
          fill="currentColor" class="bi bi-house-fill" viewBox="0 0 16 16">
          <path
            d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L8 2.207l6.646 6.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5Z" />
          <path d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293l6-6Z" />
        </svg><span class="d-none d-lg-flex">Inicio</span></router-link>

      <router-link class="router-link" to="/clientes"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
          fill="currentColor" class="bi bi-person-lines-fill" viewBox="0 0 16 16">
          <path
            d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-5 6s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zM11 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5zm.5 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1h-4zm2 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1h-2zm0 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1h-2z" />
        </svg><span class="d-none d-lg-flex">Clientes</span></router-link>

      <router-link class="router-link" to="/services"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
          fill="currentColor" class="bi bi-bag-fill" viewBox="0 0 16 16">
          <path
            d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5z" />
        </svg><span class="d-none d-lg-flex">Servicios</span></router-link>

      <a class="router-link" @click="logout"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
          fill="currentColor" class="bi bi-box-arrow-left" viewBox="0 0 16 16">
          <path fill-rule="evenodd"
            d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0v2z" />
          <path fill-rule="evenodd"
            d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3z" />
        </svg><span class="d-none d-lg-flex">Logout</span></a>
    </div>
  </div>
</template>

<style scoped>
.navbar-c {
  display: fixed;
  padding: 10px 20px;
  width: 100vw;
  height: 45px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
  background-color: rgb(0, 196, 190);
}

.navbar-c .router-links {
  max-width: 1500px;
  margin: 0 auto;
  display: flex;
}

.router-links .router-link:last-child {
  margin-right: 0;
}

.router-links .router-link {
  display: flex;
  color: white;
  font-size: 19px;
  text-decoration: unset;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
  position: relative;
  padding: 0 15px;
  font-family: 'Roboto', sans-serif;
  cursor: pointer;
}

.router-links .router-link::before {
  content: "";
  position: absolute;
  top: 100%;
  left: 0;
  width: 0;
  background-color: white;
  height: 2px;
  border-radius: 3px;
  transition: width .3s ease-in-out;
}

.router-links .router-link svg {
  fill: white;
  margin-right: 7px;
  width: 22px;
  height: 22px;
  /* margin-bottom: 5px; */
  margin-top: 2px;
}

.router-links .router-link:hover::before {
  width: 100%;
}

@media screen and (min-width: 700px) {
  .router-links .router-link {
    margin-right: 30px;
  }
}


@media screen and (max-width: 700px) {
  .router-links .router-link {
    margin-right: 5px;
  }

  .router-links {
    justify-content: center;
  }
}

@media screen and (max-width: 992px) {
  .router-links .router-link svg {
    width: 27px;
    height: 27px;
  }
}
</style>
