<template>
  <div class="app-container calendar-list-container">
    <el-tabs v-model="activeName">
      <el-tab-pane label="主贴重复" name="first">
      <waterarmy></waterarmy>
      </el-tab-pane>
      <el-tab-pane label="异常行为" name="second">
        <huddle></huddle>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import waves from '@/directive/waves.js'// 水波纹指令
import waterarmy from './waterarmy'
import huddle from './huddle'

export default {
  name: 'banned-table',
  components: { waterarmy, huddle },
  directives: {
    waves
  },
  data() {
    return {
      activeName: 'first'
    }
  }
}
</script>