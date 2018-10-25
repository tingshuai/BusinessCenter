<template>
  <div class="app-view">
    <div v-show="loadingTag>0" class="qwLoadingMask">
      <div class="loader-inner line-scale-pulse-out-rapid">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  <!-- header -->
  <qwHead></qwHead>  
    <div class="content">
       <div class="left" :style="{width:sideBarWidth+'px',height: sideBarHeight+'px',left: (isShowSidebar==true? 0 : -1* sideBarWidth +'px') }">
          <sideMenu></sideMenu>
       </div>
       <div class="main" :style="{height: sideBarHeight+'px',paddingLeft: (isShowSidebar? parseInt(sideBarWidth)+'px': '0')}">
            <tags @activeIndexChanged="tagsActiveIndexChanged" />
            <transition name="fade-transverse">
              <router-view :style="{height: (sideBarHeight-48) + 'px',background:'rgba(240,242,245,1)',overflowY:'scroll',boxSizing:'border-box',padding:'24px 24px 0'}"></router-view> 
            </transition>  
       </div>
    </div>    
  </div>
</template>
<script>
import {mapMutations,mapGetters,mapState} from 'vuex';
import qwHead from '../components/main/head.vue'
import tags from '../components/main/tags.vue'
import sideMenu from '../components/main/sideMenu.vue'
let that=null;
var vueObj= {
  name: 'app',
  components:{
    qwHead,
    tags,
    sideMenu
  },
  data () {
    return {
      transitionName:'slide-left',
      sideBarHeight: 500,
      sideBarWidth: 260,
      msg: 'Welcome to Your Vue.js App'
    }
  },
  props:["appUrl", "userName", "userImg","companyName","companyEnglish","companyLogo"],
  computed:{
    ...mapState({
        isShowSidebar: state => state.app.isShowSidebar,
        loadingTag: state => state.app.loadingTag 
      })
    //...mapGetters(['getIsLoading','getShowSidebar'])
  },
  watch: {
    '$route' (to, from) {
        let box=that.$refs['mainBox'];  
        if(box){
          console.log('done...')
            box.setAttribute('class','mainBox ani0');
            setTimeout(()=>{
                box.setAttribute('class','mainBox');
            },300)
        }
    }
  },
  mounted(){
    //this.$router.push({path:'/index2',params:{urlLink:'http://www.baidu.com'}})
    //console.log(this.$store,this.isShowSidebar, this.$store.state.app.isShowSidebar);    
    // this.setPorts(this.appUrl);
    // console.log("this.appurl===>",this.appUrl);
    window.localStorage.setItem('ports',this.appUrl);
    var mainNav=[
          {
            id: 1,
            title:'数据仓库',
            link:'/dataCenter',
            childrens:[
              {
                id: 6,
                title:'数据建模',
                link:'/dataModel',
                childrens:[]
              },              
              {
                id: 7,
                title:'数据结构',
                link:'/dataStruct'
              }
            ]
          },
          {
            id: 2,
            title:'数据授权',
            link:'/dataAuth',
            childrens:[
              {                
                id: 8,
                title:'授权策略',
                link:'/dataAuthMehod',
                childrens:[]
              },              
              {                
                id: 9,
                title:'角色授权',
                link:'/dataAuthRole',
                childrens:[]
              },              
              // {                
              //   id: 10,
              //   title:'人员授权',
              //   link:'/dataAuthPerson',
              //   childrens:[]
              // },              
              {                
                id: 11,
                title:'授权查询',
                link:'/dataAuthQuery',
                childrens:[]
              },
            ]
          },
          {
            id: 3,
            title:'数据运维',
            link:'/dataInfo',
            childrens:[]
          },
          // {
          //   id: 4,
          //   title:'对外接口',
          //   link:'/data',
          //   childrens:[              
          //       {
          //         id: 12,
          //         title:'数据接口',
          //         link:'/dataApi',
          //         childrens:[]
          //       },                
          //       {
          //         id: 13,
          //         title:'权限接口',
          //         link:'/dataAuthApi',
          //         childrens:[]
          //       },
          //   ]
          // },
          {
            id: 5,
            title:'数据日志',
            link:'/dataLog',
            childrens:[]
          },
          // {
          //   id: 1,
          //   title:'后台首页',
          //   link:'/desktop'
          // },
          // {
          //   id:2,
          //   title:'系统设置',
          //   opened: false,
          //   childrens:[
          //     {
          //       id:4,
          //       title:'菜单管理',
          //       link:'/menu'
          //     },
          //     {
          //       id:5,
          //       title:'权限管理',
          //       link:'/auth',
          //       opened:true,
          //       childrens:[
          //         {
          //           id:7,
          //           title:'角色管理',
          //           link:'/role',
          //         },
          //         {
          //           id:8,
          //           title:'权限节点',
          //           link:'/nodes',
          //         },  
          //       ]
          //     },
          //     {
          //       id:9,
          //       title:'企业/部门管理',
          //       link:'/depart'
          //     },
          //   ]
          // },
          // {
          //   id:3,
          //   title:'模板管理',
          //   childrens:[
          //     {
          //       id:10,
          //       title:'菜单管理',
          //       link:'/menu'
          //     },
          //     {
          //       id:11,
          //       title:'权限管理',
          //       link:'/auth'
          //     },
          //     {
          //       id:12,
          //       title:'企业/部门管理',
          //       link:'/depart'
          //     },
          //   ]
          // },        
          // {
          //   id:13,
          //   title:'百度',
          //   link:'https://www.baidu.com'
          // },
          // {
          //   id:14,
          //   title:'腾讯',
          //   link:'https://www.qq.com'
          // },
          // {
          //   id:15,
          //   title:"blog",
          //   link:"https://blog.csdn.net/cmyh100/article/details/79388186"
          // }
      ]
      this.SET_SIDE_MENUS(mainNav)
      this.getFirst(mainNav[0]);
    /*this.setUserImg(this.userImg);
    this.setUserName(this.userName);
    this.setCompanyName(this.companyName);
    this.setCompanyEnglish(this.companyEnglish);
    this.setCompanyLogo(this.companyLogo);*/
    // this.$router.push({path:'index'})
    // getList({empNo:1,barCode:'',qrcode:'11'},this).then(res=>{
    //   console.log(res)
    // })
    this.setSize();
    window.onresize=()=>{
        this.setSize();
    }
  },
  created(){
      that=this;
  },
  methods:{
    ...mapMutations(["ADD_TAG","setUserImg", "setUserName",'setCompanyName','setCompanyEnglish','setCompanyLogo','setPorts','SET_IFRAMELINK','SET_SIDEBARHIEGHT','SET_SIDE_MENUS']),
    tagsActiveIndexChanged(tag){
        if(/http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/.test(tag.link)){
            //if(this.$route.path!='/index2'){
              this.SET_IFRAMELINK(tag.link);
              this.$router.push({path:'/index2',params:{urlLink:tag.link}})
        }else{
          this.$router.push({path:tag.link});
        }
        //console.log("tagsActiveIndexChanged==>",tag.link); -->
    },
    //递归找到首先应该触发的页面
    getFirst(menu){
			if(!menu)return;
			if(!menu.childrens||(menu.childrens.length<1)){
        setTimeout(() => {
            this.ADD_TAG(menu);
            this.tagsActiveIndexChanged(menu);     
        }, 50);
			}else{
				this.getFirst(menu.childrens[0])
			}
		},
    setSize(){
        this.sideBarHeight=this.getClientHeight()-85;
        this.SET_SIDEBARHIEGHT(this.sideBarHeight);
    },
    getClientHeight()
    {
      var clientHeight=0;
      if(document.body.clientHeight&&document.documentElement.clientHeight)
      {
      var clientHeight = (document.body.clientHeight<document.documentElement.clientHeight)?document.body.clientHeight:document.documentElement.clientHeight;
      }
      else
      {
      var clientHeight = (document.body.clientHeight>document.documentElement.clientHeight)?document.body.clientHeight:document.documentElement.clientHeight;
      }
      return clientHeight;
    }
  }
}
export default vueObj;
</script>
<style lang="less">
//基础样式
@import "../assets/style/reset.less";
.app-view{
  width:100%;
  height:auto;
  min-height:600px;
  box-sizing:border-box;
  .content{
      position:relative;
      .left{
          width:260px;
          min-height:500px;
          background:#00142a;
          border-right:1px solid #EEE;
          position:absolute;
          left:0;
          top:0px;
          transition:all 0.2s;
      }
      .main{
         transition:all 0.2s;
         width:100%;
         padding-right:0;
         background:#FFF;
         box-sizing:border-box;
         overfolow:hidden;
      }
      .fade-transverse-leave-active,
      .fade-transverse-enter-active {
          transition: all .5s;
      }

      .fade-transverse-enter {
          opacity: 0;
          transform: translateX(-30px);
      }

      .fade-transverse-leave-to {
          opacity: 0;
          transform: translateX(30px);
      }
  }
  .qwLoadingMask{
    width: 100%;
    height: 100vh;
    background: rgba(0,0,0,0.1);
    position: absolute;
    left: 0;
    top:0;
    z-index: 100000;
     .line-scale-pulse-out-rapid {
        width: 60px;
        margin:0 auto;
        margin-top: 35vh;
     }
    .line-scale-pulse-out-rapid > div:nth-child(1), .line-scale-pulse-out-rapid > div:nth-child(5) {
        -webkit-animation-delay: 0.5s !important;
        animation-delay: 0.5s !important;
    }
    .line-scale-pulse-out-rapid > div:nth-child(2), .line-scale-pulse-out-rapid > div:nth-child(4) {
        -webkit-animation-delay: 0.25s !important;
        animation-delay: 0.25s !important;
    }
    .line-scale-pulse-out-rapid > div {
        background-color: #409EFF;
        width: 4px;
        height: 35px;
        border-radius: 2px;
        margin: 2px;
        -webkit-animation-fill-mode: both;
        animation-fill-mode: both;
        display: inline-block;
        -webkit-animation: line-scale-pulse-out-rapid 0.9s 0s infinite cubic-bezier(.11, .49, .38, .78);
        animation: line-scale-pulse-out-rapid 0.9s 0s infinite cubic-bezier(.11, .49, .38, .78);
    }

  }
}
@keyframes line-scale-pulse-out-rapid {
    0% {
        -webkit-transform: scaley(1);
        transform: scaley(1);
    }

    80% {
        -webkit-transform: scaley(0.3);
        transform: scaley(0.3);
    }
    90% {
        -webkit-transform: scaley(1);
        transform: scaley(1);
    }
}
</style>