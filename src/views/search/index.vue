<template>
  <div>
    <form action="/">
        <van-search
          placeholder="请输入搜索关键词" v-model="searchText"
          @search="handleSearch(searchText)"
          show-action />
    </form>

     <!-- 联想建议列表 -->
     <van-cell-group v-if="suggestions.length">
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
            slot="right-icon"
            name="delete"
            style="line-height: inherit;"
          />
          </van-cell>
          <van-cell title="hello"/>
           <van-cell title="hello"/>
            <van-cell title="hello"/>
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
      searchText: '',
      suggestions: []
    }
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
    }, 500)
  },
  methods: {
    hightlight (text, keyword) {
      return text.toLowerCase().split(keyword).join(`<span style="color: red;">${keyword}</span>`)
    },
    handleSearch (q) {
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
