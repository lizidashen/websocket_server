<template>
  <div class="hello">
    <h1>websocket聊天窗口</h1>

    <el-button type="text" @click="dialogueMonitor(item)">实时监控</el-button>

    <el-dialog
            title="通话详情"
            :visible.sync="dialogVisible"
            width="500px"
    >
      <div style="height: 400px; width:460px;background-color: #8cc5ff; border-radius: 5px;border: 1px solid #b4bccc;margin-top: -20px; margin-bottom: -20px; overflow: hidden">
        <div class="dialogContent" style="height: 415px; width:475px;background-color: #8cc5ff; overflow: scroll" ref="dialogContent">
          <div v-for="item in dialogData" style="margin-bottom: 10px">
            <div style="display: block; " v-if="item.time">
              <p style="text-align: center; font-size: 12px; margin:0">{{item.time}}</p>
            </div>
            <div class="msgArea" style="height: 100%; margin: 5px 5px">
              <div v-if="item.type ==='bot'" style="width:390px; display: flex;  justify-content: flex-start;">
                <img style="margin: 0 5px; height: 50px; width: 50px" :src="imgRobot">
                <div style="display: flex; flex-direction:column;justify-content:center;">
                  <span style="margin-right: 5px; text-align: left; font-size: 10px">机器人</span>
                  <div style="height: 100%;padding: 3px 5px; background-color: white;display: inline-block; border-radius: 3px;">
                    <span >{{item.msg}}</span>
                  </div>
                </div>


              </div>
              <div v-else-if="item.type ==='human'" style="margin-left: 60px; width:390px;  display:flex; justify-content:flex-end">

                <div style="display: flex; flex-direction:column;justify-content:center;">
                  <span style="margin-right: 5px; text-align: right; font-size: 10px">客户</span>
                  <div style="height: 100%; padding: 3px 5px; background-color: #b3f0db;display: inline-block; border-radius: 3px;">
                    <span >{{item.msg}}</span>
                  </div>
                </div>
                <img style="margin: 0 5px; height: 50px; width: 50px" :src="imgCostomer">

                <!--<span style="margin-left: 10px; padding: 3px 0;"> 客户</span>-->
              </div >
              <div v-else>

              </div>

            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
  <!--<img alt="Vue logo" src="./assets/logo.png">-->

</template>

<script>
let wsServer

export default {
  name: 'HelloWorld',
  data(){
    return {
      imgRobot:'@/assets/img/robotPic.png',
      imgCostomer:'@/assets/img/customerPic.png',
      dialogClose:{
          time:'连接已终止',
      },
      dialogData : [],
      dialogVisible:false,
    }
  },
  methods: {
    dialogOpen(){
        // 滚动到底部
        const div = this.$refs.dialogContent
        // 原先的方案是div.scrollTop = div.scrollHeight;
        // 但是没有效果，原因在于vue改变属性需要用set
        // 在下次 DOM 更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获取更新后的 DOM。
        //
        // this.$nextTick(() => {
        //   this.$refs.viewBox[key].scrollTo(0,'34px');
        // })
        this.$nextTick(() => {
            this.$set(div,'scrollTop', div.scrollHeight)
        })
        // 修改完后，迫使 Vue 实例重新渲染
        this.$forceUpdate()
    },
    dialogueMonitor(item){
        // 清空对话记录的数据
      this.dialogData = []
      this.dialogVisible = true

      const wsAddress = 'localhost:8003'

      wsServer = new ReconnectingWebSocket(`ws://${wsAddress}/`);
      const that = this
      wsServer.onopen = function (e) {
          console.log('用户端open',e);
          wsServer.send('getMessage')
      };
      wsServer.onclose = function (close) {//当链接关闭的时候触发
          console.log('用户端close',close);
          that.dialogData.push(that.dialogClose)
      };
      wsServer.onmessage = function (msg) {//后台返回消息的时候触发
          console.log('用户端msg',msg);
          if( msg.data === 'close') {
              console.log('close-msg',msg);
              wsServer.terminate()
          } else {
              const message = JSON.parse(msg.data)
              that.dialogData.push(message)
              that.dialogOpen()
          }
      };
      wsServer.onerror = function (err) {//错误情况触发
          console.log('用户端error', err);
      }
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
