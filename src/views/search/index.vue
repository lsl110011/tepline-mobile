<template>
  <div>
    <van-search
     placeholder="请输入搜索关键词" v-model="serchText"
     show-action />
     <!-- 联想建议列表 -->
     <van-cell-group>
        <van-cell title="单元格" icon="search" />
        <van-cell title="单元格" icon="search"  />
    </van-cell-group>
     <!-- 历史记录 -->
     <van-cell
       title="历史记录"
     >
     <van-icon
       slot="right-icon"
       name="delete"
       style="line-height: inherit;"
     />
     </van-cell>
  </div>
</template>

<script>
export default {
  name: 'SearchIndex',
  data () {
    return {
      serchText: ''
    }
  }
}
</script>

<style lang="less" scoped>

</style>
