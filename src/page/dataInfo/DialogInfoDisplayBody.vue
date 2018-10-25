<template>
<div class="DialogInfoQueryBody">
<div class="treebox">
    <modelStructureTree ref="modelStructureTree" @treeCheckedItemsChange="treeCheckedItemsChange"/>
</div>
<div class="r">
    <div class="formsel">
        <h3 class="sel_title">表单预览</h3>
        <!-- {{checkItems}} -->
        <br>
        {{configitems}}
        <!-- {{configView}}
        {{configitems}}   @selectChange="selectChangeTableEdit"-->
        <mytable style="margin-top:24px;" v-if="configView" :tableConfig="configView" :tableData="tableData" :border="false"></mytable>
    </div>
    <div class="formdesign">
         <h3 class="design_title" style="margin-bottom:0;">查询方案 
            <!-- <el-button-group style="margin-left:12px;">
                <el-button @click="changeMod('add')" :type="mod=='add'? 'primary' : ''" size="mini">新增</el-button>
                <el-button @click="changeMod('edit')" :type="mod=='edit'? 'primary': ''" size="mini">编辑</el-button>
            </el-button-group> -->
            <div class="qwformbox_inline" style="display:inline-block; transform:translateY(-8px);">
                <el-form ref="formSheme" :model="formScheme.formData" :inline="true" :label-width="'80px'" style="margin-left:26px;">
                    <!-- 方案名称 -->
                    <el-form-item v-if="mod=='add'" label="" prop="schemeName"  :rules="[{required:true,message:'该项为必填项',trigger:['input','change','blur']}]">
                        <el-input style="formSchemeItem" size="medium" v-model="formScheme.formData.schemeName" placeholder="请输入方案名称"></el-input>
                    </el-form-item>
                    <!-- 方案名称 -->
                    <el-form-item v-else label="" prop="schemeName" :rules="[{required:true,message:'请选择方案名称',trigger:['input','change','blur']}]">
                        <el-select filterable v-model="formScheme.formData.schemeName" @change="chemeChanged" placeholder="请选择方案名称">
                            <el-option v-for="(item,i) in formScheme.dropDown.scheme" :label="item.label" :value="item.value" :key="i"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            
            </h3>
             <h3 class="design_title">排版详情            
            <el-button size="mini" type="" style="border-radius:0;float:right;width:88px;" @click="clearFormDesign"> 清空 </el-button>
            <el-button size="mini" @click="saveDesignForm" type="primary" style="border-radius:0;float:right;margin-right:20px;width:88px;"> 生成预览 </el-button>
        </h3>
        <qwform ref="qwformDesign" @formItemChanged="formItemChanged" :config="formDesignConfig"></qwform>
    </div>
     <p class="btn_bottom_box">
        <el-button size="mini" type="" style="border-radius:0;float:right;width:88px;" @click="close"> 关闭 </el-button>
        <el-button size="mini" type="primary" @click="saveScheme" style="border-radius:0;float:right;margin-right:20px;width:88px;"> 保存排版 </el-button>
    </p>
</div>
<div style="clear:both;"></div>
</div>    
</template>
<script>
import modelStructureTree from "./modelStructureTree.vue"
import qwform from "../../components/qwform/qwform.vue"
import mytable from "../../components/tableEx.vue"
import {
    formatJson,
    JsonParse,
    ruleControls
} from "../../api/common.js"
import{
    displaySchemeList,
    displaySchemeGrid,
    displaySchemeAdd,
    displaySchemeEdit,
    displaySchemeDel,

    displayDesignList,
    displayDesignGrid,
    displayDesignAdd,
    displayDesignEdit,
    displayDesignDel,
    displayDesignGet,
    
} from '../dataAuthMehod/api.js';
export default {
    components:{
        modelStructureTree,
        qwform,
        mytable
    },
    data(){
        return {
            mod:"add",//add | edit
            curDesignId:-1,
            isConfigOK:false,
            checkItems:[],
            configitems:{},//key 为 item_加上id的值
            configView: null,
            tableData: [{},{}],
            model:null,
            version:null,
            scheme:null,
            formScheme:{                           
                labelWidth: 80,
                itemWidth:276,
                itemSpan:8,
                dropDown:{
                    scheme:[],
                },
                formData:{
                    schemeName:"",
                }
            },
            formDesignConfig: {
                        labelWidth: "100px",
                        itemWidth:440,
                        formLabelAlign:"right",
                        itemSpan:12,                        
                        mod:'add',
                        items:[
                            {
                                colStyle:"",
                                key:"field",
                                span:8,
                                name:"字段名",
                                disabled:false,
                                type:"select",
                                controlWidth: "160px",
                                dropDown:{
                                    data:[]
                                },
                                  rules:[{required:true,message:"该项为必填项",trigger:["input","change","blur"]}],
                            },
                            {
                                key:"itemWidthType",
                                type:"radio",
                                name:"数据列宽",
                                span:8,
                                width:260,
                                items:[{
                                    label:'自适应',
                                    value:'0',
                                    disabled:false,
                                },{
                                    label:'定宽',
                                    value:'1',
                                    disabled:false,
                                }],
                                rules:[{required:true,message:"该项为必填项",trigger:["input","change","blur"]}],
                            },
                            {
                                key:'itemWidth',
                                name:'',
                                span:4,
                                width:109,
                                controlWidth:"118px",
                                min:0,
                                max:2000,
                                precision:0,
                                type:"inputNumber",
                                controls:false,
                                rules:[{required:true,message:"该项为必填项",trigger:["input","change","blur"]}],
                            },
                            {
                                key:'order',
                                name:'排序号',
                                span:8,
                                width:260,
                                controlWidth:"160px",
                                min:0,
                                max:2000,
                                precision:0,
                                size:"mini",
                                controlsPosition:"right",
                                type:"inputNumber",
                                controls:true,
                            },
                            {
                                key:"transVal",
                                name:"格式化脚本",
                                type:"textarea",
                                controlWidth:"294px",
                                rows:2
                            }
                        ],
                        formData:{
                            field:"",
                            itemWidthType:"",
                            itemWidth:"",
                            order:"",
                            transVal:"",
                        },
                        formBtnsStyle:"text-align:left;margin-left:100px;",
                        formBtns:[
                            // {
                            //     size:"mini",//medium / small / mini
                            //     type:"primary",//primary / success / warning / danger / info / text
                            //     plain:false,//是否朴素
                            //     round:false,//是否圆角按钮
                            //     circle:false,//是否圆形按钮
                            //     loading:false,//是否加载中状态
                            //     disabled:false,//是否禁用
                            //     icon:"",//图标class
                            //     autofocus:false,//自动获取焦点
                            //     nativeType:"button",//button / submit / reset
                            //     label:"点击预览",

                            //     class:"",
                            //     style:"width:100px;border-radius:0;text-align:center;",
                            //     // clicked:(data)=>{
                            //     //     console.log("done",data);
                            //     // }

                            // }
                        ],
                        eventCB:{//回调事件
                            // formBtnClicked:(data)=>{
                            //     let that =this;
                            //     if(data.index==0){
                            //         data.self.validate(()=>{
                            //             let formData = data.config.formData;
                            //             if(!that.configitems)that.configitems={};
                            //             that.$set(that.configitems,"item_"+ formData.field,formData);
                            //             // alert(JSON.stringify(formData));
                            //             // switch (data.config.formData.mod) {
                            //             //     case "query":
                            //             //         {
                            //             //             let formData = data.config.formData;
                            //             //             let params = {
                            //             //                 id:formData.id,
                            //             //                 alias: formData.alias
                            //             //             }
                            //             //             displaySchemeEdit({Vue:this,params:params}).then(res=>{
                            //             //                 this.$message.success("操作成功！")
                            //             //                 let page = data.self.$parent.$parent.$parent.$parent
                            //             //                 data.self.$parent.$parent.$parent.closeModal();
                            //             //                 page.toolbarItemClick({group:"right",index:this.configToolbar.info.rgroup.activeIndex })
                            //             //             })
                            //             //         }
                            //             //         break;
                                        
                            //             //     default:
                            //             //         break;
                            //             // }
                            //         //    alert(JSON.stringify(data.config));                                       
                            //         },()=>{
                            //             console.log('err done')
                            //         })
                            //     }
                            //     return false;
                            // }
                        }
            },
        }
    },
    methods:{
        init(data={tree:{}}){
            this.model = data.tree.model;
            this.version = data.tree.version;
            this.scheme = data.tree.scheme;
            this.$refs.modelStructureTree.init(data.tree);
            this.changeMod(data.mod);
        },
        changeMod(mod){
            this.mod=mod;
            if(mod=="edit"){
                this.getSchemeList();
               // this.$set(this.formDesignConfig.formData,"itemWidthType",'0');
                // this.$set(this.formDesignConfig.items[2],"disabled" , true);
                // this.$set("")
            }
        },
        getSchemeList(){
            let params ={
                modelId: this.model.id,
                varsionId: this.version.id
            }
            displaySchemeList({Vue:this,params:params}).then(res=>{
                let temp=[];
                if(res.model){
                    for(let item of res.model){
                        temp.push({...item, label: item.alias, value: item.id})
                    }
                }
                this.$set(this.formScheme.dropDown, "scheme", temp);
                if(this.scheme){
                    this.$set(this.formScheme.formData,"schemeName",this.scheme.id);
                    this.chemeChanged(this.scheme.id);
                }
            })
        },
        transConfigToEditData(config){
            if(!config){
                this.configitems ={};
                this.configView = null;
                this.$refs.modelStructureTree.setCheckedKeys([]);
            }else{
                this.configView = config.configView;
                this.configitems = config.configitems;
                this.configEvents = config.configEvents? config.configEvents : {};
                let keys= [];
                for(let attr in config.configitems){
                    let id =parseInt(attr.split("_")[1]);
                    if(id>0)keys.push(id)
                }
                this.$refs.modelStructureTree.setCheckedKeys(keys);
            }
        },
        chemeChanged(data){
            let params ={
                modelId: this.model.id,
                versionId: this.version.id,
                schemeId:data
            }
            displayDesignGet({Vue:this,params:params}).then(res=>{
                // alert("获取表单设计数据！")
                if(res.model){
                    this.curDesignId =res.model.id;
                    if(this.curDesignId){
                        let config = JsonParse(res.model.config);
                        this.transConfigToEditData(config);
                    }else{
                        this.transConfigToEditData(null);
                    }
                }else{
                    this.changeMod("add");
                    this.$message.error("模型不存在或已被删除！")
                }
            })
        },
        formItemChanged(data){
            let val=data.config.formData[data.item.key];
            switch (data.item.key) {
                case "field":{
                    if(this.configitems["item_"+val][attr]){
                        for(let attr in this.formDesignConfig.formData){
                            this.$set(this.formDesignConfig.formData,attr,this.configitems["item_"+val][attr]);
                        }
                    }
                    if(this.formDesignConfig.formData.itemWidthType==""){
                        this.$set(this.formDesignConfig.formData,"itemWidthType",'0');
                        this.$set(this.formDesignConfig.items[2],"disabled" , true);
                    }
                }break;
                case "itemWidthType":
                    {
                        if(val=="0"){
                            this.$set(this.formDesignConfig,"itemWidth","");
                            this.$set(this.formDesignConfig.items[2],"disabled",true);
                        }else{
                            this.$set(this.formDesignConfig.items[2], "disabled", false);
                        }
                    }
                    break;
            
                default:
                    break;
            } 
        },
        buildQueryFormConfig(){
            const defConfig ={
                            //操作按钮配置
                            toolbarConfig: [
                            ],
                            //表格字段配置
                            colConfig: [
                                {
                                field: "id",
                                label: "序号",
                                type: "text"
                                // minWidth:50
                                }
                            ],
                            isBorder: true,
                            size:'medium',
                            isSelection: false, //是否可选
                            isPage: false, //是否分页
                            currentSelectArr: [], //当前勾选的数据
                            align: "center", //文本对齐方式
                            pageNo: 1,
                            pageSize: 20,
                            total: 0,
                            isHigh: false,
                            isLoading: true, //是否开启loading
                            loadShow: false //loading控制
                        }
            let config= JSON.parse(JSON.stringify(defConfig));
            config.colConfig=[];
            let conf=null;
            for(let attr in this.checkItems){
                if(this.configitems["item_"+this.checkItems[attr].id]){
                    conf={
                        field: "id_"+ this.checkItems[attr].id,
                        label: this.checkItems[attr].label,
                        type: "text"
                    };
                    if(this.configitems["item_"+this.checkItems[attr].id].itemWidthType=="1"&&(this.configitems["item_"+this.checkItems[attr].id].itemWidth>0)){
                        conf.width=this.configitems["item_"+this.checkItems[attr].id].itemWidth;
                    }
                    conf.order = this.configitems["item_"+this.checkItems[attr].id].order;
                    config.colConfig.push(conf)
                } else {
                    config.colConfig.push({
                        field: "id_"+ this.checkItems[attr].id,
                        label: this.checkItems[attr].label,
                        type: "text",
                        order:0
                    })
                }
            }
            // 重新排序
            let temp_ = config.colConfig.sort(function(a,b){ return b.order - a.order });
            config.colConfig =temp_;
            this.configView = config;
        },        
        treeCheckedItemsChange(data){
            this.checkItems= JSON.parse(JSON.stringify(data));
            this.$refs.qwformDesign.resetForm();
            this.$set(this.formDesignConfig.items[0].dropDown,'data',JSON.parse(JSON.stringify(data)))
            this.buildQueryFormConfig();
        },
        reset(){
             this.checkItems=[];
            this.configView=null;
            this.configitems=[];
            this.configEvents={};
            this.$set(this.formDesignConfig.items[0].dropDown,'data',[])
            let formSheme = this.$refs.formSheme;            
            if(formSheme){
                formSheme.resetFields();
            }
            let qwformDesign = this.$refs.qwformDesign;
            if(qwformDesign){
                qwformDesign.resetForm();
            }            
            this.changeMod("add");
            // console.log("reset===>1123")
            // this.checkItems=[];
            // this.configView=null;
        },
        saveScheme(){

        },
        close(){

        },  
        clearFormDesign(){
            // this.$refs
        }, 
        saveDesignForm(){
            this.$refs.qwformDesign.validate(()=>{
                this.$set(this.configitems,"item_"+this.formDesignConfig.formData.field, JSON.parse(JSON.stringify(this.formDesignConfig.formData)));
                this.buildQueryFormConfig(true);
                if(this.isConfigOK){
                    setTimeout(() => {
                        this.$refs.qwformDesign.resetForm();
                    }, 0);
                }
                
            })
        },
    }
}
</script>
<style lang="less">
 @import url("../../assets/style/dialogInfoBodyStyle.less");
</style>
