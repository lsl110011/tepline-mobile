<template>
  <div class="search-result">
    <!-- 顶部导航 -->
    <van-nav-bar
      title="搜索结果"
      left-text="返回"
      left-arrow
      fixed
      @click-left="$router.back()"
    />
    <!-- 文章列表 -->
    <van-list
      class="article-list"
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
  <van-cell
    v-for="item in articles"
    :key="item.art_id"
    :title="item.title"
  />
</van-list>
  </div>
</template>

<script>
import { getSearch } from '@/api/search'

export default {
  name: 'SearchResult',
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1,
      perPage: 10,
      articles: []
    }
  },

  computed: {
    q () {
      return this.$route.params.q
    }
  },
  watch: {
    '$route' (to, from) {
      // 对路由变化作出响应...
      console.log('路由变化')
    }
  },
  // 组件缓存的情况下： 页面显示出来调用它
  activated () {
    this.loading = true
    this.onLoad()
  },
  // 组件缓存的情况下： 页面隐藏调用它
  deactivated () {
    this.articles = []
    this.page = 1
  },
  async created () {
    const data = await getSearch({
      q: this.$route.params.q,
      page: 1
    })
    console.log(data)
  },
  methods: {
    async onLoad () {
      await this.$sleep(800)
      const data = await this.getSearchResults()
      // 如果请求结果数组为空，则设置list组件加载结束
      if (!data.results.length) {
        this.loading = false
        this.finished = true
        return
      }
      // 如果有数据，则将本次加载到的数据push到列表数组中
      this.articles.push(...data.results)
      // 数据加载完毕，更新当前页码为下一页，用于下一次加载更多
      this.page += 1
      // 结束当前加载的loading
      // list列表组件每次onload会自动将loading设置为true
      // 如果不设置的话，不会触发下一次的onload
      this.loading = false
    },
    getSearchResults () {
      return getSearch({
        page: this.page,
        perPage: this.perPage,
        q: this.q
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .search-result{
    .article-list{
      margin-top: 92px;
    }
  }
</style>
