<template>
	<div>
		<classified-search :config="classifiedConfig" :selected="selectedItems" @doSelectHandler="doClickHandler" />
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
        dataDefineIndustryList,
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
				//页面初始化数据,这里一次性从设备模型表并分类处理返回 ------------------------------------------需改动
				
				this.industryArr.splice(0,this.industryArr.length);
				this.industryMap = new Map();
				this.devClassMap = new Map();
				this.brandMap = new Map();
				this.specMap = new Map();
				this.productDateMap = new Map();
				this.plcBrandMap = new Map();
				this.modelMap = new Map();
				

				 dataDefineIndustryList({Vue:this,params:{
					 dirCode:'industry'
				 }}).then(res=>{
					if(res.result){
						this.industryArr = res.model;
						this.industryArr.forEach(industry => {
							industry.label = industry.code;
							industry.value = industry.code;
							this.classifiedConfig[0].options.push(industry);
						});
						
						devModelList({Vue:this,params:{
						}}).then(res=>{
							if(res.result){
								let modelList = res.model;
								modelList.forEach(model=>{
									let industryTempArr =model.industry.split(',');
									industryTempArr.forEach(industry=>{
										if(this.industryMap.has(industry))
											this.industryMap.get(industry).push(model.devClass);
										else
											this.industryMap.set(industry,[model.devClass]);
											
										if(this.devClassMap.has(industry+'-'+model.devClass))
											this.devClassMap.get(industry+'-'+model.devClass).push(model.brand);
										else
											this.devClassMap.set(industry+'-'+model.devClass,[model.brand]);
										
										if(this.brandMap.has(industry+'-'+model.devClass+'-'+model.brand))
											this.brandMap.get(industry+'-'+model.devClass+'-'+model.brand).push(model.spec);
										else
											this.brandMap.set(industry+'-'+model.devClass+'-'+model.brand,[model.spec]);
											
										if(this.specMap.has(industry+'-'+model.devClass+'-'+model.brand+'-'+model.spec))
											this.specMap.get(industry+'-'+model.devClass+'-'+model.brand+'-'+model.spec).push(model.productDate);
										else
											this.specMap.set(industry+'-'+model.devClass+'-'+model.brand+'-'+model.spec,[model.productDate]);
											
										if(this.productDateMap.has(industry+'-'+model.devClass+'-'+model.brand+'-'+model.spec+'-'+model.productDate))
											this.productDateMap.get(industry+'-'+model.devClass+'-'+model.brand+'-'+model.spec+'-'+model.productDate).push(model.plcBrand);
										else
											this.productDateMap.set(industry+'-'+model.devClass+'-'+model.brand+'-'+model.spec+'-'+model.productDate,[model.plcBrand]);
											
										if(this.plcBrandMap.has(industry+'-'+model.devClass+'-'+model.brand+'-'+model.spec+'-'+model.productDate+'-'+model.plcBrand))
											this.plcBrandMap.get(industry+'-'+model.devClass+'-'+model.brand+'-'+model.spec+'-'+model.productDate+'-'+model.plcBrand).push(model.plcSpec);
										else
											this.plcBrandMap.set(industry+'-'+model.devClass+'-'+model.brand+'-'+model.spec+'-'+model.productDate+'-'+model.plcBrand,[model.plcSpec]);
									
										this.modelMap.set(industry+'-'+model.devClass+'-'+model.brand+'-'+model.spec+'-'+model.productDate+'-'+model.plcBrand+'-'+model.plcSpec,model);
									})
								})
								//默认选中第一个
								this.selectedItems[0].value = this.classifiedConfig[0].options[0].value;
								this.doClickHandler(0, this.classifiedConfig[0].options[0])
							}
						})
					}
				})
			},
			//分类搜索 点击事件 ---无须改动
			doClickHandler(index, option){
				this.modelForm = {};
				if (index == 0) {
					this.classifiedConfig[1].options.splice(0, this.classifiedConfig[1].options.length);
					this.classifiedConfig[2].options.splice(0, this.classifiedConfig[2].options.length);
					this.classifiedConfig[3].options.splice(0, this.classifiedConfig[3].options.length);
					this.classifiedConfig[4].options.splice(0, this.classifiedConfig[4].options.length);
					this.classifiedConfig[5].options.splice(0, this.classifiedConfig[5].options.length);
					this.classifiedConfig[6].options.splice(0, this.classifiedConfig[6].options.length);
					
					let devClassArr = this.industryMap.get(option.value);
					if (devClassArr && devClassArr.length > 0) {
						devClassArr.forEach(devClass => {
							let temp={};
							temp.label = devClass;
							temp.value = option.value+'-'+devClass;
							this.classifiedConfig[1].options.push(temp);
						});
						this.selectedItems[1].value = this.classifiedConfig[1].options[0].value;
						this.doClickHandler(1, this.classifiedConfig[1].options[0])
					}

				} else if (index == 1) {
					this.classifiedConfig[2].options.splice(0, this.classifiedConfig[2].options.length);
					this.classifiedConfig[3].options.splice(0, this.classifiedConfig[3].options.length);
					this.classifiedConfig[4].options.splice(0, this.classifiedConfig[4].options.length);
					this.classifiedConfig[5].options.splice(0, this.classifiedConfig[5].options.length);
					this.classifiedConfig[6].options.splice(0, this.classifiedConfig[6].options.length);
					let brandArr = this.devClassMap.get(option.value);
					if (brandArr && brandArr.length > 0) {
						brandArr.forEach(brand => {
							let temp={};
							temp.label = brand;
							temp.value = option.value+'-'+brand;
							this.classifiedConfig[2].options.push(temp);
							
						});
						this.selectedItems[2].value = this.classifiedConfig[2].options[0].value;
						this.doClickHandler(2, this.classifiedConfig[2].options[0])
					}

				} else if (index == 2) {
					this.classifiedConfig[3].options.splice(0, this.classifiedConfig[3].options.length);
					this.classifiedConfig[4].options.splice(0, this.classifiedConfig[4].options.length);
					this.classifiedConfig[5].options.splice(0, this.classifiedConfig[5].options.length);
					this.classifiedConfig[6].options.splice(0, this.classifiedConfig[6].options.length);
					let specArr = this.brandMap.get(option.value);
					if (specArr && specArr.length > 0) {
						specArr.forEach(spec => {
							let temp={};
							temp.label = spec;
							temp.value = option.value+'-'+spec;
							this.classifiedConfig[3].options.push(temp);
						});
						this.selectedItems[3].value = this.classifiedConfig[3].options[0].value;
						this.doClickHandler(3, this.classifiedConfig[3].options[0])
					}
				}else if (index == 3) {
					this.classifiedConfig[4].options.splice(0, this.classifiedConfig[4].options.length);
					this.classifiedConfig[5].options.splice(0, this.classifiedConfig[5].options.length);
					this.classifiedConfig[6].options.splice(0, this.classifiedConfig[6].options.length);
					let productDateArr = this.specMap.get(option.value);
					if (productDateArr && productDateArr.length > 0) {
						productDateArr.forEach(productDate => {
							let temp={};
							temp.label = productDate;
							temp.value = option.value+'-'+productDate;
							this.classifiedConfig[4].options.push(temp);
						});
						this.selectedItems[4].value = this.classifiedConfig[4].options[0].value;
						this.doClickHandler(4, this.classifiedConfig[4].options[0])
					}
				}  else if (index == 4) {
					this.classifiedConfig[5].options.splice(0, this.classifiedConfig[5].options.length);
					this.classifiedConfig[6].options.splice(0, this.classifiedConfig[6].options.length);
					let plcBrandArr = this.productDateMap.get(option.value);
					if (plcBrandArr && plcBrandArr.length > 0) {
						plcBrandArr.forEach(plcBrand => {
							let temp={};
							temp.label = plcBrand;
							temp.value = option.value+'-'+plcBrand;
							this.classifiedConfig[5].options.push(temp);
						});
						this.selectedItems[5].value = this.classifiedConfig[5].options[0].value;
						this.doClickHandler(5, this.classifiedConfig[5].options[0])
					}
				} else if (index == 5) {
					this.classifiedConfig[6].options.splice(0, this.classifiedConfig[6].options.length);
					let plcSpecArr = this.plcBrandMap.get(option.value);
					if (plcSpecArr && plcSpecArr.length > 0) {
						plcSpecArr.forEach(plcSpec => {
							let temp={};
							temp.label = plcSpec;
							temp.value = option.value+'-'+plcSpec;
							this.classifiedConfig[6].options.push(temp);
							
						});
						this.selectedItems[6].value = this.classifiedConfig[6].options[0].value;
						this.doClickHandler(6, this.classifiedConfig[6].options[0])
					}
				} else{
					this.modelForm = this.modelMap.get(option.value);
					
				}
				this.doTabClick();
				
				
				
			}
			
		},
		mounted() {
			this.doSearch();
		}
	}
</script>
<style lang="less">
	
</style>
