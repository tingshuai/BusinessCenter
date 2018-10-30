<!-- 产品组 -->
<template>
<div class="qfPage pageContent">
    <qfTable :table="table" @editRow="editRow" @deleteRow="deleteRow"></qfTable>
</div>
</template>
<script>
import qwForm from "components/qwform/qwform.vue"
import qfTable from "components/qfCommon/table.vue"
import authDialogBody from "./authDialogBody.vue"
import {mapState} from "vuex"
import {
    getUnitList,
} from './api.js';
export default {
    components:{
        qwForm,
        qfTable
    },
    computed:{
        ...mapState({
            sidebarHeight : state=> state.app.sidebarHeight
        })
    },
    data(){
        return {           
            table:{
                tableData:[],
                tableHead:[
                    {"label":"单位组ID","prop":"unitGroupId"},
                    {"label":"单位","prop":"unit"},
                    {"label":"是否基准单位","prop":"isStandard"},
                    {"label":"值域精度","prop":"dataPrecision"},
                    {"label":"换算比","prop":"rate"},
                    {"label":"换算公式","prop":"rateConfig"},
                    {"label":"删除标识","prop":"deleted"},
                    {"label":"企业ID","prop":"companyId"},
                    {"label":"创建时间","prop":"createTime"},
                    {"label":"创建人","prop":"createBy"}
                ],
                tableTitle:"",
                config:{//elementUI---table 的属性项目
                    stripe:true,
                    control:{
                        label:"操作",
                        width:"220"
                    },
                    btns:[
                        {
                            type:"default",
                            eventName:"editRow",
                            text:"编辑",
                            size:"",
                            mode:""
                        },
                        {
                            type:"danger",
                            eventName:"deleteRow",
                            text:"删除",
                            size:"",
                            mode:""
                        },
                        {
                            type:"primary",
                            mode:"switch",
                            eventName:"setEnable",
                            text:"启停",
                            size:"",
                            value:true
                        }
                    ]
                }
            }
        }
    },
    mounted(){
        this.unitList();
    },
    methods:{
        /*关闭前调用*/ 
        unitList(){
            getUnitList({Vue:this}).then(res=>{
                // this.table.tableData = res.list;
                let _title = [];
                this.table.tableData = res.list;
                this.$message.success("操作成功！");
            })
        },
        editRow(index,row){
            debugger;
        },
        deleteRow(index,row){
            debugger;
        },
        setEnable(index,row,item){
            debugger;
        }
    }
}
</script>
<style lang="less">
@import url("~style/pageCommon.less");
.qwCommonPage{

}
</style>


