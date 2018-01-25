<template>
	<el-menu class="navbar" mode="horizontal">
		<hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
		<levelbar></levelbar>
		<tabs-view></tabs-view>
		<error-log v-if="log.length>0" class="errLog-container" :logsList="log"></error-log>
		<a target="_blank" :href="help1Src"><span class="helpclick"><img :src="help3Src" alt=""></span></a>
		<h5 class="userName">{{username}}</h5>
		<screenfull class='screenfull'></screenfull>
		<el-dropdown class="avatar-container" trigger="click">
			<div class="avatar-wrapper">
				<img class="user-avatar" :src="avatar+'?imageView2/1/w/80/h/80'">
			</div>
			<el-dropdown-menu class="user-dropdown" slot="dropdown">
				<el-dropdown-item>
					<span @click="logout" style="display:block;">退出登录</span>
				</el-dropdown-item>
			</el-dropdown-menu>
		</el-dropdown>
	</el-menu>
</template>

<script>
import help3 from './../img/help3.png'
import help1 from './../img/help1.png'
// import help2 from './../img/help2.png'
import { mapGetters } from 'vuex';
import Levelbar from './Levelbar';
import TabsView from './TabsView';
import Hamburger from 'components/Hamburger';
import Screenfull from 'components/Screenfull';
import ErrorLog from 'components/ErrLog';
import errLogStore from 'store/errLog';
import store from '../../store';

export default {
	components: {
		Levelbar,
		TabsView,
		Hamburger,
		ErrorLog,
		Screenfull
	},
	data() {
		return {
			username: store.state.user.name,
			log: errLogStore.state.errLog,
		
			help1Src: help1,
			help3Src: help3
		}
	},
	computed: {
		...mapGetters([
			'sidebar',
			'name',
			'avatar'
		])
	},
	methods: {
		toggleSideBar() {
			this.$store.dispatch('ToggleSideBar')
		},
		logout() {
			this.$store.dispatch('LogOut').then(() => {
				location.reload();// 为了重新实例化vue-router对象 避免bug
			});
		}
	}
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
	height: 50px;
	line-height: 50px;
	border-radius: 0px !important;
	.hamburger-container {
		line-height: 58px;
		height: 50px;
		float: left;
		padding: 0 10px;
	}
	.userName {
		position: absolute;
		right: 150px;
		top: -20px;
	}
	.errLog-container {
		display: inline-block;
		position: absolute;
		right: 150px;
	}
	.screenfull {
		position: absolute;
		right: 70px;
		top: 14px;
		color: red;
	}
	.avatar-container {
		height: 50px;
		display: inline-block;
		position: absolute;
		right: 10px;
		.avatar-wrapper {
			cursor: pointer;
			margin-top: 5px;
			position: relative;
			.user-avatar {
				width: 40px;
				height: 40px;
				border-radius: 10px;
			}
			.el-icon-caret-bottom {
				position: absolute;
				right: -20px;
				top: 25px;
				font-size: 12px;
			}
		}
	}
}
.helpclick{
position: absolute;
		right: 250px;
		top: 10px;
		width: 10px;
		height: 10px;
		padding: 10px;
		border-radius: 100%;
		background: #999999;
}
.helpclick:hover{
	background:#23DEDE;
}
.helpclick img{
	width:10px;
	height: 13px;
	position: relative;
	bottom:18px;

}
</style>



