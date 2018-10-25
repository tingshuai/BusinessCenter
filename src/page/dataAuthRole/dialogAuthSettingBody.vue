<template>
<div class="dialogAuthSettingBody">
    <div class="qwdialogToolbar">
        <el-autocomplete
            v-model="keywordsModel"
            size="mini"
            :fetch-suggestions="querySearchModel"
            placeholder="请输入数据模型关键字"
            suffix-icon="el-icon-search"
            @select="keywordsModelSelected"
        >
            <template slot-scope="{ item }">
              <span>{{item.wareHouseAlias +'/' + item.value}}</span>
            </template>
        </el-autocomplete>
        <span class="r">
            <!-- <el-button size="mini" type="primary" @click="saveAll">批量保存</el-button> -->
            <!-- <el-button size="mini" @click="addAuth">添加授权</el-button> -->
            <el-button @click="close" size="mini">取消</el-button>
        </span>
    </div>
    <div class="qwcontentBox">
    <div class="l">
      <modelTreeFix :styles="modelTreeStyles" @nodeLabelClicked="nodeLabelClicked" ></modelTreeFix>
    </div>
    <div class="r">
        <div class="settingbox">
            <!-- {{dataList}} -->
           <div>
                <div class="authItemBox">
                    <h3 class="_title" style="margin-bottom:20px;">{{nodePath}}</h3>
                    <div  v-if="dataList" v-for="(item,i) in dataList" :key="i">
                        <el-row class="authLine">
                            <el-col :span="5">
                              <span class="authIsOpen">开启授权 <el-switch v-model="item.hasAuth" @change="setHasAuth(item)"></el-switch></span> 
                            </el-col>
                            <el-col :span="5">
                                <el-button class="model" size="mini">{{item.modelName}}</el-button>
                            </el-col>
                            <el-col :span="6">
                                <el-button size="mini" style="width:120px;text-align:left;">版本 V{{item.versionNo}}.0</el-button>
                            </el-col>
                            <el-col :span="8">
                                    <el-button size="mini" style="width:200px;text-align:left;">{{item.alias}}</el-button>
                            </el-col>
                           
                        </el-row>
                    </div>
                    <p v-if="!dataList" style="text-align:left;margin:35px 0 0 0;"><span>暂无可用数据</span></p>
                </div>
            </div> 
        </div>
    </div>
    </div>  
      <!-- 添加授权 -->
      <qwDialog :config="dialogAuthSettingAdd">
          <dialogAuthSettingAddBody></dialogAuthSettingAddBody>
      </qwDialog>
</div>    
</template>
<script>
import modelTreeFix from "../common/modeltreeFix.vue";
import dialogAuthSettingAddBody from "./dialogAuthSettingAddBody.vue"
import qwDialog from "../../components/qwform/qwDialog.vue"
import {
    dataModelList,
    datamodelListWithWareHouse,
    permissionSchemeListWithWareHouse,
    datamodelListByWareHouse,
    permissionSchemeList,
    permissionRoleAdd,
    permissionRoleDel,
    permissionRoleAddBatch
} from '../dataAuthMehod/api.js';
export default {
    components:{
        modelTreeFix,
        qwDialog,
        dialogAuthSettingAddBody
    },
    data(){
        return {
            mod:"tree",//search
            keywordsModel:"",            
            curRole:null,
            curNode:null,
            dataList:null,
            nodePath:"",
            searchData:null,
            modelTreeStyles:{
                showTreeMenu:false,
                boxStyle:"width:248px;height:auto;",
                boxClass:"",
                showSlect:false,
                treeBox:"width:auto;height:570px;",
                lTree:"height: auto;",
                treeFormStyle:"padding-left:0;",
            },
            dialogAuthSettingAdd:{
                        title:"添加授权",
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
            configAuthSetting:{

            }
        }
    },
    methods:{
        querySearchModel(queryString, cb){
            if(queryString==""){
                if(this.searchData)return cb(this.searchData);
                return cb([]);
            }
            let params = {modelName:queryString}
            datamodelListByWareHouse({Vue:this,params:params}).then(res=>{
                let data=[];
                for(let item of res.model){
                    data.push({...item,value: item.wareHouseAlias })
                }
                this.searchData=data;
                cb(data);
            })
        },
        setRole(role){
            this.curRole=role;
            if(this.curNode){
                this.getDatamodelListWithWareHouse(this.curNode);
            }
        },
        keywordsModelSelected(item) {
            this.mod=="search";
            let params={warehouseId: item.warehouseId};
            this.nodePath = "搜索模式：" + item.wareHouseAlias+ "/" + item.alias;
            this.getAuthData(params);
        },
        reset(){
            this.keywordsModel="";
        },
        addAuth(){
            this.dialogAuthSettingAdd.dialogVisible=true;
        },
        nodeLabelClicked(node){
            if(node.data.id<1){
                return;
            }else{
                this.curNode=node;
                if(this.curRole){
                    this.getDatamodelListWithWareHouse(node);
                }else{
                    var timer =setInterval(() => {
                        if(this.curRole){//同步问题
                           this.getDatamodelListWithWareHouse(node);
                           clearInterval(timer);
                        }
                    }, 100);
                }
            }
        },
        setHasAuth(item){
            if(item.authId==-1){
                if(item.hasAuth){
                    let params={
                        modelId:item.modelId,
                        versionId:item.versionId,
                        schemeId:item.id,
                        roleId:this.curRole.data.id
                    } 
                    permissionRoleAdd({Vue:this,params:params}).then(res=>{
                        if(res.result){
                            item.authId=res.model.id;
                            this.$message.success("操作成功！");
                        }
                    },()=>{
                        setTimeout(() => {
                            item.hasAuth=false;
                        }, 30);
                    })
                }
            }else{
                if(!item.hasAuth){
                    permissionRoleDel({Vue:this,params:{ids:item.authId}}).then(res=>{
                        item.authId = -1;
                        this.$message.success("操作成功！");
                    },()=>{
                        setTimeout(() => {
                            item.hasAuth=true;
                        }, 30);
                    })
                }
            }            
        },
        close(){
            this.$emit("close",{self:this})
        },
        getModelPathByNode(node){
            let _node=node;
            let path="";
            while (_node) {
                path=path? _node.data.label +"/"+ path : _node.data.label;
                _node=_node.data.id!=0? _node.parent : null;
            }
            return path;
        },
        getDatamodelListWithWareHouse(node){
            this.mod="tree";
            let params={warehouseId: node.data.id};
            this.nodePath = this.getModelPathByNode(node);
            this.getAuthData(params);
        },
        getAuthData(params){
            permissionSchemeListWithWareHouse({Vue:this,params:params}).then(res=>{
                if(res.model && res.model.length>0){
                    for(let attr in res.model){
                        res.model[attr].authKey = res.model[attr].modelId + "_" + res.model[attr].versionId+"_"+ res.model[attr].id; 
                        res.model[attr].hasAuth = false;
                        res.model[attr].authId = -1;

                    }
                    params.roleId=this.curRole.data.id;
                    datamodelListWithWareHouse({Vue:this,params:params}).then(res2=>{
                        if(res2.model && res2.model.length>0){
                            let auth={};
                            for(let item of res2.model){
                                auth[item.modelId + "_" + item.versionId+"_"+ item.schemeId] = item.id;   
                            }
                            console.log("auth====>",auth)
                            for(let attr in res.model){
                                if(auth[res.model[attr].authKey]){
                                    res.model[attr].authId= auth[res.model[attr].authKey];
                                    res.model[attr].hasAuth=true;
                                }
                            }
                        }
                        this.dataList=res.model;
                    })

                }else{
                    this.dataList=null;
                }
            })
        }
    }
}
</script>
<style lang="less">
@import url("../../assets/style/dialogAuthSettingBody.less");
.authIsOpen{
    font-size: 14px;
}
.authItemBox{
    margin-top: 10px;
}
</style>
