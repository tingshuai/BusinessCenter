<template>
	<el-row :gutter="10" class="product-class-form">
		<el-col :span="6">
			<el-card>
				<h1>产品概述</h1>
				<el-form ref="form" class="rbox-form" size="small" :rules="rules"  :model="form" label-width="100px">
					<el-form-item label="产品大类:" prop="alias">
						<el-input :disabled="!editModel" v-model="form.alias"></el-input>
					</el-form-item>
					<el-form-item label="关联资源:" prop="resource">
						<el-select :disabled="!editModel"  v-model="form.resource" placeholder="请选择" @change="doResourceChange">
							<el-option
								v-for="item in resourceArr"
								:key="item.code"
								:label="item.value"
								:value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="交付方式:" prop="deliver">
						<el-input disabled v-model="form.deliver"></el-input>
					</el-form-item>
					
					<el-form-item label="启停标识:">
						<el-tag type="success" v-show="form.isAble=='已启用'">{{form.isAble}}</el-tag>
						<el-tag type="danger" v-show="form.isAble=='已停用'">{{form.isAble}}</el-tag>
					</el-form-item>
					<el-form-item label="启停时间:">
						<el-date-picker disabled v-model="form.ableTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
							placeholder="选择日期时间">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="创建时间">
						<el-date-picker disabled v-model="form.ableTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
							placeholder="选择日期时间">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="更新时间">
							<el-date-picker disabled v-model="form.ableTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
								placeholder="选择日期时间">
							</el-date-picker>
					</el-form-item>
				</el-form>
			</el-card>

		</el-col>
		<el-col :span="12">
					<el-card>
						<h1>
								  公有属性
							  </h1>
							  <div>
								  <el-tag type="info" v-for="item in form.publicAttrs">{{item.alias}}</el-tag>
							  </div>
							  <h1>
									产品特性
							  </h1>
							  <div>
							  	<el-tag  v-for="item in form.privateAttrs" v-show="item.deleted=='F'">{{item.alias}}</el-tag>
									<el-button size="small" style="width: 100px;" type="primary" v-show="editModel" @click="doAttrMaintain('private')">点击维护</el-button>
						
							  </div>
										<h1>
											规格配置
										</h1>
										<div>
											<el-tag type="success" v-for="item in form.configAttrs" v-show="item.deleted=='F'">{{item.alias}}</el-tag>
											<el-button size="small" style="width: 100px;" type="primary" v-show="editModel" @click="doAttrMaintain('config')">点击维护</el-button>
								
										</div>
					</el-card>
		
				</el-col>
		<el-col :span="6">
			<el-card>
				<h1>详情模板</h1>
			  <img src="../../../assets/img/404.jpg" />
			</el-card>
		</el-col>
		<attr-maintain :config="maintainWinConfig" @doSave="doAttrSure"></attr-maintain>
	</el-row>
</template>
<script>
	import {
		dataDirProductRefResourceList
	} from "../../../api/marketcenter-productclass.js"
	export default {
		
		props: ['form','editModel'],
		data(){
			return {
				attrMaintain:'',
				resourceArr:[],
				resourceMap:null,
				dataDirMap:null,
				rules:{
					alias: [{
						required: true,
						message: '请输入产品大类...',
						trigger: 'change'
					}],
					resource: [{
						required: true,
						message: '请选择关联资源...',
						trigger: 'change'
					}],
					deliver: [{
						required: true,
						message: '请输入发货方式...',
						trigger: 'change'
					}]
				},
				maintainWinConfig: {
					title: '产品分类维护', //弹窗标题
					dialogVisible: false, //弹窗显示
					width: '600px', //弹窗宽
					tempList: [],
					emptyRow: {
						id: 0,
						alias: '',
						deleted: 'F'
					},
					btnData: [{
						isShow: true,
						disabled: false,
						name: '取消', //按钮名
						method: 'cancel', //回调函数
					}, {
						disabled: false,
						isShow: true,
						name: '确定', //按钮名
						method: 'doSave', //回调函数
					}]
				}
			}
		},
		methods:{
			doAttrMaintain(attrMaintain){
				this.attrMaintain = attrMaintain;
				if(attrMaintain=='private'){
					this.maintainWinConfig.tempList = JSON.parse(JSON.stringify(this.form.privateAttrs))
				}else{
					this.maintainWinConfig.tempList = JSON.parse(JSON.stringify(this.form.configAttrs))
				}
				
				this.maintainWinConfig.tempList.push({ ...this.maintainWinConfig.emptyRow });
				this.maintainWinConfig.dialogVisible = true;
			},
			doAttrSure(tempArr){
				if(this.attrMaintain=='private')
						this.form.privateAttrs = tempArr
				else
						this.form.configAttrs = tempArr
			},
			doResourceChange(refResource){
					this.form.deliver = this.dataDirMap.get(this.resourceMap.get(refResource)).value;
			},
			loadDataDir(){
				dataDirProductRefResourceList({
					Vue: this,
					params: {
						dirCode: 'PRODUCT_REF_RESOURCE'
					}
				}).then(res => {
					if (res.result) {
						let temArr = res.model;
						this.dataDirMap = new Map();
						this.resourceMap = new Map();
						temArr.forEach(dataDefine=>{
							if(dataDefine.parentId==0){
								this.resourceArr.push(dataDefine);
								this.resourceMap.set(dataDefine.value,dataDefine.id);
							}else{
									this.dataDirMap.set(dataDefine.parentId,dataDefine);
							}
							
						});
					}
				})
			}
		},
		mounted: function() {
			this.loadDataDir();
			
		}
	}
</script>
<style lang="less">
	.product-class-form{
		h1{
			line-height: 40px;
		}
		.el-tag{
			margin-right: 10px;
			margin-bottom: 10px;
			padding: 0 20px;
		}
	}
</style>
