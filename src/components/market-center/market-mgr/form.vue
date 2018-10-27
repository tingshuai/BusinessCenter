<template>
	<el-row :gutter="10" class="market-mgr">
		<el-col :span="8">
			<el-card>
				<h1>市场概述</h1>
				<el-form ref="form" class="rbox-form" size="small" :rules="rules" :model="form" label-width="130px">
					<el-form-item label="市场名称:" prop="alias">
						<el-input :disabled="!editModel" v-model="form.alias"></el-input>
					</el-form-item>
					<el-form-item label="市场分类:">
						<el-tag v-for="item in form.classList" v-show="item.deleted=='F'">{{item.alias}}</el-tag>
						<el-button size="small" style="width: 80px;" type="primary" v-show="editModel" @click="doAttrMaintain">点击维护</el-button>
					</el-form-item>
					<el-form-item label="创建时间">
						<el-date-picker disabled v-model="form.createTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
							placeholder="选择日期时间">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="更新时间">
							<el-date-picker disabled v-model="form.modifyTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
								placeholder="选择日期时间">
							</el-date-picker>
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
				</el-form>
			</el-card>

		</el-col>
		<el-col :span="16">
			<el-card>
				<h1>市场协议</h1>
			  <img src="../../../assets/img/404.jpg" />
			</el-card>
		</el-col>
		<attr-maintain :config="maintainWinConfig" @doSave="doAttrSure"></attr-maintain>
	</el-row>
	
</template>
<script>

	export default {
		props: ['form','editModel'],
		data(){
			return {
				rules:{
					alias: [{
						required: true,
						message: '请输入市场名称...',
						trigger: 'change'
					}]
				},
				maintainWinConfig: {
					title: '市场分类维护', //弹窗标题
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
			doAttrMaintain(){
				if(this.form.classList==null){
						this.maintainWinConfig.tempList =[];
				}else{
					this.maintainWinConfig.tempList = JSON.parse(JSON.stringify(this.form.classList))
				}
	
				this.maintainWinConfig.tempList.push({ ...this.maintainWinConfig.emptyRow
				})
				this.maintainWinConfig.dialogVisible = true
			},
			doAttrSure(tempArr){
					this.form.classList = tempArr
			}
		}
	}
</script>
<style lang="less">
	.market-mgr{
		h1{
			line-height: 40px;
		}
		.el-tag{
			margin: 5px;
		}
	}
	
</style>
