<template>
<div class="authQuery">
    <!-- 搜索 -->
    <div>   
         <el-form  :inline="true" v-model="formSearch" label-width="80px">
            <el-form-item v-for="(item, i) in formSearchConfig" :key="i" :label="item.label" :prop="item.key" :style="item.formItemStyle? item.formItemStyle : ''">
                <el-input v-if="item.type=='input'" v-model="formSearch[item.key]" size="mini" :placeholder="item.placeholder?item.placeholder:'请输入'+item.label"></el-input>
                <el-select v-if="item.type=='select'" :filterable="item.filterable" @focus="formItemFocus(item,i)" @change="formItemChange(item,i)" v-model="formSearch[item.key]" size="mini" :placeholder="item.placeholder?item.placeholder:'请选择'+item.label">
                    <el-option v-for="(lbl,j) in item.dropDown" :label="lbl.label" :key="j" :value="lbl.value"></el-option>
                </el-select>
            </el-form-item>
            <div class="el-form-item" style="padding-top:8px;">
                <el-button type="primary" size="mini" @click="getOrgPersonPermission">查询</el-button>       
                <el-button size="mini" @click="resetAndSearch">清空</el-button> 
            </div>      
    </el-form>
    </div>
    <!-- 表格 -->
    <mytable style="margin-top:24px;" :tableConfig="table.tableConfig" :border="false" :tableData="table.tableData" @pageChange="pageChange" @sizeChange="sizeChange"></mytable>
</div>
</template>
<script>
import {
    permissionRoleListOrg,
    permissionRoleListUser,
    permissionRolePageUserPermission

} from '../dataAuthMehod/api.js';
import mytable from "../../components/tableEx.vue"
export default {
    components:{
        mytable
    },
    data(){
        return {
            formSearch:{
                depart:"",
                person:"",
            },
            formSearchConfig:[
                {
                    span:6,
                    label:"部门",
                    type: "select",
                    placeholder:"请选择部门",
                    itemStyle:"width:160px",
                    key:"depart",
                    dropDown:[

                    ]
                },
                {
                    span:6,
                    label:"姓名",
                    type: "select",
                    filterable: true,
                    placeholder:"请输入关键字并选取人员",
                    itemStyle:"width:160px",
                    key:"person",
                    dropDown:[

                    ]
                }
            ],
             table:{
                    tableConfig: {
                        //操作按钮配置
                        toolbarConfig: [
                        ],
                        //表格字段配置
                        colConfig: [
                        {
                        field: "id",
                        label: "序号",
                        type: "text",
                        minWidth:50
                        },
                        {
                        field: "treeNamePath",
                        label: "仓库路径",
                        type: "text"
                        },
                        {
                        field: "modelAlias",
                        label: "数据模型",
                        type: "text"
                        },
                        {
                        field: "versionNo",
                        label: "版本号",
                        type: "text",
                        transVal(val){
                            return "V"+val+'.0';
                        }
                        },
                        {
                        field: "schemeAlias",
                        label: "授权策略",
                        type: "text"
                        },
                        {
                        field: "orgPath",
                        label: "部门路径",
                        type: "text",
                        transVal(val){
                            return val.replace(",","/");
                        }
                        },
                        {
                        field: "name",
                        label: "姓名",
                        type: "text"
                        }
                        ],
                        isBorder: true,
                        size:'medium',
                        isSelection: false, //是否可选
                        isPage: true, //是否分页
                        currentSelectArr: [], //当前勾选的数据
                        align: "center", //文本对齐方式
                        pageNo: 1,
                        pageSize: 20,
                        total: 0,
                        isHigh: false,
                        isLoading: true, //是否开启loading
                        loadShow: false //loading控制
                    },
                    tableData: [],
                },
        }
    },
    methods:{
        init(){
            this.formSearch={ depart:"", person:"" }
            this.$set(this.table,"tableData",[]);
            this.$set(this.table.tableConfig,"pageNo",1);
            this.getOrgList()
            this.getOrgPersonPermission();
        },
        getOrgList(){
            permissionRoleListOrg({Vue:this,params:{}}).then(res=>{
                let temp=[];
                if(res.model){
                    for(let item of res.model){
                        temp.push({...item,label:item.orgName,value:item.id})
                    }
                    this.$set(this.formSearchConfig[0],"dropDown",temp);
                }
            })
        },
        formItemFocus(item,i){
            switch (i) {
                case 1:
                    {
                        if(item.dropDown.length==0){
                            if(this.formSearch[this.formSearchConfig[0].key]==""){
                                this.$message.error("请先选择部门");
                            }else{                                
                                this.$message.error("该部门下未绑定人员!");
                            }
                        }
                    }
                    break;
            
                default:
                    break;
            }
        },
        formItemChange(item,i){
            switch (i) {
                case 0:
                    {
                        setTimeout(() => {
                            this.getOrgPerson(this.formSearch[item.key]);
                        }, 30);
                    }
                    break;
                case 1:
                    {
                        setTimeout(() => {
                            this.getOrgPersonPermission();
                        }, 30);
                    }   
                break;         
                default:
                    break;
            }
        },
        getOrgPerson(orgId){
            if(null==orgId || (orgId== undefined) || (orgId<1)){
                console.log("非法的部门ID！")
                this.$set(this.formSearchConfig,"dropDown",[]);
            }else{
                let params ={orgId:orgId}
                permissionRoleListUser({Vue:this,params:params}).then(res=>{
                    let temp=[];
                    if(res.model){
                        for (let item of res.model){
                            temp.push({...item,label:item.name,value:item.id})
                        }
                    }
                    this.$set(this.formSearchConfig[1],"dropDown",temp);
                    if(temp.length>0){
                        setTimeout(() => {
                            this.$set(this.formSearch,"person",temp[0].value);
                            this.getOrgPersonPermission();
                        }, 30);
                    }else{
                        this.$set(this.table,"tableData",[]);
                    }
                })
             
            }
        },
        setAttr(data){
            for(let attr in data){
                if((data[attr]==undefined) || data[attr]=="")delete data[attr];
            }
            return data;
        },
        resetSearch(){
            for(let attr in this.formSearch){
                this.$set(this.formSearch,attr,"");
            }
        },
        resetAndSearch(){
            this.resetSearch();
            this.getOrgPersonPermission();
        },
        getOrgPersonPermission(){
            let params = {pageSize:this.table.tableConfig.pageSize,pageNo:this.table.tableConfig.pageNo,orgId: this.formSearch.orgId, userId: this.formSearch.person }
            params=this.setAttr(params);
            permissionRolePageUserPermission({Vue:this,params:params}).then(res=>{
                let temp=[];
                if(res.model && res.model.items){
                    this.$set(this.table.tableConfig,"total",res.model.numRows)
                    this.$set(this.table.tableConfig,"loadShow",false);
                    this.$set(this.table,"tableData",res.model.items);
                }
            })
        },
        pageChange(){
            this.getOrgPersonPermission();
        },
        sizeChange(){
            this.getOrgPersonPermission();
        }
    }
}
</script>
<style lang="less">
.authQuery{
    box-sizing: border-box;
    padding-top: 24px;
    .el-form-item{
        margin-right: 40px;
    }
    .el-input__inner{
        border-radius: 0;
    }
    .el-button{
        width: 88px;
        border-radius: 0;
    }
}
</style>
