<template>
  <div>
    <form action="/">
        <van-search
          placeholder="请输入搜索关键词" v-model="searchText"
          @search="handleSearch(searchText)"
          show-action />
    </form>

     <!-- 联想建议列表 -->
     <van-cell-group v-if="suggestions.length && searchText.length  ">
         <van-cell
        icon="search"
        v-for="item in suggestions"
        :key="item"
        @click="handleSearch(item)"
      >
      <!-- {{}} 无法输出html字符内容
      v-html 指令才会解析字符串中的html
      过滤只能用在{{}}和v-bind中 -->

      <div slot="title" v-html="hightlight(item, searchText)"></div>
     </van-cell>
    </van-cell-group>
     <!-- 历史记录 -->
     <van-cell-group v-else>
         <van-cell
            title="历史记录"
          >
          <van-icon
            v-show="!isDelteShow"
            slot="right-icon"
            name="delete"
            @click="isDelteShow = true"
            style="line-height: inherit;"
          />
          <div v-show="isDelteShow">
            <span style="margin-right: 10px" @click="searchHistories = []">全部删除</span>
            <span @click="isDeleteShow = false">完成</span>
          </div>
          </van-cell>
          <van-cell
          v-for="(item, index) in searchHistories"
          :key="item"
          :title="item">
           <van-icon
            v-show="isDelteShow"
            slot="right-icon"
            name="close"
            @click="searchHistories.splice(index, 1)"
            style="line-height: inherit;"
          />
          </van-cell>
     </van-cell-group>

  </div>
</template>

<script>
import { getSuggestion } from '@/api/search'
import { debounce } from 'lodash'
export default {
  name: 'SearchIndex',
  data () {
    return {
      searchText: '', // 搜索输入的文本
      suggestions: [], // 联想建议
      searchHistories: JSON.parse(window.localStorage.getItem('search-histories')), // 搜索历史记录
      isDelteShow: false
    }
  },
  deactivated () {
    this.$destroy()
  },
  watch: {
    // debounce 接收两个参数
    // 第一个参数： 执行业务逻辑的参数函数
    // 第二个参数： 防抖事件
    // 当你同一时间调用频率过快的时候，只有停下来经过指定时间才会被调用
    searchText: debounce(async function (newVal) {
      newVal = newVal.trim() // 去除首尾空格
      // 如果数据为空，则什么都不做
      if (!newVal) {
        return
      }
      // 如果数据不为空，则请求联想建议自动补全
      const data = await getSuggestion(newVal)
      this.suggestions = data.options
    }, 500),
    searchHistories: {
      handler () {
      // 保存搜索历史记录
        window.localStorage.setItem('search-histories', JSON.stringify([...new Set(this.searchHistories)]))
      },
      deep: true
    }
  },
  methods: {
    hightlight (text, keyword) {
      return text.toLowerCase().split(keyword).join(`<span style="color: red;">${keyword}</span>`)
    },
    handleSearch (q) {
      if (!q.length) {
        return
      }
      this.searchHistories.unshift(q)

      this.$router.push({
        name: 'search-result',
        params: {
          q
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
