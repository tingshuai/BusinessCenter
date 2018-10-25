<template>
<div class="ruleDialogBody">
  <modelFilter style="border-bottom:1px solid #E5E5E5;" @changFilterActiveIndex="changFilterActiveIndex" :config="config.configFilter"></modelFilter>
  <div class="toobarBox">
        <blockToolbar @itemClicked="tooBarItemClicked" :config="config.configToolbar"></blockToolbar>
  </div>
  <div class="fromBox">
        <qw-form ref="qwformRule" @formItemChanged="formItemChanged" :config="config.configForm"></qw-form>
  </div>
  <qwModalForm ref="modalFormDataSource" v-if="config.configForm.formData.dataSource=='2'" :config="config.configModalFormDataSource"></qwModalForm>
  <qwModalForm ref="modalFormDataSource" v-if="config.configForm.formData.dataSource=='3'" :config="config.configModalFormDataSource2"></qwModalForm>
</div>
</template>
<script>
import modelFilter from "../common/modelFilter.vue"
import blockToolbar from "../common/blockToolbar.vue"
import qwForm from "../../components/qwform/qwform.vue"
import qwModalForm from "../../components/qwform/qwMoalForm.vue"
import {
    permissionLineRuleList,
    permissionLineRuleAdd,
    permissionLineRuleEdit,
    permissionLineRuleDel,
} from "./api.js"
import {
    ruleControls,
    logicControls,
defaultValue,
} from "../../api/common.js"

import http from '../../api/base.js'
 const isJSON_test=(str) => {
    if (typeof str == 'string') {
        try {
            var obj=JSON.parse(str);
            return true;
        } catch(e) {
            return false;
        }
    }
    }　

export default {
    props:{
        config:{
            type: [Array,Object],
            default(){
                
                let ruleDialogBodyConfigForm = {
                            labelWidth: 80,
                            itemWidth:300,
                            itemSpan:8,
                            items:[
                                {
                                    key: "fieldId",
                                    type:"select",
                                    filterable:true,
                                    remote:false,
                                    dropDown:{
                                        data:[]
                                    },
                                    name:"规则字段",
                                    disabled:false,
                                    rules:[{required:true,message:"请选择规则字段",trigger:["input","change","blur"]}],
                                },
                                {   
                                    colStyle:"",
                                    key:"fieldName",
                                    type:"input",
                                    span:16,
                                    name:"显示名称",
                                    disabled:false,
                                    clearable:true,
                                    suffixIcon:"",
                                    prefixIcon:"",
                                    maxLength:40,
                                    minLength:0,
                                    rows:1,//textarea适用
                                    autoComplete:"off",
                                    readonly:false,
                                    rules:[{required:true,message:"请输入显示名称",trigger:["input","change","blur"]}],
                                },  
                                //  {   
                                //     colStyle:"",
                                //     key:"ruleName",
                                //     type:"input",
                                //     span:8,
                                //     name:"规则名称",
                                //     disabled:false,
                                //     clearable:true,
                                //     suffixIcon:"",
                                //     prefixIcon:"",
                                //     maxLength:40,
                                //     minLength:0,
                                //     rows:1,//textarea适用
                                //     autoComplete:"off",
                                //     readonly:false,
                                //     rules:[{required:true,message:"请输入规则名称",trigger:["input","change","blur"]}],
                                // },  
                                {
                                    key: "rule",
                                    type:"select",
                                    filterable:true,
                                    remote:false,
                                    dropDown:{
                                        data:logicControls,
                                    },
                                    name:"过滤规则",
                                    disabled:false,
                                    rules:[{required:true,message:"请选择过滤规则",trigger:["input","change","blur"]}],
                                },                              
                                {
                                    key: "ruleComponent",
                                    type:"select",
                                    filterable:true,
                                    remote:false,
                                    dropDown:{
                                        data:ruleControls
                                    },
                                    name:"规则控件",
                                    disabled:false,
                                    rules:[{required:true,message:"请选择规则控件",trigger:["input","change","blur"]}],
                                },
                                
                                {
                                    key: "defaultValue",
                                    type:"select",
                                    size:"mini",
                                    filterable:true,
                                    allowCreate:true,
                                    multiple:true,
                                    remote:false,
                                    placeholder:"请输入或者选择默认值",
                                    dropDown:{
                                        data:[]
                                    },
                                    name:"默认值",
                                    disabled:false,
                                    rules:[{required:false,message:"请选择或者输入默认值",trigger:["input","change","blur"]}],
                                },
                                {
                                    key:"dataSource",
                                    type:"radio",
                                    name:"数据源",
                                    width:500,
                                    span:18,
                                    items:[{
                                        label:'无',
                                        value:'1',
                                        disabled:false,
                                    },{
                                        label:'本地数据源',
                                        value:'2',
                                        disabled:false,
                                    },{
                                        label:'远程数据源',
                                        value:'3',
                                        disabled:false,
                                    }],
                                },
                            ],
                            formData:{
                                fieldId:"",
                                fieldName:"",
                                ruleComponent:"",
                                rule:"",
                                // ruleName:"",
                                defaultValue:"",
                                dataSource:"1"
                            },
                            formBtnsStyle:"text-align:left;",
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
                                    label:"数据源配置",
                                    class:"",
                                    style:"width:100px;border-radius:0;margin-left:80px;text-align:center;"
                                }
                            ],
                            eventCB:{//回调事件
                                formBtnClicked:(data)=>{
                                    if(data.index==0){//数据源
                                        if(this.config.configForm.formData.dataSource=="1"){
                                            return;
                                        }
                                        this.$refs.modalFormDataSource.showModal();
                                        setTimeout(() => {
                                            this.$refs.modalFormDataSource.clearValidate();
                                            if(this.isEdit() && (this.config.configForm.formData.dataSourceConfig!="{}")){
                                                if(this.config.configForm.formData.dataSource=="2"){
                                                    this.$set( this.config.configModalFormDataSource.qwForm.formData,"dataSource",JSON.parse("" + this.config.configForm.formData.dataSourceConfig))
                                                }else if(this.config.configForm.formData.dataSource=="3"){
                                                    console.log("设置配置数据!")
                                                    this.$refs.modalFormDataSource.setFormData(JSON.parse("" + this.config.configForm.formData.dataSourceConfig));
                                                }                                               
                                            }else{//将缓存的数据带回来
                                                  if(this.config.configForm.formData.dataSource=="2"){
                                                      if(this.config.configForm.formData.dataSourceConfig!="{}"){
                                                          console.log("test==>",this.config.configForm.formData.dataSourceConfig)
                                                           this.$set( this.config.configModalFormDataSource.qwForm.formData,"dataSource",JSON.parse("" + this.config.configForm.formData.dataSourceConfig))
                                                      }
                                                  }else if(this.config.configForm.formData.dataSource=="3"){
                                                      if(this.config.configForm.formData.dataSourceConfig!="{}")this.$refs.modalFormDataSource.setFormData(JSON.parse("" + this.config.configForm.formData.dataSourceConfig));
                                                  }
                                            }
                                        }, 30);
                                    }
                                    return false;//return false或者该函数不存在则直接触发emit "formBtnClicked" return true则不向下执行
                                }
                            }
                        };
                    return {
                        configFilter:[
                                {
                                    title:"过滤规则",
                                    activeIndex:-1,
                                    filterMod:"all",
                                    show:false,
                                    items:[
                                        // {
                                        //     label:"年度运营数据",
                                        //     disabled:true,
                                        // },
                                    ]
                                }
                            ],
                        configToolbar:{
                            group:{
                                activeIndex:0,
                                items:[
                                    {
                                        title:'全部',
                                    },
                                    {
                                        title:'只显示启用',
                                    },
                                    {
                                        title:'只显示停用',
                                    },
                                ]
                            },
                            rgroup:{
                                activeIndex:0,
                                items:[
                                    {
                                        title:'保存',
                                        type:'primary',
                                        disabled:false,
                                    },
                                    {
                                        title:'取消',
                                        type:'',
                                        disabled:false,
                                    }
                                ]
                            },
                        },
                        configForm:ruleDialogBodyConfigForm,
                        
                        configModalFormDataSource:{
                                qwDialog:{
                                    title:"本地数据源",
                                    titleStyle:"background:#FFF;",
                                    dialogVisible:false,
                                    width:"840px",
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
                                    labelWidth: 0,
                                    itemWidth:300,
                                    itemSpan:24,
                                    items:[
                                        {
                                            key:"dataSource",
                                            type:"textarea",
                                            name:"",
                                            controlWidth:"800px",
                                            span:24,
                                            width:1186,
                                            disabled:false,
                                            clearable:true,
                                            suffixIcon:"",
                                            placeholder:"请输入本地数据源，以json方式输入",
                                            prefixIcon:"",
                                            maxLength:1000,
                                            minLength:0,
                                            rows:20,//textarea适用
                                            autoComplete:"off",
                                            readonly:false,
                                            rules:[{required:true,trigger:["input","change","blur"],validator:(rule,value,callback)=>{
                                                if(""==value){
                                                    return callback(new Error("本地数据源不能为空！"))
                                                }
                                                if(!isJSON_test(value)){
                                                    return callback(new Error("未识别的JSON！"))
                                                }
                                                return callback();
                                            }}]
                                        }
                                    ],
                                    formData:{
                                        dataSource:"",
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
                                        label:"JSON校验",
                                        class:"",
                                        style:"width:100px;text-align:center;",
                                        clicked: (data)=>{
                                            console.log("done clicked  frombtn 0")
                                        }
                                    },
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
                                        switch (data.index) {
                                            case 0://JSON校验
                                                {
                                                    // console.log(this.config.configModalFormDataSource.qwForm.formData.dataSource);
                                                    if(isJSON_test(this.config.configModalFormDataSource.qwForm.formData.dataSource)){
                                                        this.$message.success("校验成功！")
                                                    }else{
                                                        this.$message.error("校验失败！")
                                                    }
                                                }
                                                break;
                                            case 1://保存
                                                {
                                                    data.self.validate(()=>{
                                                        this.$set(this.config.configForm.formData,"dataSourceConfig",JSON.stringify(this.config.configModalFormDataSource.qwForm.formData.dataSource));
                                                        setTimeout(() => {
                                                            this.$message.success("操作成功！")
                                                            data.self.$parent.$parent.$parent.resetForm();
                                                            data.self.$parent.$parent.$parent.closeModal();
                                                        }, 30);
                                                    })
                                                }
                                                break;
                                            case 2://取消
                                                {
                                                    data.self.$parent.$parent.$parent.resetForm();
                                                    data.self.$parent.$parent.$parent.closeModal();
                                                }
                                                break;
                                            
                                            default:
                                                break;
                                        }
                                        return false;//return false或者该函数不存在则直接触发emit "formBtnClicked" return true则不向下执行
                                    }
                                }
                                }
                        },
                        configModalFormDataSource2:{
                                qwDialog:{
                                    title:"远程数据源",
                                    titleStyle:"background:#FFF;",
                                    dialogVisible:false,
                                    width:"1224px",
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
                                    labelWidth: 276,
                                    itemWidth:800,
                                    itemSpan:24,
                                    items:[
                                        {
                                            key:"method",
                                            name:"请求方式",
                                            type:"select",
                                            controlWidth:"200px",
                                            span: 24,
                                            dropDown:{
                                                data:[
                                                    {label:"GET",value:"fetchGet"},
                                                    {label:"POST",value:"fetchPost"},
                                                    {label:"POSTJSON",value:"fetchPostJson"}
                                                ]
                                            }
                                        },
                                        {
                                            key:"romotePath",
                                            name:"远程地址",
                                            type:"input",
                                            width:1200,
                                            controlWidth:"680px",
                                            rules:[{required:true,trigger:["input","change","blur"],validator: (rule, value, callback)=>{
                                                if(""==value){
                                                    return callback(new Error("远程地址不能为空！"))
                                                }else if(!(/^http[s]{0,1}:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+/.test(value))){
                                                    return callback(new Error("远程地址有误！"));
                                                }
                                                return callback();
                                            }}]
                                        },
                                        {
                                            key:"params",
                                            type:"textarea",
                                            name:"参数信息",
                                            span:24,
                                            width:1200,
                                            disabled:false,
                                            clearable:true,
                                            suffixIcon:"",
                                            placeholder:"请输入请求参数，以json方式输入",
                                            prefixIcon:"",
                                            maxLength:1000,
                                            minLength:0,
                                            rows:14,//textarea适用
                                            autoComplete:"off",
                                            readonly:false,
                                            controlWidth:"680px",
                                            rules:[{required:true,trigger:["input","change","blur"],validator: (rule, value, callback)=>{
                                                if(""==value){
                                                    return callback(new Error("请求参数不能为空！"))
                                                }
                                                //this.config.configModalFormDataSource2.qwForm.formData.method=='fetchPostJson' && (
                                                if(!isJSON_test(value)){
                                                    return callback(new Error("未识别的JSON！"))
                                                }                                                
                                                return callback();
                                            }}]
                                        },
                                        {
                                            key:"key",
                                            name:"key字段",
                                            type:"input",
                                            width:800,
                                            controlWidth:"400px",
                                            rules:[{required:true,trigger:["input","change","blur"],validator:(rule,value,callback)=>{
                                                if(""==value){
                                                    return callback(new Error("key字段不能为空！"))
                                                }
                                                if(!/^[a-zA-Z]{1}[a-zA-Z0-9]{0,}$/.test(value)){
                                                    return callback(new Error("key字段必须字母开头的字母和数字组成！"))
                                                }
                                                return callback();
                                            }}]
                                        },
                                        {
                                            key:"value",
                                            name:"value字段",
                                            type:"input",
                                            width:800,
                                            controlWidth:"400px",
                                            rules:[
                                                {
                                                    required:true,
                                                    trigger:["input","change","blur"],
                                                    validator:(rule,value,callback)=>{
                                                        if(""==value){
                                                            return callback(new Error("value字段不能为空！"))
                                                        }
                                                        if(!/^[a-zA-Z]{1}[a-zA-Z0-9]{0,}$/.test(value)){
                                                            return callback(new Error("value字段必须字母开头的字母和数字组成！"))
                                                        }
                                                        return callback();
                                                    }
                                                }
                                            ]
                                        }
                                    ],
                                    formData:{
                                        romotePath:"",
                                        method:"",
                                        dataSource:"",
                                        key:"",
                                        value:""
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
                                        label:"通讯校验",
                                        class:"",
                                        style:"width:100px;text-align:center;",
                                        clicked: (data)=>{
                                            console.log("done clicked  frombtn 0")
                                        }
                                    },
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
                                        let that=this;
                                        if(data.index==0){ console.log("通讯校验！")
                                            data.self.validate(()=>{
                                                // debugger
                                                let http_=http;
                                                let action= http_[that.config.configModalFormDataSource2.qwForm.formData.method];                                                
                                                if('function'==typeof(action)){
                                                    http_[that.config.configModalFormDataSource2.qwForm.formData.method](data.config.formData.romotePath,{params:JSON.parse(data.config.formData.params)},true).then(res=>{
                                                        this.$message.success("校验成功！")
                                                    },(e)=>{
                                                        this.$message.error("校验失败！")
                                                    })
                                                }else{
                                                    this.$message.error("未识别的请求方法！");
                                                    return;
                                                }
                                               
                                            })
                                        } else if(data.index==1){//保存
                                            data.self.validate(()=>{
                                                this.$set(this.config.configForm.formData,"dataSourceConfig",JSON.stringify(this.config.configModalFormDataSource2.qwForm.formData));
                                                setTimeout(() => {
                                                    this.$message.success("操作成功！")
                                                    data.self.$parent.$parent.$parent.resetForm();
                                                    data.self.$parent.$parent.$parent.closeModal();
                                                }, 30);
                                            })
                                        } else if(data.index==2){//取消
                                            data.self.resetForm();
                                            data.self.$parent.$parent.$parent.closeModal();
                                        }
                                        return false;//return false或者该函数不存在则直接触发emit "formBtnClicked" return true则不向下执行
                                    }
                                }
                                }
                        },
                    }
                }
        }
    },
    data(){
        return {
            pageColmns:null,//所有的列授权数据
            curMod:'all',//all on off 列数据过滤规则
            model:null,
            version:null,
            scheme:null,
            dropDown:{
                colmns:[]
            }
        }
    },
    components:{
        modelFilter,
        qwForm,
        blockToolbar,
        qwModalForm
    },
    methods:{
        /*表单数据改变事件接收*/
        formItemChanged(data){
            switch (data.item.key) {
                case "rule":
                    {
                        if(data.self.config.formData.rule!="IN"){
                            data.self.config.formData.ruleComponent="input";
                            data.self.config.formData.defaultValue=[];
                            data.self.config.items[5].multiple=true;
                        }else{
                            data.self.config.formData.defaultValue=[];
                            data.self.config.items[5].multiple=false;
                            data.self.config.formData.ruleComponent="select";
                        }
                    }
                    break;
                case "fieldId":
                    {
                        this.getPermissionLineRuleList()
                        for(let item of data.self.config.items[0].dropDown.data){
                            if(item.value==data.self.config.formData.fieldId){
                                // this.$set(data.self.config.formData,"ruleName","过滤_"+item.label+'_'+item.dataType);
                                this.$set(data.self.config.formData,"fieldName","字段_"+item.label+'_'+item.dataType);
                                this.$set(data.self.config.formData,"ruleComponent","");
                                this.$set(data.self.config.formData,"rule","");
                                this.$set(data.self.config.formData,"defaultValue",[]);
                                this.$set(data.self.config.formData,"dataSource","1");
                                this.$set(data.self.config.formData,"dataSource_","1");
                                this.$set(data.self.config.formData,"dataSourceConfig","{}");
                                this.$set(data.self.config.formData,"dataSourceConfig_","{}");
                                this.$set(this.config.configFilter[0],"activeIndex",-1);            ;
                                setTimeout(() => {
                                    this.$refs.qwformRule.clearValidate();
                                }, 30); 
                                 break;
                            }
                        }
                       
                    }   
                    break   
                case "defaultValue":
                    {
                       if(data.self.config.formData.rule!="IN"){
                           if(""==data.self.config.formData.defaultValue||(undefined==data.self.config.formData.defaultValue)||(null==data.self.config.formData.defaultValue)){
                               return;
                           }else{
                               data.self.config.formData.defaultValue=[data.self.config.formData.defaultValue[data.self.config.formData.defaultValue.length-1]];
                           }
                       } 
                    }break;   
                case "dataSource":
                {        
                            
                    // if(this.isEdit()){
                        if(undefined ==this.config.configForm.formData.dataSourceConfig || (""==this.config.configForm.formData.dataSourceConfig)||(this.config.configForm.formData.dataSourceConfig=="{}"))return;
                        this.$confirm('此操作将删除之前数据源配置, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                        center: true
                        }).then(() => {//确定
                            this.$set( this.config.configForm.formData,"dataSourceConfig","{}")
                           
                        }).catch(() => {//取消
                            setTimeout(() => {
                                this.$set(this.config.configForm.formData,"dataSourceConfig",this.config.configForm.formData.dataSourceConfig_);
                                this.$set(this.config.configForm.formData,"dataSource",this.config.configForm.formData.dataSource_);
                            }, 30);
                        });
                    // }else{//新增模式下

                    // }
                }break;           
                default:
                    break;
            }
            console.log(data);
        },
        /*工具条按钮点击事件接收*/
        tooBarItemClicked(data){            
            if(data.group=="right"){
                if(data.index==0){
                    this.doSave()
                } else if(data.index==1){
                    this.$emit("cancel",{self:this})
                }
            }else if(data.group=="left"){
                const rules=["all","on","off"]
                this.curMod=rules[data.index];
            }
        },  
        /*写入字段下拉源数据*/
        transColumnsToDropDown(){
            let temp=[];
            for(let item of this.pageColmns.treeData[0].children){
                item.value=item.id;
                temp.push(item);
            }
            this.$set(this.config.configForm.items[0].dropDown,'data',temp);
        },   
        /*由外部调用用于获取字段下拉源数据*/
        getPermissionLineRule(data){
            if(!data.self){
                this.$message.error("非法的调用对象，无法获取行授权数据！");                
                return;
            }
            const getFilter= (index)=>{
                return data.self.configFilter[index].items[data.self.configFilter[index].activeIndex];
            }
            this.model=getFilter(0);
            this.version=getFilter(1);
            this.scheme=getFilter(2);
            this.pageColmns=JSON.parse(JSON.stringify(data.self.configBlock.info.curPermissionColumList));
            this.transColumnsToDropDown();
        },
        /*根据字段Id获取已经所属 行授权规则列表*/
        getPermissionLineRuleList(){
            let params={
                modelId:this.model.id,
                versionId:this.version.id,
                structureId:this.config.configForm.formData.fieldId
            }
            permissionLineRuleList({Vue:this,params:params}).then(res=>{
                if(res.result){                    
                    let temp=[];
                    this.$set(this.config.configFilter[0],"activeIndex",-1);
                    if(res.model.length > 0){
                        for(let item of res.model){
                            item.label=item.displayName;
                            temp.push(item);
                        }
                        this.$set(this.config.configFilter[0],"items",temp);
                    }else{
                        this.$set(this.config.configFilter[0],"items",temp);
                    }
                }
            })
        },
        changFilterActiveIndex(data_){          
            if( data_.i == 0 && (data_.j >= 0)){
                let data=JSON.parse(JSON.stringify(this.config.configFilter[data_.i].items[data_.j]));
                data.fieldName=data.label;
                // data.ruleName="";//waiting...
                data.ruleComponent=data.control;
                data.fieldId=data.structureId;
                data.dataSource_=data.dataSource;
                data.dataSourceConfig_=data.dataSourceConfig;
                data.defaultValue = data.defaultValue==""? [] : [];
                this.$set(this.config.configForm,"formData",data);
            }
        },
        /*验证数据源*/
        validateDataSource(){
            switch (this.config.configForm.formData.dataSource) {
                case "1":
                    {
                        this.config.configForm.formData.dataSourceConfig="{}";
                        return true;
                    }
                    break;
                case "2":
                    {
                        if(!isJSON_test(this.config.configForm.formData.dataSourceConfig)){
                            this.$message.error("请重新配置数据源！");
                            return false;
                        }else{
                            return true;
                        }
                    }
                    break;
                case "3":
                    {
                        if(this.config.configForm.formData.dataSourceConfig && (isJSON_test(this.config.configForm.formData.dataSourceConfig))){
                            return true;
                        }else{
                            this.$message.error("请重新配置数据源！");
                            return false;
                        }
                    }
                    break;
                
                default:
                    {
                        this.$message.error("未识别的数据源类型！");
                        return false;
                    }
                    break;
            }
        },
        /*保存表单*/
        doSave(){
            this.$refs.qwformRule.validate(()=>{
                if(!this.validateDataSource()){
                    return;
                }
                let formData=this.config.configForm.formData;
                for(let item of logicControls){
                    if(item.value==formData.rule){
                        formData.ruleName=item.label;
                        break;
                    }
                }
                for(let item of ruleControls){
                    if(item.value==formData.ruleComponent){
                        formData.ruleComponentName=item.label;
                    }
                }
                let params={
                        control: formData.ruleComponent,
                        dataSource: formData.dataSource,
                        dataSourceConfig: formData.dataSourceConfig,
                        displayName: formData.fieldName,
                        rule: formData.rule,
                        modelId: this.model.id,
                        versionId: this.version.id,
                        structureId: formData.fieldId
                    }
                    let action=permissionLineRuleAdd;
                    if(this.isEdit()){
                        params.id = formData.id;
                        action = permissionLineRuleEdit
                    }
                    action({Vue:this,params:params}).then(res=>{
                        if(res.result){
                            this.$message.success("操作成功！")
                            this.getPermissionLineRuleList();
                            this.$set(this.config.configFilter[0],'activeIndex',-1);
                            this.$refs.qwformRule.resetForm();
                        }
                    })
            })  
        },
        /*是否编辑模式*/
        isEdit(){
            return this.config.configFilter[0].activeIndex>=0 && this.config.configFilter[0].items[this.config.configFilter[0].activeIndex]
        },
        reset(){
            this.$refs.qwformRule.resetForm();
            this.$set(this.config.configFilter[0],"items",[]);
            // this.$set(this.config,"configForm",ruleDialogBodyConfigForm)
        }
    }
}
</script>
<style lang="less">
.ruleDialogBody{
    .filterBlock{
        padding: 0 !important;
    }
    .filterBlock .r .el-button.showOrHide{
        border:none;
    }
    .filterBlock .r .el-button.el-button--primary{
        color: #FFF;
    }
    .filterBlock .r .el-button{
        border-color: #409EFF;
        color: #409EFF;
    }
    .toobarBox{
        margin-top: 24px;        
    }
    .fromBox{
        margin-top: 20px;
    }
}
</style>
