<template>
	<div>
		<classified-searchs :config="classifiedConfig" :selected="selectedItems" @doSelectHandler="doClickHandler" />

        <toolbars class="custom-toolbarsss">
			<span slot="left">
				<el-radio-group size="small" v-model="queryParam.isAble">
					<el-radio-button label="">全部</el-radio-button>
					<el-radio-button label="已启用">只显示启用</el-radio-button>
					<el-radio-button label="已停用">只显示停用</el-radio-button>
				</el-radio-group>
			</span> 
			<span slot="right">
				<el-button icon="el-icon-plus" size="small" style="width: 100px;" type="primary" v-show="!editModel" @click="doAdd">新增模型</el-button>
				<el-button icon="el-icon-edit" size="small" style="width: 80px;" :disabled="productClassForm==null||productClassForm.isAble=='已启用'"
				 v-show="!editModel" @click="editModel = true;">编辑</el-button>
				<el-button icon="el-icon-delete" size="small" style="width: 80px;" :disabled="productClassForm==null||productClassForm.isAble=='已启用'"
				 v-show="!editModel" @click="doDelete">删除</el-button>
				<el-button icon="el-icon-setting" size="small" style="width: 80px;" :disabled="productClassForm==null" v-show="!editModel"
				 @click="doAbleOrDisable(productClassForm.isAble==null?'启/停用':productClassForm.isAble=='已停用'?'启用':'停用')">
					{{productClassForm.isAble==null?'启/停用':productClassForm.isAble=='已停用'?'启用':'停用'}}
				</el-button>
				<el-button icon="el-icon-success" size="small" style="width: 80px;" type="primary" v-show="editModel" @click="doSave">保存</el-button>
				<el-button icon="el-icon-back" size="small" style="width: 80px;" type="danger" v-show="editModel" @click="editModel=false;">返回</el-button>
			</span>
		</toolbars>





		<el-tabs v-model="activeName" class="model-info" @tab-click="doTabClick">
			<el-tab-pane label="模型概况" name="model-info">
				<model-info :form="modelForm"/>
			</el-tab-pane>
		 	<el-tab-pane label="台账属性" name="model-attr">
				<model-attr :config="modelForm" ref="modelAttr"/>
			</el-tab-pane>
			<el-tab-pane label="运行参数" name="model-param" >
				<model-param :config="modelForm" ref="modelParam"/>
			</el-tab-pane>
			<el-tab-pane label="过滤规则" name="model-filter" >
				<model-filter :config="modelForm" ref="modelFilter"/>
			</el-tab-pane>
			<el-tab-pane label="解析规则" name="model-resoluve" >
				<model-resoluve :config="modelForm" ref="modelResoluve"/>
			</el-tab-pane>
		</el-tabs>
	</div>
</template> 
<script>
	import ModelInfo from 'components/dev-center/dev-model/model-info.vue'
	import ModelAttr from 'components/dev-center/dev-model/model-attr.vue'
	import ModelParam from 'components/dev-center/dev-model/model-param.vue'
	import ModelFilter from 'components/dev-center/dev-model/model-filter.vue'
	import ModelResoluve from 'components/dev-center/dev-model/model-resoluve.vue'
	
	import {
        dataDefineIndustryList, //获取标签数据
        devModelList
    } from "./api.js"
	//模拟数据
	export default {
		components: {
			ModelInfo,
			ModelAttr,
			ModelParam,
			ModelFilter,
			ModelResoluve
		},
		data(){
			return {
				editModel: false,
                queryParam: {
					isAble: ''
				},
				activeName:'model-info',
				//筛选数据
				classifiedConfig: [{
					title: '行业领域:',
					options: []
				}, {
					title: '设备大类:',
					options: []
				}, {
					title: '设备品牌:',
					options: []
				}, {
					title: '设备型号:',
					options: []
				}, {
					title: '出厂年月:',
					options: []
				}, {
					title: '处理器品牌:',
					options: []
				}, {
					title: '处理器型号:',
					options: []
				}],
				selectedItems: [{
					value: '',
					expanded: false
				}, {
					value: '',
					expanded: false
				}, {
					value: '',
					expanded: false
				}, {
					value: '',
					expanded: false
				}, {
					value: '',
					expanded: false
				}, {
					value: '',
					expanded: false
				}, {
					value: '',
					expanded: false
				}],
				modelForm:{
					
				},
				industryArr:[],//行业数组
				industryMap:null,//行业-设备大类Map
				devClassMap:null,//设备大类-设备品牌Map
				brandMap:null,//设备品牌-设备型号Map
				specMap:null,//设备型号-出厂年月Map
				productDateMap:null,//出厂年月-处理器品牌Map
				plcBrandMap:null,//处理器品牌-处理器型号Map
				modelMap:null,//处理器品牌-处理器型号Map
			}
		},
		methods:{
			doAdd() {
				alert('3333333333333')
			},
			productClassForm(){
				alert('66666666666666')
			},
			doDelete(){
				alert("8888888888888")
			},
			doSave(){
				alert("9999999999999999")
			},
			doTabClick(){
				if(this.activeName=='model-attr')
					this.$refs.modelAttr.doSearch(this.modelForm.id);
				else if(this.activeName=='model-param')
					this.$refs.modelParam.doSearch(this.modelForm.id);
				else if(this.activeName=='model-filter')
					this.$refs.modelFilter.doSearch(this.modelForm.id);
				else if(this.activeName=='model-resoluve')
					this.$refs.modelResoluve.doSearch(this.modelForm.id);
			},
			doSearch(){
			
				this.industryArr.splice(0,this.industryArr.length);
				this.industryMap = new Map();
				this.devClassMap = new Map();
				this.brandMap = new Map();
				this.specMap = new Map();
				this.productDateMap = new Map();
				this.plcBrandMap = new Map();
				this.modelMap = new Map();
				

				 dataDefineIndustryList({Vue:this,params:{ //获取标签数据
					 dirCode:'industry'
				 }}).then(res=>{
					if(res.code){
						this.industryArr = res.list;
						this.industryArr.forEach(industry => {
							industry.label = industry.key;
							industry.value = industry.value;
							this.classifiedConfig[0].options.push(industry);
						});
						
					
						//默认选中第一个
						this.selectedItems[0].value = this.classifiedConfig[0].options[0].value;
						this.selectedItems[1].value = this.classifiedConfig[0].options[0].value;
						this.selectedItems[2].value = this.classifiedConfig[0].options[0].value;
						this.selectedItems[3].value = this.classifiedConfig[0].options[0].value;
						this.selectedItems[4].value = this.classifiedConfig[0].options[0].value;
						this.selectedItems[5].value = this.classifiedConfig[0].options[0].value;
						this.selectedItems[6].value = this.classifiedConfig[0].options[0].value;
						this.doClickHandler(0, this.classifiedConfig[0].options[0])
				

					}
				})
			},
			//分类搜索 点击事件
			doClickHandler(index, option){
		
                switch(index){//点击的层级
					case 0:{
					    this.classifiedConfig[1].options=  [];
						// this.queryParam.appType= option.value;
						let mar = option.children;
						mar.forEach(list =>  {
							list.label = list.key;
							list.value = list.value;		
							this.classifiedConfig[1].options.push(list); //设备大类

							this.classifiedConfig[2].options=  [];
							let mar = list.children;
							mar.forEach(list =>  {
								list.label = list.key;
								list.value = list.value;		
								this.classifiedConfig[2].options.push(list); //设备品牌

								this.classifiedConfig[3].options=  [];
								let mar = list.children;
								mar.forEach(list =>  {
									list.label = list.key;
									list.value = list.value;		
									this.classifiedConfig[3].options.push(list); //设备型号

									this.classifiedConfig[4].options=  [];
									let mar = list.children;
									mar.forEach(list =>  {
										list.label = list.key;
										list.value = list.value;		
										this.classifiedConfig[4].options.push(list); //出厂年月

										this.classifiedConfig[5].options=  [];
										let mar = list.children;
										mar.forEach(list =>  {
											list.label = list.key;
											list.value = list.value;		
											this.classifiedConfig[5].options.push(list); //处理器品牌

											this.classifiedConfig[6].options=  [];
											let mar = list.children;
											mar.forEach(list =>  {
												list.label = list.key;
												list.value = list.value;		
												this.classifiedConfig[6].options.push(list); //处理器型号
											})
										})
									})
								})
							})
						})
					
						break;
					};
					case 1:{
						this.classifiedConfig[2].options=  [];
						// this.queryParam.industry= option.value;
						let mars = option.children;
						mars.forEach(lists =>  {
							lists.label = lists.key;
							lists.value = lists.value;		
							this.classifiedConfig[2].options.push(lists); //设备品牌
							
							this.classifiedConfig[3].options=  [];
							let mar = lists.children;
							mar.forEach(list =>  {
								list.label = list.key;
								list.value = list.value;		
								this.classifiedConfig[3].options.push(list); //设备型号

								this.classifiedConfig[4].options=  [];
								let mar = list.children;
								mar.forEach(list =>  {
									list.label = list.key;
									list.value = list.value;		
									this.classifiedConfig[4].options.push(list); //出厂年月

									this.classifiedConfig[5].options=  [];
									let mar = list.children;
									mar.forEach(list =>  {
										list.label = list.key;
										list.value = list.value;		
										this.classifiedConfig[5].options.push(list); //处理器品牌

										this.classifiedConfig[6].options=  [];
										let mar = list.children;
										mar.forEach(list =>  {
											list.label = list.key;
											list.value = list.value;		
											this.classifiedConfig[6].options.push(list); //处理器型号
										})
									})
								})
							})		
						})
						
						break;
					};
					case 2:{					
						this.classifiedConfig[3].options=  [];
						// this.queryParam.industry= option.value;
						let mars = option.children;
						mars.forEach(lists =>  {
							lists.label = lists.key;
							lists.value = lists.value;		
							this.classifiedConfig[3].options.push(lists); //行业领域

							this.classifiedConfig[4].options=  [];
							let mar = lists.children;
							mar.forEach(list =>  {
								list.label = list.key;
								list.value = list.value;		
								this.classifiedConfig[4].options.push(list); //出厂年月

								this.classifiedConfig[5].options=  [];
								let mar = list.children;
								mar.forEach(list =>  {
									list.label = list.key;
									list.value = list.value;		
									this.classifiedConfig[5].options.push(list); //处理器品牌

									this.classifiedConfig[6].options=  [];
									let mar = list.children;
									mar.forEach(list =>  {
										list.label = list.key;
										list.value = list.value;		
										this.classifiedConfig[6].options.push(list); //处理器型号
									})
								})
							})
						})
					
						break;
					};
					case 3:{					
						this.classifiedConfig[4].options=  [];
					
						let mars = option.children;
						mars.forEach(lists =>  {
							lists.label = lists.key;
							lists.value = lists.value;		
							this.classifiedConfig[4].options.push(lists); //行业领域

							this.classifiedConfig[5].options=  [];
								let mar = lists.children;
								mar.forEach(list =>  {
									list.label = list.key;
									list.value = list.value;		
									this.classifiedConfig[5].options.push(list); //处理器品牌

									this.classifiedConfig[6].options=  [];
									let mar = list.children;
									mar.forEach(list =>  {
										list.label = list.key;
										list.value = list.value;		
										this.classifiedConfig[6].options.push(list); //处理器型号
									})
								})
						})
					
						break;
					};
					case 4:{					
						this.classifiedConfig[5].options=  [];
						// this.queryParam.industry= option.value;
						let mars = option.children;
						mars.forEach(lists =>  {
							lists.label = lists.key;
							lists.value = lists.value;		
							this.classifiedConfig[5].options.push(lists); //行业领域

							this.classifiedConfig[6].options=  [];
								let mar = lists.children;
								mar.forEach(list =>  {
									list.label = list.key;
									list.value = list.value;		
									this.classifiedConfig[6].options.push(list); //处理器型号
							})
						})
					
						break;
					};
					case 5:{					
						this.classifiedConfig[6].options=  [];
						// this.queryParam.industry= option.value;
						let mars = option.children;
						mars.forEach(lists =>  {
							lists.label = lists.key;
							lists.value = lists.value;		
							this.classifiedConfig[6].options.push(lists); //行业领域
						})
					
						break;
					};
					case 6:{	
					
						break;
					};
				}
			}
		},
		mounted() {
			this.doSearch();
		}
	}
</script>
<style lang="less">
	.custom-toolbarsss {
		margin: 10px 0px;
		background:white;
	}
</style>