import Vue from 'vue'
import Router from 'vue-router'
import index from '../page/index.vue'
import iframeLink from '../page/iframeLink/index.vue'
import page_404 from '../page/404/index.vue'
import desktop from '../page/desktop/Desktop.vue'
import menu from '../page/menu/menu.vue'
import dataModel from '../page/dataModel/dataModel.vue'
import dataStruct from '../page/dataStruct/dataStruct.vue'
import dataAuthMehod from '../page/dataAuthMehod/dataAuthMehod.vue'
import dataAuthRole from '../page/dataAuthRole/dataAuthRole.vue'
import dataAuthQuery from "../page/dataAuthQuery/dataAuthQuery.vue"
import dataInfo from "../page/dataInfo/dataInfo.vue"
import dataLog from "../page/dataLog/dataLog.vue"
Vue.use(Router)
export default new Router({
	routes: [
		{
			path: '/dataModel',
			name: '/dataModel',
			component: dataModel
		},
		{
			path: '/dataStruct',
			name: '/dataStruct',
			component: dataStruct
		},
		{
			path: '/dataAuthRole',
			name: '/dataAuthRole',
			component: dataAuthRole
		},
		{
			path: '/index2',
			name: 'index2',
			component: iframeLink
		},{
			path: '/menu',
			name: 'menu',
			component: menu
		},
		{
			path: "*",
			component: page_404,
			name: "404"
		},
		{
			path:'/dataAuthMehod',
			name:'/dataAuthMehod',
			component: dataAuthMehod
		},
		{
			path: "/dataAuthQuery",
			name: "/dataAuthQuery",
			component: dataAuthQuery
		},
		{
			path: "/dataInfo",
			name: "/dataInfo",
			component: dataInfo
		},
		{
			path: "/dataLog",
			name: "/dataLog",
			component: dataLog
		}
	// {
	// 	path: '/iframeLink',
	// 	name: 'iframeLink',
	// 	component: iframeLink
	// },
  ]
})
