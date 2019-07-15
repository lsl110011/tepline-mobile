<template>
  <div id="app">
    <!-- 路由组件是动态的，默认情况下切换都会销毁重建，状态丢失
    如果想要在切换的时候保留状态，就不要销毁，则使用keep-alive缓存就可以 -->
    <keep-alive>
      <router-view/>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
    }
  }

}
</script>

<style scoped>

</style>
