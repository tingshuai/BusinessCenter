<template>
	<div class="product-class">
		<classified-search :config="classifiedConfig" @selected="selectedItem" />
		<detail-msg :data-left="dataLeft" :dataCenter="dataCenter" :dataRight="dataRight"></detail-msg>
	</div>
</template>
<script>
	import {
		productsList,getPublicData
	} from "./api.js";
	import detailMsg from 'components/qfCommon/detail.vue'
	export default {
		components: {
			detailMsg
		},
		data() {
			return {
				classifiedConfig: [{
					title: '市场名称:',
					options: []
				}, {
					title: '市场大类:',
					options: []
				}, {
					title: '产品大类:',
					options: []
				}],
				dataLeft:{},
				dataCenter:[],
				dataRight:""
			}
		},
		methods: {
			getDataList(){
				let that = this;
				productsList({Vue:this}).then(res=>{
					res.list[0].act = res.list[0].children[0].act = res.list[0].children[0].children[0].act = true;
					that.dataList = res.list;
					that.initData({isFirst:true,cur:[0,0,0]})
					that.$message.success("操作成功！");
				})
			},
			selectedItem(item,data,curItem){
				this.initData({
					isFirst:false,
					cur:curItem,
				})
				this.currentItem = item;
			},
			initData(obj){
				let _lastValue = this.dataList[obj.cur[0]].children[obj.cur[1]].children[obj.cur[2]];
				switch(obj.cur[0]){
					case 0:{
						if( obj.isFirst ){
							this.classifiedConfig[0].options = this.dataList;
							this.classifiedConfig[1].options = this.dataList[0].children;
							this.classifiedConfig[2].options = this.dataList[0].children[0].children;
							this.dataLeft = this.classifiedConfig[2].options[0];
						}else{
							this.classifiedConfig[1].options = this.dataList[obj.cur[0]].children;
							this.classifiedConfig[2].options = this.dataList[obj.cur[0]].children[obj.cur[1]].children;
						}
						break;
					};
					case 1:{
						this.classifiedConfig[2].options = this.dataList[obj.cur[0]].children[obj.cur[1]].children;
						break;
					};
					case 2:{
						break;
					}
				}
				this.getPublic(_lastValue.value);
				
			},
			getPublic(id){
				getPublicData({Vue:this,"id":id}).then(res=>{
					this.dataCenter = res.list;
				})
			}					
		},
		mounted() {
			this.getDataList();
		}
	}
</script>
<style lang="less">
	.custom-toolbar {
		margin: 10px 0px;
	}
	section{

	}
</style>
