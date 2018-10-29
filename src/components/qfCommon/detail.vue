<template>
<div class="qwCommonPage">
    <section>
		<el-row type="flex" class="part_right">
			<el-col :span="12">
                <aside class="part_left">
                    <el-row type="flex" class="leftPart">
                        <el-col :span="6">应用名：</el-col>
                        <el-col :span="18">{{ dataLeft.app || '' }}</el-col>
                    </el-row>
                    <el-row type="flex" class="leftPart">
                        <el-col :span="6">启用日期：</el-col>
                        <el-col :span="18">{{ dataLeft.ableDate || '' }}</el-col>
                    </el-row>	
                    <el-row type="flex" class="leftPart">
                        <el-col :span="6">编号</el-col>
                        <el-col :span="18">{{ dataLeft.code || '' }}</el-col>
                    </el-row>
                    <el-row type="flex" class="leftPart">
                        <el-col :span="6">是否启用</el-col>
                        <el-col :span="18">{{ dataLeft.isAble == 'true' ? "是" : "否" }}</el-col>
                    </el-row>	
                    <el-row type="flex" class="leftPart">
                        <el-col :span="6">产品</el-col>
                        <el-col :span="18">{{ dataLeft.product }}</el-col>
                    </el-row>
                    <el-row type="flex" class="leftPart">
                        <el-col :span="6">备注</el-col>
                        <el-col :span="18">{{ dataLeft.remark }}</el-col>
                    </el-row>
                </aside>
            </el-col>
			<el-col :span="12">
                <aside class="part_center">
                    <el-row type="flex" class="leftPart">
                        <el-col :span="6">应用名：</el-col>
                        <el-col :span="18">{{ dataLeft.app || '' }}</el-col>
                    </el-row>
                    <el-row type="flex" class="leftPart">
                        <el-col :span="6">启用日期：</el-col>
                        <el-col :span="18">{{ dataLeft.ableDate || '' }}</el-col>
                    </el-row>	
                    <el-row type="flex" class="leftPart">
                        <el-col :span="6">编号</el-col>
                        <el-col :span="18">{{ dataLeft.code || '' }}</el-col>
                    </el-row>
                    <el-row type="flex" class="leftPart">
                        <el-col :span="6">是否启用</el-col>
                        <el-col :span="18">{{ dataLeft.isAble == 'true' ? "是" : "否" }}</el-col>
                    </el-row>	
                    <el-row type="flex" class="leftPart">
                        <el-col :span="6">产品</el-col>
                        <el-col :span="18">{{ dataLeft.product }}</el-col>
                    </el-row>
                    <el-row type="flex" class="leftPart">
                        <el-col :span="6">备注</el-col>
                        <el-col :span="18">{{ dataLeft.remark }}</el-col>
                    </el-row>
                </aside>                
            </el-col>
			<el-col :span="12">
                
            </el-col>            
		</el-row>	
	</section>
</div>
</template>
<script>
import {mapState} from "vuex"
export default {
    props:{
        dataLeft:{
            type:Object
        }
    },
    components:{
        
    },
    computed:{
        ...mapState({
            sidebarHeight : state=> state.app.sidebarHeight
        })
    },
    data(){
        return {           
            treeConfig:{}
        }
    },
    mounted(){
        // this.init();
    },
    methods:{
        /*关闭前调用*/ 
        ruleDialogClose(){
           
        }
    }
}
</script>
<style lang="less">
@import url("~style/pageCommon.less");
.qwCommonPage{

}
</style>


