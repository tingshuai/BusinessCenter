<!-- 产品组 -->
<template>
<div class="qfPage pageContent">
    <classified-search :config="classifiedConfig" @selected="selectedItem" />
    <toolbars>
        <el-row slot="left">
            <el-button @click="toggleAct('all')" size="mini" :type="act == 'all' ? 'primary' : 'default'">全部</el-button>
            <el-button @click="toggleAct('vEnable')" size="mini" :type="act == 'vEnable' ? 'primary' : 'default'">只显示启用</el-button>
            <el-button @click="toggleAct('vUnable')" size="mini" :type="act == 'vUnable' ? 'primary' : 'default'">只显示停用</el-button>
        </el-row>
        <el-row slot="right">
            <el-button @click="toggleAct('add')" size="mini" :type="act == 'add' ? 'primary' : 'default'">新增</el-button>
            <el-button @click="toggleAct('edit')" size="mini" :type="act == 'edit' ? 'primary' : 'default'">编辑</el-button>
            <el-button @click="toggleAct('delete')" size="mini" :type="act == 'delete' ? 'primary' : 'default'">删除</el-button>
            <el-button @click="toggleAct('unable')" size="mini" :type="act == 'unable' ? 'primary' : 'default'">停用</el-button>
        </el-row>        
    </toolbars>
    <qfTable :table="table" @editRow="editRow" @deleteRow="deleteRow"></qfTable>
    <form-page
        :config="dialogConfig"
    ></form-page>
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
        qfTable,
    },
    computed:{
        ...mapState({
            sidebarHeight : state=> state.app.sidebarHeight
        })
    },
    data(){
        return {
            act:"all",//选中的项目
            dialogConfig:{
                colum:"alone",//表单的列数.....
                showDialog:true,
                functional:"",//弹出框的函数名
                dialogProps:{//传入的参数

                }
            },
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
                },
            },
			classifiedConfig: [{
				title: '市场名称:',
				options: []
			}, {
				title: '市场分类:',
				options: []
			}, {
				title: '产品分类:',
				options: []
			}, {
				title: '单位组:',
				options: []
            }]
        }
    },
    mounted(){
        this.unitList();
    },
    methods:{
        /*关闭前调用*/ 
        unitList(){
            getUnitList({Vue:this}).then(res=>{
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
        },
		selectedItem(item,curItem,curRow){
			
        },
        toggleAct(item){//点击button 切换act
            this.act = item;
            switch(item){
                case 'all':{

                }
                case 'vEnable':{

                }
                case 'vUnable':{

                }
                case 'add':{
                    this.dialogConfig.showDialog = true;
                }
                case 'edit':{

                }
                case 'unable':{

                }
            }
        }
    }
}
</script>
<style lang="less">
@import url("~style/pageCommon.less");
.qwCommonPage{

}
</style>


