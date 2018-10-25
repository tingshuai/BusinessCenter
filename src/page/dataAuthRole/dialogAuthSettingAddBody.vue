<template>
<div class="dialogAuthSettingBody">
    <div class="qwcontentBox" style="margin-top:0;">
    <div class="l">
      <modelTreeFix  :styles="modelTreeStyles"></modelTreeFix>
    </div>
    <div class="r">
        <div class="settingbox">
            <div class="rToobar">
                <el-button-group>
                    <el-button @click="changeToolbarActive(0)"  size="mini"  :type="rToobarActiveIndex==0? 'primary':''">全部</el-button>
                    <el-button @click="changeToolbarActive(1)"  size="mini" :type="rToobarActiveIndex==1? 'primary':''">只显示启用</el-button>
                    <el-button @click="changeToolbarActive(2)"  size="mini" :type="rToobarActiveIndex==2? 'primary':''">只显示停用</el-button>
                </el-button-group>
                <el-autocomplete
                    v-model="keywordsModel"
                    size="mini"
                    :fetch-suggestions="querySearchModel"
                    placeholder="请输入内容"
                    suffix-icon="el-icon-search"
                    @select="keywordsModelSelected"
                ></el-autocomplete>
                <div class="toobarR">
                    <el-button size="mini" type="primary">添加授权</el-button>
                    <el-button size="mini">取消</el-button>
                </div>
            </div>
   
            <!-- 表格 -->
             <!-- 表格 @sizeChange="sizeChange" @pageChange="pageChange" @add="add"  @remove="remove" @edit="edit" @buttonFunction="buttonFunction"-->
                <mytable style="margin-top:24px;" :tableConfig="table.tableConfig" :border="false" :tableData="table.tableData"></mytable>
        </div>
    </div>
    </div>    
</div>    
</template>
<script>
import modelTreeFix from "../common/modeltreeFix.vue";
import mytable from "../../components/tableEx.vue";
export default {
    components:{
        modelTreeFix,
        mytable
    },
    data(){
        return {
            keywordsModel:"",
            rToobarActiveIndex:0,
            modelTreeStyles:{
                showTreeMenu:false,
                boxStyle:"width:248px;height:auto;",
                boxClass:"",
                showSlect:false,
                treeBox:"width:auto;height:570px;",
                lTree:"height: auto;",
                treeFormStyle:"padding-left:0;",
            },
            table:{
                tableConfig: {
                    //操作按钮配置
                    toolbarConfig: [
                    ],
                    //表格字段配置
                    colConfig: [
                    {
                    field: "path",
                    label: "仓库路径",
                    type: "text",
                    minWidth:200
                    },
                    {
                    field: "formatInfo",
                    label: "数据模型",
                    type: "text"
                    },
                    {
                    field: "isAble",
                    label: "启停标识",
                    size:"mini",
                    type: "buttonAble"
                    },
                    {
                    field: "formatInfo",
                    label: "启停时间",
                    type: "text"
                    }
                    ],
                    isBorder: true,
                    size:'medium',
                    isSelection: true, //是否可选
                    isPage: false, //是否分页
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
        querySearchModel(queryString, cb){
            let data=[
            { "value": "三全鲜食（北新泾店）", "address": "长宁区新渔路144号" },
            { "value": "Hot honey 首尔炸鸡（仙霞路）", "address": "上海市长宁区淞虹路661号" },
            { "value": "新旺角茶餐厅", "address": "上海市普陀区真北路988号创邑金沙谷6号楼113" },
            { "value": "泷千家(天山西路店)", "address": "天山西路438号" }]
            setTimeout(() => {
                cb(data)
            }, 100);
        },
        keywordsModelSelected(item) {
            console.log(item);
        },
        changeToolbarActive(index){
            this.rToobarActiveIndex=index;
        }
    }
}
</script>
<style lang="less">
@import url("../../assets/style/dialogAuthSettingBody.less");
.dialogAuthSettingBody{
    .rToobar{
        border-bottom: 1px solid @borderColor;
        padding:12px 0 24px;
    }
    .rToobar .toobarR{
        float: right;
        width: 220px;
    }
    .rToobar .el-button{
        width: 88px;
        
    }
    .rToobar .el-input{
        margin-left: 16px;
        transform: translateY(-1px);
    }
}
</style>
