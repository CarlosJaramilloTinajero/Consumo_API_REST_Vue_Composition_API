<script setup>
</script>

<template>
  <footer>
    <div class="content">
      <div class="row">
        <div class="col col-6 col-sm-4">
          <div class="d-flex justify-content-center">
            <div class="d-block">
              <p class="title">FrameWorks</p>
              <p class="item">Laravel</p>
              <p class="item">Vue 3</p>
            </div>
          </div>
        </div>

        <div class="col col-6 col-sm-4">
          <div class="d-flex justify-content-center">
            <div class="d-block">
              <p class="title">Libs/Paquetes</p>
              <p class="item">Vue Router</p>
              <p class="item">Vuex</p>
              <p class="item">Vuelidate</p>
              <p class="item">Axios</p>
              <p class="item">Sanctum</p>
              <p class="item">Toastify</p>
            </div>
          </div>
        </div>

        <div class="col col-6 col-sm-4">
          <div class="d-flex justify-content-center">
            <div class="d-block">
              <p class="title">Lenguajes</p>
              <p class="item">PHP</p>
              <p class="item">SQL</p>
              <p class="item">JavaScript</p>
              <p class="item">HTML</p>
              <p class="item">CSS</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
footer {
  background-color: rgb(0, 150, 145);
  padding: 80px 0;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.7);
  margin-top: 50px;
}

footer .content {
  max-width: 600px;
  margin: 0 auto;
}

footer .title,
footer .item {
  font-family: 'Montserrat', sans-serif;
  color: white;
  text-shadow: 0 0 15px rgba(255, 255, 255, 0.7);
  text-align: center;
  cursor: pointer;
  transition: opacity .3s ease-in-out;
  margin-bottom: 0;
}

footer .title:hover,
footer .item:hover {
  opacity: 1;
}

footer .title {
  font-size: 15px;
  opacity: .9;
  margin-bottom: 20px;
}

footer .item {
  font-size: 12px;
  opacity: .7;
  margin-bottom: 7px;
}
</style>
