<template>
	<div class="product-class">
		<classified-search :config="classifiedConfig" :selected="selectedItems" @doSelectHandler="doClickHandler" />
		<toolbar class="custom-toolbar">
			<span slot="left">
				<el-radio-group size="small" v-model="queryParam.isAble">
					<el-radio-button label="">全部</el-radio-button>
					<el-radio-button label="已启用">只显示启用</el-radio-button>
					<el-radio-button label="已停用">只显示停用</el-radio-button>
				</el-radio-group>
			</span>
			<span slot="right">
				<el-button icon="el-icon-plus" size="small" style="width: 100px;" type="primary" v-show="!editModel" @click="doAdd">新增分类</el-button>
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
		</toolbar>
		<product-class-form :form="productClassForm" :edit-model="editModel" />
	</div>
</template>
<script>
	import {
		marketClassAndProductClassList,
		modelPublicAttrList,
		modelAttrList,
		saveOrUpdateProductClass,
		deletProductClass,
		ableOrDisableProductClass
	} from "api/marketcenter-productclass.js"
	import ProductClassForm from 'components/market-center/product-class/form.vue'
	export default {
		components: {
			ProductClassForm
		},
		data() {
			return {
				editModel: false,
				queryParam: {
					isAble: ''
				},
				//筛选数据
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
				selectedItems: [{
					value: '',
					expanded: false
				}, {
					value: '',
					expanded: false
				}, {
					value: '',
					expanded: false
				}],
				publicAttrs:[],
				productClassForm: {
					publicAttrs:[],
					privateAttrs:[],
					configAttrs:[]
				},
				marketClassMap: null,
				productClassMap: null,
			}
		},
		methods: {
			doAdd() {
				this.productClassForm = {
					isAble: "已停用",
					classList: []
				}
				this.editModel = true;
			},
			doDelete() {
				this.$confirm('您确认删除产品分类, 是否继续?', '系统提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					deletProductClass({
						Vue: this,
						params: {
							marketId: this.productClassForm.id
						},
					}).then(res => {
						if (res.result) {
							this.loadMarketAndClassAndProduct();
						}
					})

				});
			},
			doAbleOrDisable(opName) {
				this.$confirm('您确认' + opName + '产品分类, 是否继续?', '系统提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					ableOrDisableProductClass({
						Vue: this,
						params: {
							marketId: this.productClassForm.id
						},
					}).then(res => {
						if (res.result) {
							this.loadMarketAndClassAndProduct();
						}
					})

				});
			},
			doSave() {
				if (this.productClassForm.alias == null || this.productClassForm.alias == '') {
					this.$message({
						message: '请输入市场名称...',
						type: 'warning'
					});
					return;
				} else if (this.productClassForm.classList == null || this.productClassForm.classList.length == 0) {
					this.$message({
						message: '请维护市场分类...',
						type: 'warning'
					});
					return;
				} else {
					saveOrUpdateProductClass({
						Vue: this,
						params: this.productClassForm,
					}).then(res => {
						if (res.result) {
							this.editModel = false;
							this.loadMarketAndClassAndProduct();
						}
					})
				}
			},

			doClickHandler(index, option) {
				if (index == 0) {
					this.classifiedConfig[1].options.splice(0, this.classifiedConfig[1].options.length);
					this.classifiedConfig[2].options.splice(0, this.classifiedConfig[2].options.length);

					let marketClassArr = this.marketClassMap.get(option.value);
					if (marketClassArr && marketClassArr.length > 0) {
						marketClassArr.forEach(marketClass => {
							marketClass.label = marketClass.alias;
							marketClass.value = marketClass.id;
							this.classifiedConfig[1].options.push(marketClass);
						});
						this.selectedItems[1].value = this.classifiedConfig[1].options[0].value;
						this.doClickHandler(1, this.classifiedConfig[1].options[0])
					}

				} else if (index == 1) {
					this.classifiedConfig[2].options.splice(0, this.classifiedConfig[2].options.length);
					let productClassArr = this.productClassMap.get(option.value);
					if (productClassArr && productClassArr.length > 0) {
						productClassArr.forEach(productClass => {
							productClass.label = productClass.alias;
							productClass.value = productClass.id;
							if (productClass.isAble == '已停用')
								productClass.disabled = true
							this.classifiedConfig[2].options.push(productClass);

						});
						this.selectedItems[2].value = this.classifiedConfig[2].options[0].value;
						this.doClickHandler(2, this.classifiedConfig[2].options[0])
					}
				} else {
					let optionTemp =  { ...option
					}
					delete optionTemp.label;
					delete optionTemp.value;
					delete optionTemp.disabled;
					
					optionTemp.publicAttrs = this.publicAttrs;
					optionTemp.privateAttrs =[];
					optionTemp.configAttrs =[];

					this.productClassForm =optionTemp;
					this.loadModelPrivateAndConfigAttr();
				}

			},
			
			loadModelPrivateAndConfigAttr(){
				modelAttrList({
					Vue: this,
					params: {modelId:this.productClassForm.id},
				}).then(res => {
					if (res.result) {
						this.productClassForm.privateAttrs=res.model.filter(item=>item.attrType==='产品特性');
						this.productClassForm.configAttrs=res.model.filter(item=>item.attrType==='规格配置');
					}
				})
			},
			loadModelPublicAttr(){
				modelPublicAttrList({
					Vue: this,
					params: {},
				}).then(res => {
					if (res.result) {
						this.publicAttrs = res.model;
						this.loadMarketAndClassAndProduct();
					}
				})
			},
			loadMarketAndClassAndProduct() {
				this.classifiedConfig[0].options.splice(0, this.classifiedConfig[0].options.length);
				marketClassAndProductClassList({
					Vue: this,
					params: this.queryParam,
				}).then(res => {
					if (res.result) {

						let marketList = res.model.marketList;
						let classList = res.model.classList;
						let productClassList = res.model.productClassList;

						if (marketList != null && marketList.length > 0) {
							marketList.forEach(market => {
								market.label = market.alias
								market.value = market.id;
								if (market.isAble == '已停用')
									market.disabled = true
								this.classifiedConfig[0].options.push(market);
							});

							this.marketClassMap = new Map();
							classList.forEach(marketClass => {
								if (this.marketClassMap.has(marketClass.marketId))
									this.marketClassMap.get(marketClass.marketId).push(marketClass);
								else
									this.marketClassMap.set(marketClass.marketId, [marketClass]);
							});

							this.productClassMap = new Map();
							productClassList.forEach(productClass => {
								if (this.productClassMap.has(productClass.classId))
									this.productClassMap.get(productClass.classId).push(productClass);
								else
									this.productClassMap.set(productClass.classId, [productClass]);
							});

							//默认选中第一个
							this.selectedItems[0].value = this.classifiedConfig[0].options[0].value;
							this.doClickHandler(0, this.classifiedConfig[0].options[0])
						}

					}
				})
			}
		},
		mounted: function() {
			this.loadModelPublicAttr();
			
		}
	}
</script>
<style lang="less">
	.custom-toolbar {
		margin: 10px 0px;
	}
</style>
