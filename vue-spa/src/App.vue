<template>
  <div id="app">
    <div class="container">
      <Filters></Filters>
      <News></News>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<style lang="scss">
  body, html {
    margin: 0;
  }

  * {
    box-sizing: border-box;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    color: #2c3e50;
    padding: 20px;
    background: url('/public/bg.png');
    min-height: 100vh;
  }

  .container {
    max-width: 1280px;
    margin: 0 auto;
  }

</style>
