<template>
  <div class="app-container calendar-list-container">
    <el-tabs v-model="activeName">
      <el-tab-pane label="关键词" name="first">
        <keywords></keywords>
      </el-tab-pane>
      <el-tab-pane label="联系方式" name="second">
        <contacts></contacts>
      </el-tab-pane>
      <el-tab-pane label="IP" name="third">
        <userip></userip>
      </el-tab-pane>
      <el-tab-pane label="用户ID" name="fourth">
        <userid></userid>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import waves from '@/directive/waves.js'// 水波纹指令
import keywords from './keywords'
import contacts from './contact'
import userip from './ip'
import userid from './id'
export default {
  name: 'banned-table',
  components: { keywords, contacts, userip, userid },
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