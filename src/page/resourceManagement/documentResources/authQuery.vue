<template>
<div class="authQuery">
    <!-- 搜索 -->
    <div class="search">   
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
    <mytable style="z-index:1;" :toolbarConfig="table.tableConfig.toolbarConfig" :tableConfig="table.tableConfig" :border="false" :tableData="table.tableData" @pageChange="pageChange" @sizeChange="sizeChange"></mytable>
</div>
</template>
<script>
import {
    permissionRoleListOrg,
    permissionRoleListUser,
    permissionRolePageUserPermission

} from './api.js';
import mytable from "components/tableEx.vue"
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
                    // label:"部门",
                    type: "input",
                    placeholder:"文件后缀搜索...",
                    itemStyle:"width:150px",
                    key:"depart",
                    dropDown:[

                    ]
                },
                {
                    span:6,
                    // label:"姓名",
                    type: "input",
                    filterable: true,
                    placeholder:"文件名搜索...",
                    itemStyle:"width:150px",
                    key:"person",
                    dropDown:[

                    ]
                }
            ],
             table:{
                    tableConfig: {
                        //操作按钮配置
                        toolbarConfig: [
                            {
                                name:'批量上传',
                                type:'primary',
                            },
                            {
                                name:'批量删除',
                                type:'',
                                disabled:true,
                            },
                        ],
                        //表格字段配置
                        colConfig: [
                        {
                        field: "id",
                        label: "选择",
                        type: "text",
                        minWidth:50
                        },
                        {
                        field: "treeNamePath",
                        label: "文件名称",
                        type: "text"
                        },
                        {
                        field: "modelAlias",
                        label: "文件后缀",
                        type: "text"
                        },
                        {
                        field: "versionNo",
                        label: "上传时间",
                        type: "text",
                        transVal(val){
                            return "V"+val+'.0';
                        }
                        },
                        {
                        field: "schemeAlias",
                        label: "上传人",
                        type: "text"
                        },
                        {
                        field: "orgPath",
                        label: "文件大小(KB)",
                        type: "text",
                        transVal(val){
                            return val.replace(",","/");
                        }
                        },
                        {
                        field: "name",
                        label: "操作",
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
    position: relative;
    box-sizing: border-box;
    padding-top: 24px;
    .el-input__inner{
        border-radius: 0;
    }
    .search{
        position: absolute;
        top:30px;
        z-index: 999;
    }
    .el-button{
        width: 88px;
        border-radius: 0;
    }
}
</style>