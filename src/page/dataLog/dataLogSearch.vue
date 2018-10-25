<template>
    <div class="infoSearchBox">
        <div class="l">
            <qwForm :config="config"></qwForm>
        </div>
        <div class="r">

        </div>
    </div>
</template>
<script>
import { mapState } from "vuex";
import qwForm from "../../components/qwform/qwForm.vue"
export default {
    components:{
        qwForm
    },
    data(){
        return {
             config:{
                labelWidth: 80,
                itemWidth: 240,
                itemSpan:6,                        
                mod:'add',
                items:[
                    {
                     key: "item5",
                        type:"select",
                        filterable:true,
                        remote:false,
                        dropDown:{
                            data:[{label:"item5 label",value:"item5 value"},{label:"item5 label2",value:"item5 value2"}]
                        },
                        name:"操作类型",
                        disabled:false,
                        rule:[{required:true,message:"请选择项目2",trigger:["input","change","blur"]}],
                    },
                    
                    {
                     key: "item5",
                        type:"select",
                        filterable:true,
                        remote:false,
                        dropDown:{
                            data:[{label:"item5 label",value:"item5 value"},{label:"item5 label2",value:"item5 value2"}]
                        },
                        name:"接入方式",
                        disabled:false,
                        rule:[{required:true,message:"请选择项目2",trigger:["input","change","blur"]}],
                    },
                    {
                     key: "item5",
                        type:"select",
                        filterable:true,
                        remote:false,
                        dropDown:{
                            data:[{label:"item5 label",value:"item5 value"},{label:"item5 label2",value:"item5 value2"}]
                        },
                        name:"操作账户",
                        disabled:false,
                        rule:[{required:true,message:"请选择项目2",trigger:["input","change","blur"]}],
                    },
                    {
                     key: "item5",
                        type:"select",
                        filterable:true,
                        remote:false,
                        dropDown:{
                            data:[{label:"item5 label",value:"item5 value"},{label:"item5 label2",value:"item5 value2"}]
                        },
                        name:"数据仓库",
                        disabled:false,
                        rule:[{required:true,message:"请选择项目2",trigger:["input","change","blur"]}],
                    },   
                    
                    {
                     key: "item5",
                        type:"select",
                        filterable:true,
                        remote:false,
                        dropDown:{
                            data:[{label:"item5 label",value:"item5 value"},{label:"item5 label2",value:"item5 value2"}]
                        },
                        name:"数据模型",
                        disabled:false,
                        rule:[{required:true,message:"请选择项目2",trigger:["input","change","blur"]}],
                    },                     
                    {
                        key: "item5",
                        type:"select",
                        filterable:true,
                        remote:false,
                        dropDown:{
                            data:[{label:"item5 label",value:"item5 value"},{label:"item5 label2",value:"item5 value2"}]
                        },
                        name:"版本号",
                        disabled:false,
                        rule:[{required:true,message:"请选择项目2",trigger:["input","change","blur"]}],
                    },  {
                        type:"dateTimePicker",
                        key:"time",
                        name:"项目11",
                        // start:"8:30",
                        // step:"0:15",
                        // end:"20:30",
                        readonly:false,
                        disabled:false,
                        editable:true,
                        clearable:true,
                        size:"",
                        dateType:'date',                        
                        placeholder:"",
                        startPlaceholder:"",
                        endPlaceholder:"",
                        isRange:false,//是否
                    }
                ],
                formData:{
                    pid:-1,
                    time:"",
                    pname:"",
                    name:"",
                    treeIdPath:'',
                    treeNamePath:'',
                },
                formBtnsStyle:"text-align:right",
                formBtns:[
                    {
                        size:"small",//medium / small / mini
                        type:"primary",//primary / success / warning / danger / info / text
                        plain:false,//是否朴素
                        round:false,//是否圆角按钮
                        circle:false,//是否圆形按钮
                        loading:false,//是否加载中状态
                        disabled:false,//是否禁用
                        icon:"",//图标class
                        autofocus:false,//自动获取焦点
                        nativeType:"button",//button / submit / reset
                        label:"保存",
                        class:"",
                        style:"width:100px;text-align:center;",
                    }
                ],
                eventCB:{//回调事件
                    formBtnClicked:(data)=>{
                        console.log("done2",data);
                        if(data.index==0){
                            data.self.validate(()=>{
                                console.log('add done') 
                                let params={
                                        parentId:data.config.formData.pid,
                                        treeIdPath:data.config.formData.treeIdPath,
                                        alias:data.config.formData.name,  
                                        treeNamePath:data.config.formData.treeNamePath
                                    }
                                warehouseAdd({Vue:this,params:params}).then(res=>{
                                    if(res.result){
                                        this.$refs["modelTree"].loadTree(this.treeConfig.evtNode,this.treeConfig.evtNode.data);
                                        this.$refs["modelTree"].closeTreeModal();
                                    }
                                })  
                            },()=>{
                                console.log('err done')
                            })
                        }
                        return false;
                    }
                }
            },
        }
    },
    computed:{
        ...mapState(["sidebarHeight"])
    },
    methods:{

    }
}
</script>

<style lang="less">
.infoSearchBox{
    background: #FFF;
    .l{
        width: 1080px;
        padding: 20px 0 0 20px
    }
}
</style>

