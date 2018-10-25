<template>
<div class="qwAuthDialogBody">
    <el-row>
        <el-col :span="6">
            <div class="treeBox">
                <el-tree
                    :data="config.treeData"
                    node-key="id"
                    :default-expanded-keys="[0,-1,-2]">
                <span class="custom-tree-node" slot-scope="{ node, data }">
                    <el-tooltip class="item" effect="dark" :content="data.label" placement="left"><span class="label">{{data.label}}</span></el-tooltip><el-button type="text" v-if="data.id<-2||(data.id>0)" @click="addData( node, data)" class="treeTextBtn">添加</el-button>
                </span>
                </el-tree>
            </div>
        </el-col>
        <el-col :span="18">
            <div class="rulebox">
                <el-input rows="16" readonly="readonly" type="textarea" v-model="valueDesc" class="ruleInput"></el-input>
            </div>
            
            <div class="rulebox" style="margin-top:20px; display:none;">
                <el-input rows="4" readonly="readonly" type="textarea" v-model="valueReal"></el-input>
            </div>

            <div class="rulebox" style="margin-top:20px; display:none;">
                <p>{{valueArr}}</p>
            </div>
        </el-col>
    </el-row>
    <p class="btnbox">
        <el-button @click="doSave"  type="primary" size="mini">保存</el-button>
        <el-button @click="clearAll" type="danger" size="mini">清空</el-button>
        <el-button @click="cancel" size="mini">取消</el-button>
    </p>
    <!-- 规则配置弹框 -->
    <qwModalForm ref="qwModalForm" v-if="qwModalFormConfig" :config="qwModalFormConfig"></qwModalForm>
</div>    
</template>
<script>
import http from '../../api/base.js'
import {
    logicControls,
    JsonParse,
    formatJson
} from "../../api/common.js"
import {
    permissionLineList,
    permissionLineRuleList,
    structureGet,
    permissionLineAdd,
    permissionLineEdit,
} from "./api.js"
import qwModalForm  from "../../components/qwform/qwMoalForm.vue"
const qwAuthDialogTreeDataDefault = [
    {id:0,label:"所有规则",children:[
        {id:-1,label:"过滤规则",children:[]},
        {id:-2,label:"逻辑规则",children:[
            {id:-3,label:"括号(左括号)",value: "(",valueReal:"("},
            {id:-4,label:"括号(右括号)",value: ")",valueReal:")"},
            {id:-5,label:"且",value: "并且",valueReal:"AND"},
            {id:-6,label:"或",value: "或者",valueReal:"OR"},
            // {id:-7,label:"非",value: "非",valueReal:"!"},
            // ...logicArr
        ]},
    ]}]
 const  qwAuthModalFormConfig = {
            qwDialog:{
                title:"弹出框标题",
                titleStyle:"background:#FFF;",
                dialogVisible:false,
                width:"420px",
                fullscreen:false,
                top:"15vh",
                modal:false,//遮罩
                modalAppendToBody:true,
                appendToBody:false,
                lockScroll:true,
                customClass:"",
                closeOnClickModal:true,
                closeOnPressEscape:true,
                showClose:true,
                center:false,
                beforeClose:()=>{
                    console.log("beforeClose")
                }
            },
            qwForm:{
                labelWidth: 140,
                // itemWidth:200,
                itemSpan:24,
                items:[],
                formData:{},
                formBtnsStyle:"text-align:right",
                formLabelAlign:"right",
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
                        clicked: (data)=>{
                            console.log("done clicked  frombtn 0")
                        }
                    },
                     {
                        size:"small",//medium / small / mini
                        type:"",//primary / success / warning / danger / info / text
                        plain:false,//是否朴素
                        round:false,//是否圆角按钮
                        circle:false,//是否圆形按钮
                        loading:false,//是否加载中状态
                        disabled:false,//是否禁用
                        icon:"",//图标class
                        autofocus:false,//自动获取焦点
                        nativeType:"button",//button / submit / reset
                        label:"取消",
                        class:"",
                        style:"width:100px;text-align:center;",
                        clicked: (data)=>{
                            console.log("done clicked  frombtn 0")
                        }
                    }
                ],
                eventCB:{//回调事件
                    formBtnClicked:(data)=>{
                        let that= data.self.$parent.$parent.$parent.$parent;
                        console.log("formBtnClicked=>",data)
                        switch (data.index) {
                            case 0:
                                {
                                    that.saveQwModalForm(data);
                                }
                                break;
                            case 1:
                                {
                                    that.closeModalForm();
                                }
                                break;
                        
                            default:
                                break;
                        }
                        return false;//return false或者该函数不存在则直接触发emit "formBtnClicked" return true则不向下执行
                    }
                }
            }
        }   
export default {
    components:{
        qwModalForm
    },
    props:{
        config:{
            type: Object,
            default(){
                // let logicArr=[];
                // let i=-8;                
                // for(let item of logicControls){
                //     logicArr.push({id:i,label:item.label,value:item.label,valueReal:item.value})
                //     i--;
                // }
                return {
                    treeData:JsonParse(formatJson(qwAuthDialogTreeDataDefault))
                }
            }
        }
    },
    data(){
        return {
            valueDesc:"",
            valueReal:"",
            valueArr:[],
            model:null,
            version:null,
            scheme:null,
            lineRule:[],
            lastId:0,
            permissionLineData:null,
            qwModalFormConfig:null,
        }
    },
    methods:{
        isEdit(){
            return this.permissionLineData!=null;
        },
        getPermissionLineRule(data){            
            const getFilter= (index)=>{
                return data.self.configFilter[index].items[data.self.configFilter[index].activeIndex];
            }
            let lineData = data.self.configBlock.info.curPermissionLineList;
            this.permissionLineData = lineData? lineData : null;
            if(lineData){
                this.valueDesc=lineData.ruleConfigDesc;
                this.valueReal=JSON.parse(lineData.ruleConfigValue).value;
                this.valueArr=JSON.parse(lineData.ruleConfigValue).valueJSON;
            }
            this.model=getFilter(0);
            this.version=getFilter(1);
            this.scheme=getFilter(2);
            let params={
                modelId:this.model.id,
                versionId:this.version.id,
                schemeId:this.scheme.id
            }
            permissionLineRuleList({Vue:this,params:params}).then(res=>{
                if(res.result){
                    if(res.model && res.model.length>0){
                        let temp=[];
                        for(let item of res.model){
                            item.label=item.displayName;
                            temp.push(item);
                        }
                        this.$set(this.config.treeData[0].children[0],"children",temp);
                    }else{
                        this.$message.error("暂无可用行授权规则！");
                        setTimeout(() => {
                             this.cancel();
                        }, 100);
                    }
                    console.log("permissionLineList=>",res);
                }
            })
        },
        reset(){
            this.permissionLineData = null;
            this.valueDesc="";
            this.valueReal="";
            this.model=null;
            this.version=null;
            this.scheme=null;
            this.lineRule=[];
            this.valueArr=[];
            this.lastId=0;
            this.qwModalFormConfig=null;
            this.$set(this.config,'treeData',JSON.parse(JSON.stringify(qwAuthDialogTreeDataDefault)));
        },
        saveQwModalForm(data){   
            data.self.validate(()=>{
                let ruleData=data.config.formData.ruleData;
                let structureData = data.config.formData.structureData;
                let value= data.config.formData.value;
                let tag = structureData.dataType=="int"||(structureData.dataType=="float")||((typeof(value)=='string') && value.toLowerCase()=="null")?"":"\"";
                if(ruleData.rule!="IN"){
                    this.valueDesc += " ("+ structureData.alias + " " + this.getRuleLabelByValue(ruleData.rule) +" "+ tag + value + tag +")"
                    this.valueReal += " ("+ structureData.alias + " " + ruleData.rule +" "+ tag + value + tag +")"
                }else{
                    this.valueDesc += " ("+ structureData.alias + " " + this.getRuleLabelByValue(ruleData.rule) +" "+ '(' +(value.toString()) +')'+ ")"
                    this.valueReal += " ("+ structureData.alias + " " + ruleData.rule +" "+ '(' +(value.toString()) +')'+")"
                }                
                this.lastId=ruleData.id;
                this.valueArr.push({id:ruleData.id,structure_id:structureData.id,structure_alias: structureData.alias,rule:ruleData.rule,value: value});
                this.closeModalForm();
                // let 
            })      
            
        },
        doSave(){
            let params={
                modelId:this.model.id,
                versionId:this.version.id,
                schemeId:this.scheme.id,
                ruleConfigDesc:this.valueDesc,
                ruleConfigValue:JSON.stringify({valueJSON:this.valueArr,value:this.valueReal})
            }
            let action = permissionLineAdd;
            if(this.isEdit()){
                action= permissionLineEdit;
                params.id=this.permissionLineData.id;
            }
            action({Vue:this,params:params}).then(res=>{
                if(res.result){
                    this.$message.success("操作成功！");
                    this.$emit("saveDone",{self:this});
                }
            })
        },
        cancel(){
            this.$emit("cancel",{self:this})
        },
        getRuleLabelByValue(rule){
            for(let item of logicControls){
                if(item.value==rule){
                    return item.label
                }
            }
            return ""
        },
        buildModalConfig(config,data,model){
           let that=this;
            config.qwDialog.title="过滤_"+ data.displayName;

            let item,formData,title;
            let ruleLbl=this.getRuleLabelByValue(data.rule);
            let multiple = data.rule=="IN"? true : false;
            
            console.log("buildModalConfig=333=>",multiple,...arguments);
            switch (data.control) {
                case "input":
                    {
                        this.$set(config.qwForm,"items",[{   
                                colStyle:"",
                                key:"value",
                                type:"input",
                                name: model.alias +'  '+ (ruleLbl? ruleLbl : data.rule),
                                disabled:false,
                                clearable:true,
                                suffixIcon:"",
                                prefixIcon:"",
                                maxLength:255,
                                minLength:0,
                                width:"100%",
                                rows:1,//textarea适用
                                autoComplete:"off",
                                placeholder:"请输入",
                                readonly:false,
                                rules:[{required:true,message:"该项为必填项",trigger:["input","change","blur"]}],
                        }]);
                        this.$set(config.qwForm,"formData",{value:"",structureData:model,ruleData:data});
                    }
                    break;
                case "select":
                    {
                        let items=[];
                         switch (data.dataSource) {
                            case "2":
                                 {
                                      items[0]={ 
                                        key: "value",
                                        type:"select",
                                        filterable:true,
                                        remote:false,
                                        width:"100%",
                                        dropDown:{
                                            data:[]
                                        },
                                        name: model.alias +'  '+ (ruleLbl? ruleLbl : data.rule),
                                        disabled:false,
                                        rules:[{required:true,message:"请选择规则字段",trigger:["input","change","blur"]}],
                                    }       
                                    let source= JSON.parse(JsonParse(data.dataSourceConfig));
                                    if(source){
                                        for(let item of source){
                                            items[0].dropDown.data.push(item);
                                        }
                                    } 
                                    this.$set(config.qwForm,"formData",{value:[],structureData:model,ruleData:data});    
                                   
                                 }
                                 break;
                            case "3":{
                                 let source= JsonParse(data.dataSourceConfig);
                                 items[0]= {
                                    key: "value",
                                    type:"select",
                                    filterable:true,
                                    width:"100%",
                                    remote:true,
                                    remoteMethod(query){//this.config.items[3]
                                        let conf=this.$attrs.config;
                                        // console.log("conf==>",conf,source);
                                        if(query) {
                                            // conf.dropDown.data=[{label:'下拉1',value:'数据1'},{label:'下拉2',value:'数据2'}]//res.model;
                                            let http_=http;
                                            if(http_[source.method]){
                                                http_[source.method](source.romotePath,{Vue:that,params:source.params},true).then(res=>{
                                                    let temp=[];
                                                    if(res.result==true){
                                                        for(let item of res.model){
                                                            temp.push({...item,label:item[source.key],value:item[source.value]})
                                                        }
                                                        conf.dropDown.data=temp;
                                                    }else{
                                                        this.$message.error(res.message);
                                                    }
                                                })
                                            }else{
                                                that.$message.error("未识别的请求方法!请重新配置过滤规则")
                                                //无需处理
                                            }
                                        }
                                        else conf.dropDown.data=[];
                                        // http.fetchPost('/itemList/getItem3',{params:{query:query}}).then(res=>{
                                        //     this.config.formData['item3'].dropDown.data=[{label:'下拉1',value:'数据1'},{label:'下拉2',value:'数据2'}]//res.model;
                                        // })
                                    },
                                    dropDown:{
                                        data:[],
                                        api:{
                                            method:"post",
                                            action:"/itemlist/get"
                                        }
                                    },
                                    placeholder:"请输入关键字",
                                    name: model.alias +'  '+ (ruleLbl? ruleLbl : data.rule),
                                    disabled:false,
                                    rule:[{required:true,message:"请选择项目2",trigger:["input","change","blur"]}],
                                }
                               
                                
                            }break;
                             default:
                                 break;
                         }     
                         
                        if(multiple){
                            items[0].multiple=true;
                            this.$set(config.qwForm,"formData",{value:[],structureData:model,ruleData:data});
                        }  else {
                            this.$set(config.qwForm,"formData",{value:"",structureData:model,ruleData:data});
                        }  
                        items[0].size="mini";
                        this.$set(config.qwForm,"items",items);
                    }                    
                    break;   
                case "datetime":{
                    let items=[];
                    items[0]={
                        key:"value",
                        name: model.alias +'  '+ (ruleLbl? ruleLbl : data.rule),
                        type: "dateTimePicker",
                        valueFormat: "timestamp",//data.
                    }    
                    this.$set(config.qwForm,"items",items);
                    this.$set(config.qwForm,"formData",{value:"",structureData:model,ruleData:data});
                }break;         
                default:
                    {
                        this.$message.error("暂不支持组件"+data.control);
                    }
                    break;
            }
            // config.qwForm.labelWidth= config.qwForm.items[0].name.length*16+ 60 +'px';
            // config.qwForm.items[0].width = parseInt(config.qwDialog.width) - (config.qwForm.items[0].name.length*16+ 60) +'px';
            return config;
        },
        addData( node, data){
            if(data.id<-2){
                this.valueDesc += " " + data.value;
                this.valueReal += " " + data.valueReal;
                this.valueArr.push({id:data.id,rule:data.value,value: data.valueReal});
                this.lastId=data.id;
            }else if(data.id>0){
                if(this.lastId>0){
                    this.$message.error("相邻过滤规则请以逻辑规则连接！")
                    return;
                }
            
                let params={id:data.structureId}
                structureGet({Vue:this,params:params}).then(res=>{
                    if(res.model){
                        let config=JsonParse(formatJson(qwAuthModalFormConfig));
                        config=this.buildModalConfig(config,data,res.model);
                        this.qwModalFormConfig=config;
                        setTimeout(() => {
                            this.showModalForm();
                        }, 30);
                    }else{
                        this.$message.error("规则绑定的数据结构字段不存在或已被删除！");
                        setTimeout(() => {
                            this.cancel();
                        }, 100);
                    }
                })
            }
        },
        showModalForm(){
            let modal = this.$refs.qwModalForm;
            if(modal){
                modal.showModal();
            }
        },
        closeModalForm(){
            let modal = this.$refs.qwModalForm;
            if(modal){
                modal.resetForm();
                modal.closeModal();
            }
        },
        clearAll(){
            this.valueDesc="";
            this.valueReal="";
            this.valueArr=[];
            this.lastId=0;
        }
    }
}
</script>
<style lang="less">
.qwAuthDialogBody{
 .treeBox{
     margin-left: 20px;
     width: 280px;
     min-height: 348px;
     border: 1px solid #e5e5e5;
     padding:24px;
     box-sizing: border-box;
     .label{
        display: inline-block;
        font-size: 12px;
        line-height: 24px;
        width: 80px;
        overflow: hidden;
     }
     .treeTextBtn{
        //  display: none;
         float: right;
         line-height: auto;
         padding: 0;
         font-size: 12px;
         line-height: 24px;
         padding: 0 10px;
         height: auto;
     }
 }
 .ruleInput{
     width:100%;
     min-height:294px;
     .el-textarea__inner{
         border-radius: 0;
     }
 }
 .rulebox{
     padding: 0 20px;
 }
 .btnbox{
     text-align:center;
     padding-top:38px;
     .el-button{
         border-radius: 0;
         min-width: 100px;
     }
 }
}
</style>

