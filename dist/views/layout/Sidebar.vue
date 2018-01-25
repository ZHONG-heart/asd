<template>
    <div>
      <div style="background:#324157;">
        <img :src="logoSrc" alt="" style="width:100%;height:50px;">
      </div>
      <el-menu mode="vertical" theme="dark" unique-opened :default-active="$route.path" :collapse="isCollapse">
        <sidebar-item :routes='permission_routers'></sidebar-item>
      </el-menu>
    </div>
</template>


<script>
  import logo from './../img/logo.png'
  import { mapGetters } from 'vuex';
  import SidebarItem from './SidebarItem';
  export default {
    components: { SidebarItem },
    data() {
      return {
        logoSrc: logo
      }
    },
    computed: {
      ...mapGetters([
        'permission_routers',
        'sidebar'
      ]),
      isCollapse() {
        return !this.sidebar.opened
      }
    }
  }
</script>
