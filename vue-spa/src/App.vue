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

  .checkbox {
    position: relative;
    padding: 0 0 0 30px;
    display: inline-block;

    input {
      display: none;

      &~span {
        position: absolute;
        width: 20px;
        height: 20px;
        background: url(/public/input-sprite.png) no-repeat top left;
        background-position: 0 0;
        content: '';
        display: block;
        z-index: 9;
        left: 0;
        top: 0;
      }

      &:checked~span {
        background-position: 0 -40px;
      }
    }

  }
</style>
