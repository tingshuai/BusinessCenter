//应收款管理
<template>
	<div class="market-mgr">
		<toolbars class="custom-toolbarFs">
			<span slot="left">
				<el-radio-group size="small" v-model="queryParam.isAble" @change="cloudApplication">
					<el-radio-button label="">全部</el-radio-button>
					<el-radio-button label="T">已结清</el-radio-button>
					<el-radio-button label="F">未结清</el-radio-button>
				</el-radio-group>
                <span>
                    <el-input size="small" style="width: 150px;height:30px;" v-model="queryParam.appName" placeholder="客户名称搜索..."></el-input>
                    <el-button size="small" style="width: 80px;" type="primary" @click="cloudApplication">查询</el-button>
                    <el-button size="small" style="width: 100px;" @click="empty()">清空条件</el-button>
                    <el-button size="small" style="width: 100px;" @click="empty()">高级查询</el-button>
                 </span>
			</span>
		</toolbars>
         <!-- 表格 -->
         <mytable style="background:#fff" :tableConfig="tableConfig" :tableData="tableData" ></mytable>
	</div>
</template>
<script>
	import {
		cloudCompanyList, //获取列表
	} from "./api.js"
	import mytable from "components/zyxCommon/Table.vue" //表格
	export default {
		components: {
			mytable,//表格
		},
		data() {
			return {
				queryParam: {
					isAble: '', //启停标识
				},
				tableConfig:{
					//操作按钮配置
					toolbarConfig: [],
					//表格字段配置 
					colConfig: [{
						field: "alias",
						label: "序号",
						type: "text",
					},
						{ 
						field: "authUrl",
						label: "客户",
						type: "text",
					},
					{
						field: "spaceSize",
						label: "累计订单",
						type: "text",
					},
					{
						field: "releaseUrl",
						label: "未结清订单",
						type: "text",
					},
					{
						field: "version", 
						label: "累计交易额",
						type: "text",
					},
					{
						field: "type", 
						label: "累计结算额",
						type: "text",
					},
					{
						field: "industry", 
						label: "开票总额",
						type: "text",
                    },
                    {
						field: "industry", 
						label: "未开票总额",
						type: "text",
					},
					{
						field: "ewrwe",
						label: "应付总额",
						type: "text",
					}
					],
					isSelection: true, //是否可选
					isPage: true, //是否分页
					currentSelectArr: [], //当前勾选的数据
					align: "center", //文本对齐方式
					pageNum: 1,
					pageSize: 10,
					total: 0,
					isHigh: false,
					isLoading: true, //是否开启loading
					loadShow: false //loading控制
				},
				tableData: []
			
			}
		},
		methods: {	
			empty(){ //清空条件
				this.queryParam={};
			},
			setAttr(data){ //数据处理
				for(let attr in data){
					if((data[attr]==undefined) || data[attr]=="")delete data[attr];
				}
				return data;
			},
			cloudApplication(page){ //获取云应用列表
				let params = {pageSize:this.tableConfig.pageSize,pageNo:this.tableConfig.pageNum,appName: this.queryParam.appName,isAble:this.queryParam.isAble,appType:this.queryParam.appType,industry:this.queryParam.industry}
				params=this.setAttr(params);
				cloudCompanyList({Vue:this,params:params}).then(res=>{  
					this.tableData = res.list;
				})
		    },
		},
		mounted: function () {
			this.cloudApplication(); //云应用列表
		},
		watch: { //监听按钮
			'tableConfig.currentSelectArr': function () {
				if (this.tableConfig.currentSelectArr.length === 0) {
					this.tableConfig.toolbarConfig[1].disabled = true
					this.tableConfig.toolbarConfig[2].disabled = true
				} else {
					this.tableConfig.toolbarConfig[1].disabled = false
					this.tableConfig.toolbarConfig[2].disabled = false
				}
			}
		}
	}
</script>
<style lang="less">
    .el-input--small .el-input__inner {
        margin-top: -2px;
    }
    .market-mgr{
		position: relative;
	}
	.custom-toolbarFs{
		width:60%;
		// border:1px solid red;
		position: absolute;
        top:30px;
        z-index: 999;
	}
</style>