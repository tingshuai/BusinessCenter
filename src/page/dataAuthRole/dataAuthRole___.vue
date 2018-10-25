<template>
<div class="qwCommonPage">
<!-- 人员信息 -->
<departTree ref="departTree" :config="treeConfig" @nodeLabelClicked="nodeLabelClicked" ></departTree>
<!--  数据仓库信息 -->
<modelTreeFix ref="modelTreeFix" :config="treeConfig" @nodeLabelClicked="nodeLabelClicked" style="margin-left:-368px;" :style="{marginTop:((sidebarHeight) * 0.6)-40 + 'px'}"></modelTreeFix>
<div class="rbox" style="{minHeight:sidebarHeight-136+'px'}">
</div>
<div class="rbox" style="{minHeight:sidebarHeight-136+'px'}">
     <!-- 过滤条件 -->
    <modelFilter ref="modelFilter" @changFilterActiveIndex="changFilterActiveIndex" :config="configFilter"></modelFilter>
    <div class="contentBox" :style="{minHeight: (sidebarHeight-400) + 'px'}" v-if="configFilter[2].items.length>0&& (configFilter[2].items[configFilter[2].activeIndex])">
            <el-row  v-if="configBlock.curMod=='info'">
                <el-col :span="14">
                    <div class="groupItem">
                        <h3 class="gr_title">授权策略</h3>
                        <p class="qwrow">
                            <span class="labelItem">
                                <label class="lbl">策略名称：</label>
                                <span class="val">
                                    <!-- {{configFilter[2].items[configFilter[2].activeIndex].alias}} -->
                                </span>
                            </span>
                        </p>
                        <p class="qwrow">
                            <span class="labelItem">
                                <label class="lbl">默认策略：</label>
                                <span class="val">
                                    <!-- {{configFilter[2].items[configFilter[2].activeIndex].isDefault?'是':'否'}} -->
                                </span>
                            </span>
                        </p>
                        <p class="qwrow">
                            <span class="labelItem">
                                <label class="lbl">启停标识：</label>
                                <span class="val">
                                    <!-- <el-button v-if="configFilter[2].items[configFilter[2].activeIndex].isAble" type="primary" size="mini" :plain="true">已启用</el-button>
                                    <el-button v-else type="danger" size="mini" :plain="true">已停用</el-button> -->
                                </span>
                            </span>
                            <span class="labelItem">
                                <label class="lbl">启停时间：</label>
                                <span class="val">
                                    <!-- {{configFilter[2].items[configFilter[2].activeIndex].modifyTime}} -->
                                </span>
                            </span>
                        </p>
                    </div>
                    <div class="groupItem">
                        <h3 class="gr_title">操作授权</h3>
                        <!-- <p class="actionbox_info" style="padding-left:80px;">
                            <el-checkbox :disabled="true" v-model="configBlock.info.curPermissionActionList.add">新增</el-checkbox>
                            <el-checkbox :disabled="true" v-model="configBlock.info.curPermissionActionList.edit">更新</el-checkbox>
                            <el-checkbox :disabled="true" v-model="configBlock.info.curPermissionActionList.del">删除</el-checkbox>
                            <el-checkbox :disabled="true" v-model="configBlock.info.curPermissionActionList.find">查询</el-checkbox>
                        </p> -->
                    </div>
                    <div class="groupItem">
                        <h3 class="gr_title">行授权</h3>
                        <p style="padding: 0 80px;font-size:14px;color:#333;"> 
                           <!-- {{ configBlock.info.curPermissionLineList?  configBlock.info.curPermissionLineList.ruleConfigDesc : "无"}} -->
                        </p>
                    </div>
                </el-col>
                <el-col :span="10">
                    <div class="groupRbox">
                        <!-- <div class="groupItem info" style="min-height:360px;padding-left:24px;padding-right:24px;">
                            <h3 class="gr_title">列授权</h3>
                            <el-tree
                            v-if="configBlock.info.curPermissionColumList!=null"
                            :data="configBlock.info.curPermissionColumList.treeData"
                            show-checkbox
                            node-key="id"
                            :default-expanded-keys="configBlock.info.curPermissionColumList.defaultExpenedKey"
                            :default-checked-keys="configBlock.info.curPermissionColumList.defaultCheckedKey"
                            :props="{ children: 'children', label: 'label'}">
                            </el-tree>
                            <p v-else>
                                暂无数据结构
                            </p>
                        </div> -->
                    </div>
                    
                </el-col>
            </el-row>
    </div>
</div>
</div>
</template>
<script>
import qwForm from "../../components/qwform/qwform.vue"
import qwModalForm from "../../components/qwform/qwMoalForm.vue"
import {timestampToTime} from "../dataModel/filter.js"
import modelTreeFix from "../common/modelTreeFix.vue"
import departTree from "../common/departTree.vue"
import modelFilter from "../common/modelFilter.vue"
import {mapState} from "vuex"

import {
    warehouseList,
    warehouseGrid,
    warehouseAdd,
    warehouseEdit,
    warehouseAble,
    warehouseDel,
    
    dataModelList,
    dataModelGrid,
    dataModelAdd,
    dataModalAble,
    dataModelEdit,
    dataModelDel,

    versionList,
    versionGrid,
    versionAble,
    versionAdd,
    versionDel,

} from '../dataAuthMehod/api.js';
export default {
    components:{
        // qwTree,
        qwForm,
        qwModalForm,
        modelTreeFix,
        departTree,
        modelFilter
    },
    computed:{
        ...mapState({
            sidebarHeight : state=> state.app.sidebarHeight
        })
    },
    data(){
        return {           
            treeConfig:{
                treeFilter:{
                        status:0,
                        keyWords:""
                    },
                    dropDown:{
                        treeStatus:[
                            {
                                label:"全部",
                                value:0,
                            },                    
                            {
                                label:"已启用",
                                value:1,
                            },
                            {
                                label:"已停用",
                                value:2,
                            }
                        ]
                    },
                    id:0,
                    maxLevel:1,
                    curNode:null,
                    treeData:[
                        {
                        id: 0,
                        isEdit:false,
                        label: '所有仓库',
                        children:[]
                        }
                    ],
                    propsTree: {
                    label: 'label',
                    children: 'children',
                    isLeaf: 'leaf'
                    },
                    filterGroupConfig:{
                        show:true,
                    },
                    // tree dialog
                    treeDialogConfig:{
                        qwForm:{
                                labelWidth: 100,
                                itemWidth:440,
                                itemSpan:24,                        
                                mod:'add',
                                items:[                                
                                    {   
                                        colStyle:"",
                                        key:"pname",
                                        type:"input",
                                        name:"父级名称",
                                        disabled:false,
                                        clearable:true,
                                        suffixIcon:"",
                                        prefixIcon:"",
                                        maxLength:40,
                                        minLength:0,
                                        rows:1,//textarea适用
                                        autoComplete:"off",
                                        readonly:true,
                                        rules:[],
                                    },
                                    {   
                                        colStyle:"",
                                        key:"name",
                                        type:"input",
                                        name:"模型名称",
                                        disabled:false,
                                        clearable:true,
                                        suffixIcon:"",
                                        prefixIcon:"",
                                        maxLength:40,
                                        minLength:0,
                                        rows:1,//textarea适用
                                        autoComplete:"off",
                                        readonly:false,
                                        rules:[{required:true,message:"该项为必填项",trigger:["input","change","blur"]}],
                                    }
                                ],
                                formData:{
                                    pid:-1,
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
                                                        this.$refs["modelTreeFix"].loadTree(this.treeConfig.curNode,this.treeConfig.curNode.data);
                                                        this.$refs["modelTreeFix"].closeTreeModal();
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
                        qwDialog:{
                                title:"新增数据仓库模型",
                                titleStyle:"background:#FFF;",
                                dialogVisible:false,
                                width:"480px",
                                fullscreen:false,
                                top:"15vh",
                                modal:true,//遮罩
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
                            }
                    },
                    treeDialogConfigEdit:{
                        qwForm:{
                                labelWidth: 100,
                                itemWidth:440,
                                itemSpan:24,
                                items:[                                
                                    {   
                                        colStyle:"",
                                        key:"pname",
                                        type:"input",
                                        name:"父级名称",
                                        disabled:false,
                                        clearable:true,
                                        suffixIcon:"",
                                        prefixIcon:"",
                                        maxLength:40,
                                        minLength:0,
                                        rows:1,//textarea适用
                                        autoComplete:"off",
                                        readonly:true,
                                        rules:[],
                                    },                                                            
                                    {   
                                        colStyle:"",
                                        key:"treeIdPath",
                                        type:"input",
                                        name:"ID路径",
                                        disabled:false,
                                        clearable:true,
                                        suffixIcon:"",
                                        prefixIcon:"",
                                        maxLength:40,
                                        minLength:0,
                                        rows:1,//textarea适用
                                        autoComplete:"off",
                                        readonly:true,
                                        rules:[],
                                    },                                              
                                    {   
                                        colStyle:"",
                                        key:"treeNamePath",
                                        type:"input",
                                        name:"仓库名路径",
                                        disabled:false,
                                        clearable:true,
                                        suffixIcon:"",
                                        prefixIcon:"",
                                        maxLength:40,
                                        minLength:0,
                                        rows:1,//textarea适用
                                        autoComplete:"off",
                                        readonly:true,
                                        rules:[],
                                    },
                                    {   
                                        colStyle:"",
                                        key:"name",
                                        type:"input",
                                        name:"模型名称",
                                        disabled:false,
                                        clearable:true,
                                        suffixIcon:"",
                                        prefixIcon:"",
                                        maxLength:40,
                                        minLength:0,
                                        rows:1,//textarea适用
                                        autoComplete:"off",
                                        readonly:false,
                                        rules:[{required:true,message:"该项为必填项",trigger:["input","change","blur"]}],
                                    }
                                ],
                                formData:{
                                    pid:-1,
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
                                        // clicked:(data)=>{
                                        //     console.log("done",data);
                                        // }

                                    }
                                ],
                                eventCB:{//回调事件
                                    formBtnClicked:(data)=>{
                                        if(data.index==0){
                                            data.self.validate(()=>{
                                                console.log('add done') 
                                                let params={
                                                        id:this.treeConfig.curNode.data.id,
                                                        alias:data.config.formData.name,
                                                    }
                                                warehouseEdit({Vue:this,params:params}).then(res=>{
                                                    if(res.result){
                                                        res.model.label=res.model.alias;
                                                        this.treeConfig.curNode.data=res.model;
                                                        this.$refs["modelTreeFix"].closeTreeModal2();
                                                    }
                                                })  
                                            },()=>{
                                                console.log('err done')
                                            })
                                        }
                                        return false;//return false或者该函数不存在则直接触发emit "formBtnClicked" return true则不向下执行
                                    }
                                }
                            },
                        qwDialog:{
                                title:"编辑数据仓库模型",
                                titleStyle:"background:#FFF;",
                                dialogVisible:false,
                                width:"480px",
                                fullscreen:false,
                                top:"15vh",
                                modal:true,//遮罩
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
                            }
                    },
                    treeDialogConfigSee:{
                        qwForm:{
                                labelWidth: 200,
                                itemWidth:440,
                                itemSpan:24,
                                items:[                                
                                    {   
                                        colStyle:"",
                                        key:"ableBy",
                                        type:"labelInfo",
                                        name:"启用人："                             
                                    },                                
                                    {   
                                        colStyle:"",
                                        key:"ableTime",
                                        type:"labelInfo",
                                        transVal(timestamp){
                                            if(/^\d{10}$/.test(timestamp)||(/^\d{13}$/.test(timestamp))){
                                                var date = (timestamp + '').length == 13 ? new Date(timestamp) : new Date(timestamp*13) ;//时间戳为10位需*1000，时间戳为13位的话不需乘1000
                                                var Y = date.getFullYear() + '-';
                                                var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
                                                var D = date.getDate() + ' ';
                                                var h = date.getHours() + ':';
                                                var m = date.getMinutes() + ':';
                                                var s = date.getSeconds();
                                                return Y + M + D + h + m + s;
                                            }else{
                                                return timestamp;
                                            }
                                        
                                        },
                                        name:"启用时间："                             
                                    },                                
                                    {   
                                        colStyle:"",
                                        key:"label",
                                        type:"labelInfo",
                                        name:"仓库名称："                            
                                    },                                
                                    {   
                                        colStyle:"",
                                        key:"isAble",
                                        type:"labelInfo",
                                        transVal(val){
                                            return val==true?'是':'否'
                                        },
                                        name:"是否启用："                             
                                    },                                
                                    {   
                                        colStyle:"",
                                        key:"modifyBy",
                                        type:"labelInfo",
                                        name:"修改数据人员："                           
                                    },                                
                                    {   
                                        colStyle:"",
                                        key:"modifyTime",
                                        type:"labelInfo",
                                        name:"修改数据时间："                          
                                    },
                                ],
                                formData:{
                                ableBy:"",//启用人
                                ableTime:"",//启用时间
                                label:"",//模型名称
                                isAble:"",//是否启用
                                modifyBy:"",//修改人
                                modifyTime:"",//修改时间
                                },
                                formBtnsStyle:"text-align:right",
                                formBtns:[
                                    {
                                        size:"small",//medium / small / mini
                                        type:"danger",//primary / success / warning / danger / info / text
                                        plain:false,//是否朴素
                                        round:false,//是否圆角按钮
                                        circle:false,//是否圆形按钮
                                        loading:false,//是否加载中状态
                                        disabled:false,//是否禁用
                                        icon:"",//图标class
                                        autofocus:false,//自动获取焦点
                                        nativeType:"button",//button / submit / reset
                                        label:"关闭",
                                        class:"",
                                        style:"width:100px;text-align:center;",

                                    }
                                ],
                                eventCB:{//回调事件
                                    formBtnClicked:(data)=>{
                                        console.log("done2",data);
                                        if(data.index==0){
                                            let modal=this.$refs.modelTreeFix.$refs.qwModalFormTreeSee;
                                            if(modal){
                                                modal.closeModal();
                                            }
                                        }
                                        return false;
                                    }
                                }
                            },
                        qwDialog:{
                                title:"查看 - 数据仓库模型",
                                titleStyle:"background:#FFF;",
                                dialogVisible:false,
                                width:"480px",
                                fullscreen:false,
                                top:"15vh",
                                modal:true,//遮罩
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
                            }
                    },
            },
            // tree dialog end
            filterGroupConfig:{
                show:true,
            },
             configFilter:[
                {
                    title:"数据模型",
                    activeIndex:1,
                    filterMod:"all",
                    items:[
                        {
                            label:"年度运营数据",
                            disabled:true,
                        },                        
                        {
                            label:"年度运营数据",
                            disabled:false,
                        },      
                        {
                            label:"年度运营数据",
                            disabled:false,
                        },      
                        {
                            label:"年度运营数据",
                            disabled:false,
                        },      
                        {
                            label:"年度运营数据",
                            disabled:false,
                        },      
                        {
                            label:"年度运营数据",
                            disabled:false,
                        },      
                        {
                            label:"年度运营数据",
                            disabled:false,
                        },      
                        {
                            label:"年度运营数据",
                            disabled:false,
                        },
                    ]
                },
                 {
                    title:"版本号",
                    activeIndex:1,
                    items:[
                        {
                            label:"V1.0",
                            disabled:true,
                        },                        
                        {
                            label:"V2.0",
                            disabled:false,
                        },      
                        {
                            label:"V3.0",
                            disabled:false,
                        },      
                        {
                            label:"V4.0",
                            disabled:false,
                        }
                    ]
                },
                 {
                    title:"授权策略",
                    activeIndex:1,
                    items:[
                        {
                            label:"策略1.0",
                            disabled:true,
                        },                        
                        {
                            label:"策略2.0",
                            disabled:false,
                        }
                    ]
                }
            ],
            configBlock:{
                curMod:'info',
                modInfo:{                
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
                                title:'新增策略',
                                type:'primary'
                            },
                            {
                                title:'编辑',
                                type:''
                            },
                            {
                                title:'删除',
                                type:''
                            },
                            {
                                title:'启停',
                                type:''
                            },
                            {
                                title:'默认策略',
                                type:''
                            }
                        ]
                    },
                    content:{
                        title:"年度运维数据",
                        items:[
                            {   
                                type:'text',
                                label:"模型编码",
                                value:"BM123456789"
                            },
                            {   
                                type:'text',
                                label:"模型名称",
                                value:"年度运营数据模型名称"
                            },
                            {   
                                type:'text',
                                label:"数据授权",
                                value:"授权控制"
                            },
                            {   
                                type:'text',
                                label:"描述",
                                value:"一句话描述年度运营数据报告一句话描述年度运营数据报告据报告"
                            },
                            {   
                                type:'text',
                                label:"创建时间",
                                value:"2018-09-19 12:00:00"
                            },
                            {   
                                type:'text',
                                label:"修改时间",
                                value:"2018-09-19 12:00:00"
                            },
                            {   
                                type:'btns',
                                label:"模型编码",
                                items:[
                                    {
                                        type:'info',
                                        class:'open',
                                        label:"已启用",
                                    },
                                    {
                                        type:'info',
                                        class:'close',
                                        label:"已停用"
                                    }
                                ]
                            },
                            {   
                                type:'text',
                                label:"启停时间",
                                value:"2018-09-19 12:00:00"
                            }
                        ]
                    }
            },
            modEdit:{                
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
                                type:'primary'
                            },
                            {
                                title:'取消',
                                type:''
                            }
                        ]
                    },
                    content:{
                        title:"年度运维数据",
                        formConfig:{      
                                labelWidth: 80,
                                itemWidth:340,
                                itemSpan:24,
                                formLabelAlign:'right',
                                items:[
                                    {   
                                        colStyle:"",
                                        key:"fModelNo",
                                        type:"input",
                                        name:"模型编码",
                                        disabled:false,
                                        clearable:true,
                                        suffixIcon:"",
                                        prefixIcon:"",
                                        maxLength:40,
                                        minLength:0,
                                        rows:1,//textarea适用
                                        autoComplete:"off",
                                        readonly:false,
                                        rules:[{required:true,message:"请输入模型编码",trigger:["input","change","blur"]}],
                                    },
                                    {   
                                        colStyle:"",
                                        key:"fModelNo",
                                        type:"input",
                                        name:"模型名称",
                                        disabled:false,
                                        clearable:true,
                                        suffixIcon:"",
                                        prefixIcon:"",
                                        maxLength:40,
                                        minLength:0,
                                        rows:1,//textarea适用
                                        autoComplete:"off",
                                        readonly:false,
                                        rules:[{required:true,message:"请输入模型名称",trigger:["input","change","blur"]}],
                                    },
                                    {
                                        key:"fModelAuth",
                                        type:"radio",
                                        name:"模型授权",
                                        items:[{
                                            label:'暂无控制',
                                            value:'1',
                                            disabled:false,
                                        },{
                                            label:'权限控制',
                                            value:'2',
                                            disabled:false,
                                        }],
                                    },{
                                        key:"fDesc",
                                        type:"textarea",
                                        name:"描述",
                                        span:24,
                                        width:340,
                                        disabled:false,
                                        clearable:true,
                                        suffixIcon:"",
                                        prefixIcon:"",
                                        maxLength:40,
                                        minLength:0,
                                        rows:3,//textarea适用
                                        autoComplete:"off",
                                        readonly:false,
                                        rule:[{required:true,message:"请输入描述",trigger:["input","change","blur"]}],
                                    },
                                    {
                                        key:'fTimeCreate',
                                        type:'dateTimePicker',
                                        name:"创建时间",
                                        span:24,
                                        width:340,
                                        rule:[{required:true,message:"请选择创建时间",trigger:["input","change","blur"]}],
                                    },
                                    {
                                        key:'fTimeUpdate',
                                        type:'dateTimePicker',
                                        name:"修改时间",
                                        rule:[{required:true,message:"请选择创建时间",trigger:["input","change","blur"]}],
                                    },
                                    {
                                        key:"fModelRunTag",
                                        type:"radio",
                                        name:"启停标识",
                                        items:[{
                                            label:'启用',
                                            value:'1',
                                            disabled:false,
                                        },{
                                            label:'停用',
                                            value:'2',
                                            disabled:false,
                                        }],
                                    },
                                    {
                                        key:'fTimeRunTag',
                                        type:'dateTimePicker',
                                        name:"启停时间",
                                        rule:[{required:true,message:"请选择启停时间",trigger:["input","change","blur"]}],
                                    },
                                   
                                ],
                                formData:{
                                    fModelNo:"",
                                    fModelAuth:"",
                                    fDesc:"",
                                    fTimeCreate:"",
                                    fTimeUpdate:"",
                                    fModelRunTag:"",
                                },
                                formBtns:[],
                                eventCB:[]
                        }
                    }
            }



            }            
        }
    },
    mounted(){
        // this.init();
    },
    methods:{
        nodeLabelClicked(node){
            console.log(node);
        }
    }
}
</script>
<style lang="less">
@import url("../../assets/style/pageCommon.less");
.qwCommonPage{
    .groupItem{
        box-sizing: border-box;
        border: 1px solid #e5e5e5;
        min-height: 100px;
        margin-top: 32px;
        position: relative;        
        padding: 42px 0;
        .gr_title{
            color: #333;
            position: absolute;
            left: 24px;
            font-size: 18px;
            line-height: 18px;
            top: -10px;
            margin: 0;
            padding: 0;
            background: #FFF;
        }
        .qwrow +.qwrow{
            margin-top: 30px;
        }
        .qwrow{
            width: 100%;
            box-sizing: border-box;
            line-height: 32px;
            .labelItem{
                display: inline-block;
                .lbl{
                    display: inline-block;
                    width: 150px;
                    text-align: right;
                    font-size: 14px;
                    color: #666;
                    line-height: 32px;
                }
                .val{
                    font-size: 14px;
                    color: #333;
                    line-height: 32px;
                }
            }
        }
    }
    .actionbox_info .el-checkbox__input.is-disabled+span.el-checkbox__label{
        color: #333;
        cursor: pointer;
    }
    .actionbox_info .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner{
        border-color: #666;
    } .actionbox_info .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner:after{
        border-color: #555;
    }
    .info .el-tree-node__expand-icon.expanded {
        -webkit-transform: rotate(-90deg);
        transform: rotate(-90deg);
    }
    .info .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner{
        background-color: #409EFF;
        border-color: #409EFF;
        color: #FFF;
    }
    .info .el-icon-caret-right{
        color: #409EFF;
    }
    .info .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after{
        border-color: #FFF;
    }
    .groupRbox{
        box-sizing: border-box;
        padding-left: 24px;
    }
    .qwerror{
        margin-left: 10px;
        font-size: 14px;
        position: absolute;
        left: 100%;
        width: 240px;
        top:-4px;
        color: rgb(245, 108, 108);
        line-height: 32px;
    }
}
</style>


