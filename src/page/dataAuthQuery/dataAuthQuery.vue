<template>
<div class="qwCommonPage">
<modelTree ref="modelTree" :config="treeConfig" @delNode="BeforNodeDelete" @nodeLabelClicked="nodeLabelClicked"></modelTree>
<div class="rbox" style="{minHeight:sidebarHeight-136+'px'}">
    <!-- 过滤条件 -->
    <modelFilter ref="modelFilter" @changFilterActiveIndex="changFilterActiveIndex" :config="configFilter"></modelFilter>
    <div class="infoBlock">
        <blockToolbar ref="blockToolbar" :config="configToolbar['info']" @itemClicked="toolbarItemClick"></blockToolbar>
         <div class="contentBox" :style="{minHeight: (sidebarHeight-400) + 'px'}" v-if="configBlock.curMod=='info'">
            <el-row v-if="configFilter[2].items.length>0&& (configFilter[2].items[configFilter[2].activeIndex])">
                <el-col :span="14">
                    <div class="groupItem">
                        <h3 class="gr_title">授权策略</h3>
                        <p class="qwrow">
                            <span class="labelItem">
                                <label class="lbl">策略名称：</label>
                                <span class="val">{{configFilter[2].items[configFilter[2].activeIndex].alias}}</span>
                            </span>
                        </p>
                        <p class="qwrow">
                            <span class="labelItem">
                                <label class="lbl">默认策略：</label>
                                <span class="val">{{configFilter[2].items[configFilter[2].activeIndex].isDefault?'是':'否'}}</span>
                            </span>
                        </p>
                        <p class="qwrow">
                            <span class="labelItem">
                                <label class="lbl">启停标识：</label>
                                <span class="val">
                                    <el-button v-if="configFilter[2].items[configFilter[2].activeIndex].isAble" type="primary" size="mini" :plain="true">已启用</el-button>
                                    <el-button v-else type="danger" size="mini" :plain="true">已停用</el-button>
                                </span>
                            </span>
                            <span class="labelItem">
                                <label class="lbl">启停时间：</label>
                                <span class="val">{{configFilter[2].items[configFilter[2].activeIndex].modifyTime}}</span>
                            </span>
                        </p>
                    </div>
                    <div class="groupItem">
                        <h3 class="gr_title">操作授权</h3>
                        <p class="actionbox_info" style="padding-left:80px;">
                            <el-checkbox :disabled="true" v-model="configBlock.info.curPermissionActionList.add">新增</el-checkbox>
                            <el-checkbox :disabled="true" v-model="configBlock.info.curPermissionActionList.edit">更新</el-checkbox>
                            <el-checkbox :disabled="true" v-model="configBlock.info.curPermissionActionList.del">删除</el-checkbox>
                            <el-checkbox :disabled="true" v-model="configBlock.info.curPermissionActionList.find">查询</el-checkbox>
                        </p>
                    </div>
                    <div class="groupItem">
                        <h3 class="gr_title">行授权</h3>
                        <p style="padding: 0 80px;font-size:14px;color:#333;"> 
                           {{ configBlock.info.curPermissionLineList?  configBlock.info.curPermissionLineList.ruleConfigDesc : "无"}}
                        </p>
                    </div>
                </el-col>
                <el-col :span="10">
                    <div class="groupRbox">
                        <div class="groupItem info" style="min-height:360px;padding-left:24px;padding-right:24px;">
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
                        </div>
                    </div>
                    
                </el-col>
            </el-row>
            <!-- 编辑模式 -->
             <p v-else style="font-size:14px;color:#666;text-align:center;margin-top:100px;">  暂无策略数据  </p>
        </div>
        <div class="contentBox" v-if="configBlock.curMod=='edit'" :style="{minHeight: (sidebarHeight-400) + 'px'}">
            <el-row>
                <authQuery ref="authQuery"></authQuery>
            </el-row>
            
        </div>
    </div>
    <qwModalForm ref="DialogConfigPermissionAdd" :config="DialogConfigPermissionAdd"></qwModalForm>
   
</div>
</div>
</template>
<script>
import qwForm from "../../components/qwform/qwform.vue"
import qwDialog from "../../components/qwform/qwDialog.vue"
import qwModalForm from "../../components/qwform/qwMoalForm.vue"
import {timestampToTime} from "../dataModel/filter.js"
import modelTree from "../common/modelTree.vue"
import modelFilter from "../common/modelFilter.vue"
import blockToolbar from "../common/blockToolbar.vue"
import authQuery from "./authQuery.vue"


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

    permissionSchemeList,
    permissionSchemeGrid,
    permissionSchemeAdd,
    permissionSchemeEdit,
    permissionSchemeAble,
    permissionSchemeDel,

    permissionActionList,
    permissionActionGrid,
    permissionActionAdd,
    permissionActionEdit,
    permissionActionGet,
    permissionActionDel,

    permissionLineList,
    permissionLineGrid,
    permissionLineAdd,
    permissionLineEdit,
    permissionLineGet,
    permissionLineDel,

    permissionColumList,
    permissionColumGrid,
    permissionColumAdd,
    permissionColumEdit,
    permissionColumGet,
    permissionColumDel,
    structureList,

    permissionRoleListOrg,
    permissionRolePageUserPermission

} from '../dataAuthMehod/api.js';
export default {
    components:{
        qwForm,
        qwModalForm,
        modelTree,
        modelFilter,
        blockToolbar,
        qwDialog,
        authQuery
        // ruleDialogBody,
        // authDialogBody
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
                    evtNode:null,
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
                                                        this.treeConfig.evtNode.data=res.model;
                                                        this.$refs["modelTree"].closeTreeModal2();
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
                                            let modal=this.$refs.modelTree.$refs.qwModalFormTreeSee;
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
            /*treeConfig:{
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
                    evtNode:null,
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
                                                        this.treeConfig.evtNode.data=res.model;
                                                        this.$refs["modelTree"].closeTreeModal2();
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
                                            let modal=this.$refs.modelTree.$refs.qwModalFormTreeSee;
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
            },*/
            // tree dialog end
            // filter config
            configFilter:[
                        {
                            title:"数据模型",
                            activeIndex:0,
                            filterMod:"all",
                            show:false,
                            items:[
                                // {
                                //     label:"年度运营数据",
                                //     disabled:true,
                                // }
                            ]
                        },
                        {
                            title:"版本号",
                            activeIndex:0,
                            filterMod:"all",
                            show:false,
                            items:[
                                // {
                                //     label:"V1.0",
                                //     disabled:true,
                                // }
                            ]
                        },
                        {
                            title:"授权策略",
                            activeIndex:0,
                            filterMod:"all",
                            show:false,
                            items:[
                                // {
                                //     label:"策略1.0",
                                //     disabled:true,
                                // }
                            ]
                        }
                    ],
            // filter config end
            
            configToolbar:{
                info:{
                    group:{
                        activeIndex:0,
                        items:[
                            {
                                title:'策略概况',
                            },
                            {
                                title:'授权人员',
                            }
                        ]
                    },
                    rgroup:{
                        activeIndex:0,
                        items:[
                           
                        ]
                    },
                }
            },
            DialogConfigPermissionAdd:{
                qwForm:{
                        labelWidth: 100,
                        itemWidth:440,
                        itemSpan:24,
                        items:[                                
                            {   
                                colStyle:"",
                                key:"modelName",
                                type:"input",
                                name:"数据模型",
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
                                key:"versionNo",
                                type:"input",
                                name:"版本号",
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
                                key:"alias",
                                type:"input",
                                name:"策略名称",
                                disabled:false,
                                clearable:true,
                                suffixIcon:"",
                                prefixIcon:"",
                                maxLength:40,
                                minLength:0,
                                rows:1,//textarea适用
                                autoComplete:"off",
                                readonly:false,
                                rules:[],
                            },                                                                     
                            
                        ],
                        formData:{
                            modelId:-1,
                            modelName:"",
                            versionId:-1,
                            versionNo:"",
                            alias:""
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
                                        let formData=data.config.formData;
                                        let params={
                                                modelId:formData.modelId,
                                                versionId:formData.versionId,
                                                alias:formData.alias,
                                            }
                                        permissionSchemeAdd({Vue:this,params:params}).then(res=>{
                                            if(res.result){
                                                this.nodeLabelClicked(this.treeConfig.curNode);
                                                let modal=this.$refs.DialogConfigPermissionAdd;
                                                modal.resetForm();
                                                modal.closeModal();
                                            }
                                        })    
                                        // warehouseEdit({Vue:this,params:params}).then(res=>{
                                        //     if(res.result){
                                        //         res.model.label=res.model.alias;
                                        //         this.treeConfig.curNode.data=res.model;
                                        //         this.$refs["modelTree"].closeTreeModal2();
                                        //     }
                                        // })  
                                    },()=>{
                                        console.log('err done')
                                    })
                                }
                                return false;//return false或者该函数不存在则直接触发emit "formBtnClicked" return true则不向下执行
                            }
                        }
                    },
                qwDialog:{
                        title:"新增授权策略",
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
            configBlock:{
                curMod:'info',
                info:{
                    curPermissionLineList:null,
                    curPermissionColumList:null,
                    curPermissionActionList:{
                        add:false,
                        edit:false,
                        find:false,
                        del:false
                    }
                },
                edit:{
                    fromDataScheme:{
                        id:-1,
                        label:"",
                        isAble:false,
                    },
                    curPermissionLineList:null,
                    curPermissionColumList:null,
                    curPermissionActionList:{
                        add:false,
                        edit:false,
                        find:false,
                        del:false
                    }
                }
            },
            /*当前行授权*/
            curPermissionActionList:{
                add:false,
                edit:false,
                find:false,
                del:false
            },

           
       
       
       }
    },
    watch:{
        "configBlock.curMod"(new_,old_){
            if(new_=='info'){
                this.$set(this.configToolbar.info.group,"activeIndex",0);
            }else{
                this.$set(this.configToolbar.info.group,"activeIndex",1);
            }
        }
    },
    mounted(){
        // this.init();
    },
    methods:{
        BeforNodeDelete(data){
            if(data.node==this.treeConfig.curNode){
                let id=data.node.parent.data.id;
                if(data.node.parent.data.children.length>1){
                    for(let item of data.node.parent.data.children){
                        if(item.id!=data.nodeData.id){
                            id=item.id;
                            break;
                        }
                    }
                }
                data.node.remove(data.nodeData);
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
                setTimeout(() => {
                    let label=data.self.$refs["qwModelTreeLabel_" + id];
                    if(label)label.click();
                }, 30);
            }else{
                data.node.remove(data.node.data.id);
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
            }
            
        },
        /*tree label 点击事件回调*/
        nodeLabelClicked(node){
            this.getDataModelList(node);
        },
        /*过滤器点击回调*/
        changFilterActiveIndex(data){
            if(data.i==0){//数据模型切换
                if(this.configFilter[data.i].items[data.j]){
                    this.getVersionList(this.configFilter[data.i].items[data.j]);
                }else{
                    this.configFilter[1].items=[];
                    this.configFilter[1].activeIndex=0;
                    
                    this.configFilter[2].items=[];
                    this.configFilter[2].activeIndex=0; 
                    this.setNoData(true);
                }
            }else if(data.i==1){//数据版本切换
                if(this.configFilter[data.i].items[data.j]){
                    this.getPermissionSchemeList(this.configFilter[0].items[this.configFilter[0].activeIndex],this.configFilter[data.i].items[data.j])
                }else{
                    this.configFilter[2].items=[];
                    this.configFilter[2].activeIndex=0; 
                    this.setNoData(true);
                }
            }else if(data.i==2){
                this.configFilter[2].activeIndex=data.j;
                this.setNoData(false);
            }
        },
        /*根据filter返回状态设置全局是否可以获取data*/
        setNoData(noData){
            if(noData){//无数据状态
                this.configBlock.curMod="info";
            }else{
                this.configBlock.curMod="info";
                // 加载策略授权
                this.getPermissionActionList(this.configFilter[2].items[this.configFilter[2].activeIndex]);
                this.getPermissionLineList(this.configFilter[2].items[this.configFilter[2].activeIndex]);
                this.getPermissionColumList(this.configFilter[2].items[this.configFilter[2].activeIndex],true);
            }
            console.log("setNodata",noData)
        },
        /*dataModel数据转换为filter items*/
        transFilterBtnData(data){
            let temp=[];
            for(let item of data){
                item.label=item.alias;
                item.disabled=!item.isAble
                temp.push(item);
            }
            return temp;
        },
        /*根据仓库id获取所有模型*/
        getDataModelList(node){
            let params={ warehouseId: node.data.id}
            dataModelList({Vue:this,params:params}).then(res=>{
                if(res.result){
                    this.configFilter[0].items=this.transFilterBtnData(res.model);
                    this.configFilter[0].activeIndex=0;
                    if(this.configFilter[0].items.length>0){
                        this.changFilterActiveIndex({i:0,j:0});
                    }else{
                        this.configFilter[0].items=[];
                        this.configFilter[0].activeIndex=0;

                        this.configFilter[1].items=[];
                        this.configFilter[1].activeIndex=0;
                        
                        this.configFilter[2].items=[];
                        this.configFilter[2].activeIndex=0;
                        this.setNoData(true);

                    }
                }
            })
        },        
        /*获取版本列表*/
        getVersionList(model){
            let params={modelId:model.id}
            versionList({Vue:this,params:params}).then(res=>{
                if(res.result){
                    if(res.model.length>0){
                        for(let attr in res.model){
                            res.model[attr].disabled=!res.model[attr].isAble;
                            res.model[attr].label="版本 " + res.model[attr].versionNo+".0";
                        }
                        this.configFilter[1].items=res.model;
                        this.configFilter[1].activeIndex=0;
                        this.changFilterActiveIndex({i:1,j:0});
                    }else{
                        this.configFilter[1].activeIndex=0;
                        this.$set(this.configFilter[1],"items",[]);
                        this.configFilter[2].activeIndex=0;
                        this.$set(this.configFilter[2],"items",[]);
                        this.setNoData(true);
                    }
                    
                }
            })
        },
        getPermissionSchemeList(model,version){
            let params={modelId:model.id,versionId:version.id};
            permissionSchemeList({Vue:this,params:params}).then(res=>{
                if(res.result){
                    if(res.model.length>0){
                        for(let attr in res.model){
                            res.model[attr].disabled=!res.model[attr].isAble;
                            res.model[attr].label=res.model[attr].alias;
                            res.model[attr].permissionActionList={"add": false, "del": false, "edit": false, "find": false};
                        }
                        this.configFilter[2].items=res.model;
                        this.configFilter[2].activeIndex=0;
                        this.setNoData(false);
                    }else{
                        this.configFilter[2].activeIndex=0;
                        this.configFilter[2].items=[];
                        this.setNoData(true);
                    }
                }
            })
        },
        toolbarItemClick(data){
                if(data.group=="left"){
                    switch (data.index) {
                        case 0://策略概况
                            {
                                this.configBlock.curMod="info"
                                // alert("策略概况")
                            }                            
                            break;
                        case 1://授权人员
                            {
                                // alert("授权人员")
                                this.configBlock.curMod="edit"
                                setTimeout(() => {
                                     this.$refs.authQuery.init();
                                }, 30);
                            }                            
                            break;
                    
                        default:
                            break;
                    }
                }
        },        
        /*获取操作授权*/
        getPermissionActionList(permissionScheme){
            if(!permissionScheme)return;
            let model=this.configFilter[0].items[this.configFilter[0].activeIndex];
            let version=this.configFilter[1].items[this.configFilter[1].activeIndex];
            let scheme=this.configFilter[2].items[this.configFilter[2].activeIndex];
            let params={
                modelId:model.id,
                versionId:version.id,
                schemeId: scheme.id
            }
            permissionActionList({vue:this,params:params}).then(res=>{
                if(res.result){
                    let actions={"add": false, "del": false, "edit": false, "find": false};
                    if(res.model.length>0){
                        actions = JSON.parse(res.model[0].permissionActions);
                        for(let attr in actions){
                            actions[attr]=actions[attr]==1? true:false;
                        }
                        this.configFilter[2].items[this.configFilter[2].activeIndex].hasPermissionActionList=true;
                        this.configFilter[2].items[this.configFilter[2].activeIndex].permissionActionListId=res.model[0].id;
                        this.$set(this.configFilter[2].items[this.configFilter[2].activeIndex],"permissionActionList",actions);
                        this.configBlock.info.curPermissionActionList=JSON.parse(JSON.stringify(actions));
                    }else{
                        this.configFilter[2].items[this.configFilter[2].activeIndex].hasPermissionActionList=false;
                        this.$set(this.configFilter[2].items[this.configFilter[2].activeIndex],"permissionActionList",actions);
                        this.configBlock.info.curPermissionActionList=JSON.parse(JSON.stringify(actions));
                    }
                    
                }
            })
        },
        getPermissionLineList(schemes){
            if(!schemes)return;
            let model=this.configFilter[0].items[this.configFilter[0].activeIndex];
            let version=this.configFilter[1].items[this.configFilter[1].activeIndex];
            let scheme=this.configFilter[2].items[this.configFilter[2].activeIndex];
            let params={
                modelId:model.id,
                versionId:version.id,
                schemeId: scheme.id
            }
            permissionLineList({Vue:this,params:params}).then(res=>{
                if(res.result){
                    if(res.model.length>0){
                        this.configBlock.info.curPermissionLineList=res.model[0];
                    }else{
                         this.configBlock.info.curPermissionLineList=null;
                    }
                }
            })
        },
        getPermissionColumList(schemes,disabled=true){
            if(!schemes)return;
            let model=this.configFilter[0].items[this.configFilter[0].activeIndex];
            let version=this.configFilter[1].items[this.configFilter[1].activeIndex];
            let scheme=this.configFilter[2].items[this.configFilter[2].activeIndex];
            let params={
                modelId:model.id
            }
            structureList({Vue:this,params:params}).then(result=>{//先获取数据结构
                if(result.result){
                    if(result.model.length==0){
                        this.configBlock.info.curPermissionColumList=null;
                        return;
                    }else{
                        params={
                            modelId:model.id,
                            versionId:version.id,
                            schemeId: scheme.id
                        }
                        permissionColumList({Vue:this,params:params}).then(res=>{
                            if(res.result){
                                if(res.model.length>0){
                                    let colList=(res.model[0].permissionColumns)? JSON.parse(res.model[0].permissionColumns) :{};
                                    let defaultCheckedKey=[];
                                    for(let attr in result.model){
                                        result.model[attr].label=result.model[attr].alias;
                                        result.model[attr].disabled=disabled;
                                        for(let attr_ in colList){
                                            if(colList[attr_] && (attr_=="id_" + result.model[attr].id)){
                                            // if(colList[attr_] && (attr_==result.model[attr].alias)){
                                                defaultCheckedKey.push(result.model[attr].id);
                                            }
                                        }
                                    }
                                    this.configFilter[2].items[this.configFilter[2].activeIndex].hasPermissionColumList=true;
                                    this.configFilter[2].items[this.configFilter[2].activeIndex].permissionColumListId=res.model[0].id;
                                    this.$set(this.configBlock.info,"curPermissionColumList",{defaultCheckedKey:defaultCheckedKey,defaultExpenedKey:[0],treeData:[{id: 0, disabled:disabled, id_:model.id,label:model.label,children:result.model}]});
                                
                                }else{
                                    let defaultCheckedKey=[];
                                    for(let attr in result.model){
                                        result.model[attr].label=result.model[attr].alias;
                                        result.model[attr].disabled=disabled;
                                    }
                                    this.configFilter[2].items[this.configFilter[2].activeIndex].hasPermissionColumList=false;
                                    this.$set(this.configBlock.info,"curPermissionColumList",{defaultCheckedKey:defaultCheckedKey,defaultExpenedKey:[0],treeData:[{id: 0, disabled:disabled, id_:model.id,label:model.label,children:result.model}]});
                                }
                            }
                        })
                    }
                }
            })
            
        },
        
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


