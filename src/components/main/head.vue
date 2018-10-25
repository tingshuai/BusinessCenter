<template>
<div class="qw_head">
	<Logo></Logo>
	<div class="toggle_box" @click="toggleSidebar">
		<i class="qw_top_menu_icon" :class="isShowSidebar? '':'trans'"></i>
	</div>
	<ul class="topMenu">
		<li v-for="(menu,i) in topMenu" @click="activeMenuIndex=i" :class="i==activeMenuIndex? 'active' : ''"> <i :class="menu.icon"></i>{{menu.title}}</li>
	</ul>
	<ul class="rightMenu">
		<!-- <el-color-picker class="mainColor" v-model="mainColor"></el-color-picker> -->
		<!-- <i class="qw_icon_lock"></i> -->
		<el-tooltip class="item" effect="dark" content="全屏展示" placement="bottom">
			<i class="qw_icon_fullScreen" style="font-size:20px;" v-show="!isFull" @click="fullScreen"></i>
		</el-tooltip>
		<el-tooltip class="item" effect="dark" content="取消全屏" placement="bottom">
			<i class="qw_icon_noFullScreen" style="font-size:24px;transform:translateY(2px);-o-transform:translateY(2px);-ms-transform:translateY(2px);-moz-transform:translateY(2px);-webkit-transform:translateY(2px);" v-show="isFull" @click="exitFull"></i>
		</el-tooltip>
		<el-tooltip class="item" effect="dark" content="用户头像" placement="bottom">
			<img class="user_head" src="../../assets/img/head.jpg">
		</el-tooltip>
		<el-dropdown>
		  <span class="el-dropdown-link user_name">
		    jacktan<i class="el-icon-arrow-down el-icon--right" style="font-size:14px;width:18px;"></i>
		  </span>
		  <el-dropdown-menu slot="dropdown">
		    <el-dropdown-item><span @click="addTag({id: 1, title:'后台首页', link:'/desktop'})">首页</span></el-dropdown-item>
		    <el-dropdown-item><span @click="addTag({id: 100, title:'用户信息', link:'/userInfo'})">用户信息</span></el-dropdown-item>
		    <el-dropdown-item><span @click="logout">退出</span></el-dropdown-item>
		  </el-dropdown-menu>
		</el-dropdown>
	</ul>	
</div>	
</template>
<script>
import Logo from  "./logo.vue"
import {mapMutations,mapGetters,mapState} from 'vuex';
var qw_head={
	data(){
		return {
			isFull:false,
			mainColor:"#06F",
			activeMenuIndex:0,
			topMenu:[
				// {
				// 	title:'首页',
				// 	path:'/',
				// 	icon:'el-icon-menu'
				// },
				// {
				// 	title:'设置',
				// 	path:'/setting',
				// 	icon:'el-icon-setting'
				// },
				// {
				// 	title:'文档',
				// 	path:'/docs',
				// 	icon:'el-icon-document'
				// }
			]
		}
	},
	computed:{
		...mapState({
			isShowSidebar: state=> state.app.isShowSidebar
		})
	},
	components:{
		Logo
	},
	methods:{
		...mapMutations(['TOGGLE_SIDEBAR','ADD_TAG']),
		addTag(link){
			this.ADD_TAG(link)
		},
		toggleSidebar(){
			this.TOGGLE_SIDEBAR();
		},
		fullScreen() {
		  var el = document.documentElement;
		  var rfs = el.requestFullScreen || el.webkitRequestFullScreen || 
		      el.mozRequestFullScreen || el.msRequestFullScreen;
		  if(typeof rfs != "undefined" && rfs) {
		    rfs.call(el);
		  } else if(typeof window.ActiveXObject != "undefined") {
		    //for IE，这里其实就是模拟了按下键盘的F11，使浏览器全屏
		    var wscript = new ActiveXObject("WScript.Shell");
		    if(wscript != null) {
		        wscript.SendKeys("{F11}");
		    }

		  }
		  this.isFull=true;
		},
		exitFull() {
		  // 判断各种浏览器，找到正确的方法
		  var exitMethod = document.exitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen || document.webkitExitFullscreen; 
		  if (exitMethod) {
		    exitMethod.call(document);
		  }
		  else if (typeof window.ActiveXObject !== "undefined") {//for Internet Explorer
		    var wscript = new ActiveXObject("WScript.Shell");
		    if (wscript !== null) {
		      wscript.SendKeys("{F11}");
		    }
		  }
		  this.isFull=false;
		},
		logout(){
			alert("logout")
		}
	}
}	
export default qw_head;
</script>
<style lang="less">
.qw_top_menu_icon{
	display: inline-block;
	width: 24px;
	height: 80px;
	background: url("../../assets/img/icon_menu.png") no-repeat;
	background-position: center center;
	box-sizing: border-box;	
}
.qw_head{
	width:100%;
	min-width:1024px;
	max-width:1920px;
	background:#FFF;
	height:80px;
	border-bottom:1px solid #EEE;
	position:relative;
	.toggle_box{
		width:68px;
		height:80px;
		position:absolute;
		left: 260px;
		text-align:center;
		top:0;
		
		i{
			display:inline-block;
			-o-transform-origin:center;
			-ms-transform-origin:center;
			-moz-transform-origin:center;
			-webkit-transform-origin:center;
			transform-origin:center;
			transition:all 0.2s;
			font-size:22px;
			color:#888;
			line-height:80px;
			-o-transform:rotate(-180deg);
			-ms-transform:rotate(-180deg);
			-moz-transform:rotate(-180deg);
			-webkit-transform:rotate(-180deg);
			transform:rotate(-180deg);
		}
		.trans{
			-o-transform:rotate(0deg);
			-ms-transform:rotate(0deg);
			-moz-transform:rotate(0deg);
			-webkit-transform:rotate(0deg);
			transform:rotate(0deg);
		}
	}
	.logobox{
		width:260px;
		height:80px;
		box-sizing:border-box;
		border:1px solid #F00;
	}
	.rightMenu{
		display:block;
		position:absolute;
		right:0;
		top:0;
		padding-right:10px;
		i{
			line-height:80px;
			display:inline-block;
			width:32px;
			margin-left:4px;
			font-size:22px;
			text-align:center;
		}
		.el-color-picker__trigger{	
			width:32px;
			height:32px;
			transform:translateY(8px);
			margin-right:4px;

		}
		.user_head{
			display:inline-block;
			width:32px;
			height:32px;
			border-radius:50%;
			transform: translateY(-6px)
		}
		.user_name{
			cursor:pointer;
			display:inline-block;
			line-height:45px;
			height:45px;
			color:#666;
			transform:translateY(-4px);
			padding:0 0 0 10px;
		}
	}
	.topMenu{
		display:block;
		position:absolute;
		left:328px;
		top:0;
		list-style:none;
		text-decoration:none;
		color:#666;
		margin-top: 8px;
		li{
			list-style:none;
			position:relative;
			display:inline-block;
			padding:0 20px;
			box-sizing:border-box;
			line-height:60px;
			font-size:16px;
			text-align:center;
			cursor:pointer;
		}
		li.active{
			color:#409eff;
		}
		i{
			font-size:20px;
			padding:0 6px 0 0;
			-o-transform:translateY(2px);
			-ms-transform:translateY(2px);
			-moz-transform:translateY(2px);
			-webkit-transform:translateY(2px);
			transform:translateY(2px);
		}
		li:after{
			content:"";
			-o-transform-origin:center center;
			-ms-transform-origin:center center;
			-moz-transform-origin:center center;
			-webkit-transform-origin:center center;
			transform-origin:center center;
			-o-transform:scale(0);
			-ms-transform:scale(0);
			-moz-transform:scale(0);
			-webkit-transform:scale(0);
			transform:scale(0);
			-o-transition:all 0.4s;
			-ms-transition:all 0.4s;
			-moz-transition:all 0.4s;
			-webkit-transition:all 0.4s;
			transition:all 0.4s;
			position:absolute;
			left:0;
			bottom:2px;
			width:100%;
			height:2px;
			background:#409eff;
		}
		li.active:after{
			-o-transform:scale(1);
			-ms-transform:scale(1);
			-moz-transform:scale(1);
			-webkit-transform:scale(1);
			transform:scale(1);
		}
	}
}	
</style>