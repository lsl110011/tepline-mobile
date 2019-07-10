<template>
  <div>
    <!-- 头部 -->
    <van-nav-bar
  title="首页" fixed
/>
<!-- 频道标签 -->
<van-tabs
class="channel-tabs"
v-model="activeChannelIndex">
  <van-tab title="标签" name="a">
    <!-- 下拉刷新组件 -->
    <!-- isloading 控制下拉的loading状态
    refresh 下拉之后触发的事件 -->
    <van-pull-refresh v-model="pullRefreshLoading" @refresh="onRefresh">
        <!-- loading控制加载更多的loading
     finished控制是否已加载结束
     onload事件会在滚动到底部区域的时候自动调用，每次onload都会自动让loading为true -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell
        v-for="item in list"
        :key="item"
        :title="item"
      />
    </van-list>
   </van-pull-refresh>

  </van-tab>
  <van-tab title="标签 2" name="b">内容 2</van-tab>
  <van-tab title="标签 3" name="c">内容 3</van-tab>
</van-tabs>

  <!-- 底部导航 -->
<van-tabbar router>
    <van-tabbar-item icon="home-o" to="/">首页</van-tabbar-item>
    <van-tabbar-item icon="search" to="/qa">问答</van-tabbar-item>
    <van-tabbar-item icon="friends-o" to="/video">视频</van-tabbar-item>
    <van-tabbar-item icon="setting-o" to="my">我的</van-tabbar-item>
</van-tabbar>
  </div>
</template>

<script>
export default {
  name: 'HomeIndex',
  data () {
    return {
      activeChannelIndex: 0,
      list: [],
      loading: false,
      finished: false,
      pullRefreshLoading: false
    }
  },
  methods: {
    onLoad () {
      // 异步更新数据
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          this.list.push(this.list.length + 1)
        }
        // 加载状态结束
        this.loading = false

        // 数据全部加载完成
        if (this.list.length >= 40) {
          this.finished = true
        }
      }, 1000)
    },
    onRefresh () {
      setTimeout(() => {
        this.pullRefreshLoading = false
      }, 3000)
    }
  }
}
</script>

<style lang="less" scoped>
.channel-tabs{
  margin-bottom: 100px;
}
.channel-tabs /deep/ .van-tabs__wrap {
  position: fixed;
  top: 92px;
}
.channel-tabs /deep/ .van-tabs__content {
  margin-top: 92px;
}
</style>
