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
<div slot="nav-right" class="wap-nav" @click="isChannelShow = true">
  <van-icon name="wap-nav" />
</div>
  <van-tab
  v-for="channelItem in channels"
  :key="channelItem.id"
  :title="channelItem.name"
  >
    <!-- 下拉刷新组件 -->
    <!-- isloading 控制下拉的loading状态
    refresh 下拉之后触发的事件 -->
    <van-pull-refresh v-model="channelItem.pullRefreshLoading" @refresh="onRefresh">
        <!-- loading控制加载更多的loading
     finished控制是否已加载结束
     onload事件会在滚动到底部区域的时候自动调用，每次onload都会自动让loading为true -->
    <van-list
      v-model="channelItem.uploading"
      :finished="channelItem.finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell
        v-for="item in channelItem.articles"
        :key="item.art_id.toString()"
        :title="item.title"
       >
        <p slot="label">
          <template v-if="item.cover.type">
            <van-grid :border="false" :column-num="3">
              <van-grid-item
                v-for="(img, index) in item.cover.images"
                :key="index"
              />
                <van-image
                  :src="img"
                  lazy-load
                />
            </van-grid>
          </template>
          <span>{{ item.aut_name }}</span>
          &nbsp;
          <span>{{ item.comm_count }}</span>
          &nbsp;
          <span>{{ item.pubdate | relativeTime  }}</span>
          <!-- 这里更多操作的点击按钮 -->
          <van-icon class="close" name="close" @click="handleShowMoreAction(item)"/>
        </p>
       </van-cell>
    </van-list>
   </van-pull-refresh>
  </van-tab>
</van-tabs>

  <!-- 底部导航 -->
<van-tabbar router>
    <van-tabbar-item icon="home-o" to="/">首页</van-tabbar-item>
    <van-tabbar-item icon="search" to="/qa">问答</van-tabbar-item>
    <van-tabbar-item icon="friends-o" to="/video">视频</van-tabbar-item>
    <van-tabbar-item icon="setting-o" to="my">我的</van-tabbar-item>
</van-tabbar>
<!-- 频道组件 -->
<!-- .sync修饰符会自动监听一个事件：
 @update:user-channel="channel = $event"
 简单来说：给props数组加.sync其实就是v-model的作用，一个组件只能有一个v-model
 @update-user-channels="channels.push($event)" -->
<home-channel
    v-model="isChannelShow"
    :user-channels.sync="channels"
    :active-index.sync="activeChannelIndex"
></home-channel>
<!-- 更多操作弹框 -->
<van-dialog
    v-model="isMoreActionShow"
    :showConfirmButton="false"
  >
    <van-cell-group v-if="!toggleRubbish">
      <van-cell title="不感兴趣" @click="handleDislick"/>
      <van-cell title="反馈垃圾内容" is-link @click="toggleRubbish = true"/>
      <van-cell title="反馈垃圾内容"/>
    </van-cell-group>
    <van-cell-group v-else>
      <van-cell icon="arrow-left" @click="toggleRubbish=false"/>
      <van-cell title="标题夸张"/>
      <van-cell title="低速色情" />
      <van-cell title="错别字多"/>
      <van-cell title="旧闻重复" />
    </van-cell-group>
</van-dialog>
  </div>
</template>

<script>
import { getUserChannels } from '@/api/channel'
import { getArticles, dislikeArticle } from '@/api/article'
import HomeChannel from './components/channel'
export default {
  name: 'HomeIndex',
  components: {
    HomeChannel
  },
  data () {
    return {
      activeChannelIndex: 0,
      list: [],
      loading: false,
      finished: false,
      pullRefreshLoading: false,
      channels: [], // 存储频道列表
      isChannelShow: false, // 控制频道面板的显示
      img: '',
      isMoreActionShow: false, // 控制更多操作弹框面板
      toggleRubbish: false, // 控制反馈垃圾弹框内容的显示
      currentArticle: null // 存储当前操作更多的文章

    }
  },
  computed: {
    activeChannel () {
      return this.channels[this.activeChannelIndex]
    }
  },
  watch: {
    // 监视容器中的user状态，只要user发生改变，就会重新获取频道列表
    async '$store.state.user' () {
      console.log('user改变了') // 重新加载频道数据
      await this.loadChannels()
      // 由于重新加载频道数据，所以文章内容也被清空
      // 上拉加载更多的onload没有主动触发
      // 可以手动触发加载更多onload

      // 只需将当前激活频道的上拉loading设置为true,会自动调用自己的onload函数
      //  this.activeChannel.upLoading = true
      // this.onload()
    }
  },
  async created () {
    // 加载频道列表
    await this.loadChannels()
    // 初始加载第一项频道的数据列表（即在加载频道之后）
    // this.loadArticles()
  },

  methods: {
  // 上拉加载更过，应该往频道articles中最后push 数据
  // onload一上来就会自动调用，当请求的数据不够满屏时，会多次调用
  // onload会自动开启加载loading效果
    async onLoad () {
      await this.$sleep(800)
      const articles = await this.loadArticles()
      // 将请求得到的数据放入频道文章列表中
      this.activeChannel.articles.push(...articles)
      // 加载状态结束
      this.loading = false

      // // 异步更新数据
      // setTimeout(() => {
      //   for (let i = 0; i < 10; i++) {
      //     this.list.push(this.list.length + 1)
      //   }
      //   // 加载状态结束
      //   this.loading = false

      //   // 数据全部加载完成
      //   if (this.list.length >= 40) {
      //     this.finished = true
      //   }
      // }, 1000)
    },

    async loadChannels () {
      try {
        let channels = []
        // 1得到频道数据
        const { user } = this.$store.state
        // 如果已登录，则请求用户频道列表
        if (user) {
          channels = (await getUserChannels()).channels
        } else {
          // 如果没登录
          // 判断是否有本地存储的频道列表
          const localChannels = JSON.parse(window.localStorage.getItem('channels'))
          if (localChannels) {
            channels = localChannels
          } else {
            // 如果没有，则请求获取推荐的默认频道列表
            channels = (await getUserChannels()).channels
          }
        }
        // 2 扩展频道数据满足其他业务需求
        channels.forEach(item => {
          item.articles = [] // 频道的文章
          item.timestamp = Date.now() // 用于下一页频道数据的时间戳
          item.finished = false // 控制该频道上拉加载是否已加载完毕
          item.upLoading = false // 控制该频道的下拉刷新 loading
          item.pullRefreshLoading = false // 控制频道列表的下拉刷新状态
          item.pullSuccessText = '' // 控制频道列表的下拉刷新成功提示文字
        })
        this.channels = channels
      } catch (err) {
        console.log(err)
      }
    },

    async loadArticles () {
      // 频道、时间戳
      const { id: channelId, timestamp } = this.activeChannel
      try {
        const data = await getArticles({
          channelId,
          timestamp,
          withTop: 1
        })
        // 如果没有最新数据，则请求上一次的数据
        if (data.pre_timestamp && data.results.length === 0) {
          // 将最近的推荐数据请求的时间戳更新到频道中
          this.activeChannel.timestamp = data.pre_timestamp
          return this.loadArticles()
        }
        // 如果有数据，则直接把得到的数据更新到频道列表
        if (data.results.length) {
          this.activeChannel.timestamp = data.pre_timestamp
          return data.results
        }
        console.log(data)
      } catch (err) {
        console.log(err)
      }
    },

    async onRefresh () {
      const timestamp = this.activeChannel.timestamp
      this.activeChannel.timestamp = Date.now()

      // 获取频道文章列表
      const articles = await this.loadArticles()
      // 如果有最新数据，则使用onload加载
      if (articles.length) {
        this.onLoad()
      } else {
        // 将时间戳还原一下
        this.activeChannel.timestamp = timestamp
      }
      // 关闭下拉的loading状态
      this.activeChannel.pullRefreshLoading = false
    },
    // 处理显示更多操作弹框面板
    handleShowMoreAction (item) {
      // 将点击操作更多的文章存储起来，用于后续使用
      this.currentArticle = item
      // 显示弹框
      this.isMoreActionShow = true
    },
    async handleDislick () {
      //  拿到操作的文章id
      const articleId = this.currentArticle.art_id.toString()
      // 请求完成操作
      await dislikeArticle(articleId)
      // 隐藏对话框
      this.isMoreActionShow = false
      // 当前频道文章列表
      const articles = this.activeChannel.articles
      const delIndex = articles.findIndex(item => item.art_id.toString() === articleId)
      // 把本条数据移除
      articles.splice(delIndex, 1)
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
  padding-right: 40px;
}
.channel-tabs /deep/ .van-tabs__content {
  margin-top: 92px;
}
.channel-tabs .wap-nav{
  // position:sticky;
  position:fixed;
  right: 0;
  top: 105px;
  display: flex;
  align-items: center;
  background: #fff;
  opacity: .7;
  z-index: inherit;
}
.channel-tabs .close {
  float: right;
  font-size: 30px;
}
</style>
