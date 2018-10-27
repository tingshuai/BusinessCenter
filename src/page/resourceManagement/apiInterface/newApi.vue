//API接口
<template>
	<div class="market-mgr">
		<classified-search :config="classifiedConfig" :selected="selectedItems" @doSelectHandler="doClickHandler" />
		<toolbars class="custom-toolbar">
			<span slot="left">
				<el-radio-group size="small" v-model="queryParam.isAble" @change="doSearch">
					<el-radio-button label="">全部</el-radio-button>
					<el-radio-button label="已启用">只显示启用</el-radio-button>
					<el-radio-button label="已停用">只显示停用</el-radio-button>
				</el-radio-group>
                <span>
                    <el-input size="small" style="width: 150px;" v-model="queryParam.province" placeholder="接口名称搜索..."></el-input>
                    <el-button size="small" style="width: 80px;" type="primary">查询</el-button>
                    <el-button size="small" style="width: 100px;">清空条件</el-button>
                 </span>
			</span>
            
			<span slot="right">
				<el-button icon="el-icon-plus" size="small" style="width: 100px;" type="primary" v-show="!editModel" @click="doAdd">新增API</el-button>
				<el-button icon="el-icon-edit" size="small" style="width: 80px;" :disabled="marketForm==null||marketForm.isAble=='已启用'" v-show="!editModel" @click="editModel = true;">编辑</el-button>
				<el-button icon="el-icon-delete" size="small" style="width: 80px;" :disabled="marketForm==null||marketForm.isAble=='已启用'"
				   v-show="!editModel" @click="doDelete">删除</el-button>
				<el-button icon="el-icon-setting" size="small" style="width: 80px;" :disabled="marketForm==null" v-show="!editModel" @click="doAbleOrDisable(marketForm.isAble==null?'启/停用':marketForm.isAble=='已停用'?'启用':'停用')">
					{{marketForm.isAble==null?'启/停用':marketForm.isAble=='已停用'?'启用':'停用'}}
				</el-button>
				<el-button icon="el-icon-success" size="small" style="width: 80px;" type="primary" v-show="editModel" @click="doSave">保存</el-button>
				<el-button icon="el-icon-back" size="small" style="width: 80px;" type="danger" v-show="editModel" @click="editModel=false;">返回</el-button>
			</span>
		</toolbars>

        <div>
			<el-table height="600" border stripe ref="table" :data="tableData" style="width: 100%" @selection-change="tableSelectChanged"
			    @row-dblclick="doView" @row-click="tableRowClick">
				<el-table-column type="selection" width="55" />
				<el-table-column resizable show-overflow-tooltip property="authType" align="center" label="选择" width="120">
					<template slot-scope="scope">
						<el-tag size="medium" :type="scope.row.authType=='已认证'?'success':scope.row.authType=='待认证'?'warning':scope.row.authType=='认证失败'?'danger':'info'">{{ scope.row.authType }}</el-tag>
					</template>
				</el-table-column>
				<el-table-column resizable show-overflow-tooltip property="province" align="center" label="接口分类" width="120" />
				<el-table-column resizable show-overflow-tooltip property="city" align="center" label="行业领域" width="120" />
				<el-table-column resizable show-overflow-tooltip property="certificationType" align="center" label="应用专属" width="100" />
				<el-table-column resizable show-overflow-tooltip property="userName" align="center" label="接口编码" width="150" />
				<el-table-column resizable show-overflow-tooltip property="userName" align="center" label="接口名称" />
				<el-table-column resizable show-overflow-tooltip property="companyLinkman" align="center" label="版本号" width="120" />
				<el-table-column resizable show-overflow-tooltip property="companyLinkphone" align="center" label="接口地址" width="120" />
				<el-table-column resizable show-overflow-tooltip property="authDate" align="center" label="可见设置" width="120" />

				<el-table-column label="操作" align="center" width="200">
					<template slot-scope="scope">
						<el-button size="mini" type="primary" :disabled="scope.row.authType!='待认证'" @click="doAudit(scope.row)">认证审核</el-button>
						<el-button size="mini" type="danger" @click="doView(scope.row)">查看</el-button>
					</template>
				</el-table-column>
				</el-table-column>
			</el-table>
			<div class="my-pagination">
				<page-tool @doSearch="doSearch" :pageParam="page"></page-tool>
			</div>
		</div>
	</div>
</template>
<script>
	import {
		marketList,
		saveOrUpdateMarket,
		deletMarket,
		ableOrDisableMarket
	} from "./api.js"
	export default {
		components: {
		},
		data() {
			return {
				editModel: false,
				queryParam: {
					isAble: ''
				},
				//筛选数据
				classifiedConfig: [{
					title: '接口分类:',
					options: []
				},{
					title: '行业领域:',
					options: []
				},{
					title: '应用专属:',
					options: []
				}],
				selectedItems: [{
					value: '',
					expanded: false
				}],
				marketForm: {

                },
                //列表
                currSelItem: null,
				selItemArr: [],

				isBatch: false,
				queryParam: {
					status:''
				},
				page: {
					pageNo: 1,
					pageSize: 10,
					total: 0
				},
				tableData: []
			}
		},
		methods: {
			doAdd() {
				this.marketForm = {
					isAble: "已停用"
				}
				this.editModel = true;
			},
			doDelete() {
				this.$confirm('您确认删除市场, 是否继续?', '系统提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					deletMarket({
						Vue: this,
						params: {
							marketId: this.marketForm.id
						},
					}).then(res => {
						if (res.result) {
							this.doSearch();
						}
					})

				});
			},
			doAbleOrDisable(opName) {
				this.$confirm('您确认' + opName + '市场, 是否继续?', '系统提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					ableOrDisableMarket({
						Vue: this,
						params: {
							marketId: this.marketForm.id
						},
					}).then(res => {
						if (res.result) {
							this.doSearch();
						}
					})

				});
			},
			doSave() {
				this.$refs['marketForm'].validate((valid) => {
					if (valid) {
						saveOrUpdateMarket({
							Vue: this,
							params: this.marketForm,
						}).then(res => {
							if (res.result) {
								this.editModel = fasle;
								this.doSearch();
							}
						})
					}
				});
			},
			doClickHandler(index, option) {
				this.marketForm = { ...option
				};
				delete this.marketForm.label;
				delete this.marketForm.value;
				delete this.marketForm.disabled;
			},
			doSearch() {
				this.classifiedConfig[0].options.splice(0, this.classifiedConfig[0].options.length);
				marketList({
					Vue: this,
					params: this.queryParam,
				}).then(res => {
					if (res.result) {
						console.log(res)
						let marketList = res.model;
						if (marketList != null && marketList.length > 0) {
							marketList.forEach(market => {
								market.label = market.alias
								market.value = market.id;
								if (market.isAble == '已停用')
									market.disabled = true
								this.classifiedConfig[0].options.push(market);
							});
							//默认选中第一个
							this.selectedItems[0].value = this.classifiedConfig[0].options[0].value;
							this.doClickHandler(0, this.classifiedConfig[0].options[0])
						}

					}
				})
            },
            //列表----------------------
            doSearch() {

			},
			tableRowClick(row) {
				this.currSelItem = row;
				if (row) {
					this.$refs.table.toggleRowSelection(row);
				} else {
					this.$refs.table.clearSelection();
				}
			},
			tableSelectChanged(selection) {
				this.selItemArr = selection;
				let isBatch = true;
				if (!selection || selection.length == 0)
					isBatch = false;
				else {
					selection.forEach(row => {
						if (row.authType != '待认证')
							isBatch = false;
					});
				}
				this.isBatch = isBatch
			},
			doView(row) {

				if (row.certificationType == "个人") {
					this.viewDetailData.isPer = true;
					this.viewDetailData.perForm = { ...row
					}
					this.viewDetailData.ownerGender = "男";
				} else {
					this.viewDetailData.isPer = false;
					this.viewDetailData.pubForm = { ...row
					}
					this.viewDetailData.pubForm.companyName = this.viewDetailData.pubForm.userName
				}
				this.viewDetailData.dialogVisible = true;

			},
			doAudit(){
				this.isBatch = false;
				this.showAudit();
			},
			batchAudit(){
				this.isBatch = true;
				this.showAudit();
			},
			showAudit(){
				if(this.$refs.form) {
					this.$refs.form.resetFields();
				}
				this.approvalData.passActive = true;
				this.approvalData.dialogVisible = true;
			}
		},
		mounted: function () {
			this.doSearch();
		}
	}
</script>
<style lang="less">
	.custom-toolbar {
		margin: 10px 0px;
    }
</style>