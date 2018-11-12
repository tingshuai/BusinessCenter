<template>
    <section>
        <el-collapse v-model="actItem" accordion>
            <el-collapse-item title="模板配置" name="1">
                <div class="item">
                    <h5>模板尺寸</h5>
                    <el-radio-group class="radioGroup" size="mini" v-model="tplConfig.tplSize">
                        <el-radio :border="true" :label="3">A3尺寸</el-radio>
                        <el-radio :border="true" :label="4">A4尺寸</el-radio>
                        <el-radio :border="true" :label="5">A5尺寸</el-radio>
                        <el-radio :border="true" :label="6">自定义</el-radio>
                    </el-radio-group>
                </div>
                <div class="item">
                    <h5>背景设置</h5>
                    <aside id="setBg">
                        <div class="selBgColor" @click.stop="selColor">
                            <span class="colorQuote" :style="{ 'background-color': colorPicker.color }"></span>
                            <span>选择颜色</span>
                        </div>
                        <el-upload
                        id="upload"
                        class="upload-demo"
                        action="https://jsonplaceholder.typicode.com/posts/"
                        :on-change="uploadChange">
                        <el-button size="small" type="primary">上传背景图</el-button>
                        </el-upload>
                    </aside>
                </div>
                <div class="item">
                    <value-quote :config="quoteOpacity"></value-quote>
                </div>                
            </el-collapse-item>
            <el-collapse-item title="文字配置" name="2">
                <div>控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>
                <div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div>
            </el-collapse-item>
            <el-collapse-item title="矩形配置" name="3">
                <div>简化流程：设计简洁直观的操作流程；</div>
                <div>清晰明确：语言表达清晰且表意明确，让用户快速理解进而作出决策；</div>
                <div>帮助用户识别：界面简单直白，让用户快速识别而非回忆，减少用户记忆负担。</div>
            </el-collapse-item>
            <el-collapse-item title="图片配置" name="4">
                <div>用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；</div>
                <div>结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。</div>
            </el-collapse-item>
            <el-collapse-item title="表格配置" name="5">
                <div>用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；</div>
                <div>结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。</div>
            </el-collapse-item>
        </el-collapse>
    </section>
</template>
<script>
import { mapState } from "vuex";
import valueQuote from 'components/chartM/upDataValue.vue';
export default {
    props:{
        controlConfig:{
            type:Object
        },
        colorPicker:{
            type:Object
        }
    },
    components:{
        valueQuote
    },
    computed:{
        ...mapState({
            sidebarHeight : state=> state.app.sidebarHeight
        })
    },
    data(){
        return {
            tplConfig:{//模板配置.....
                tplSize:3,//模板尺寸
            },
            actItem:"1",
            quoteOpacity:{//透明度块....
                title:"透明度",
                value:50,
                type:"opacity",
                step:1,
                max:100,
                min:0
            }
        }
    },
    mounted(){
        this.$nextTick(()=>{
         
        })
    },
    methods:{
        /*关闭前调用*/ 
        itemFocusEvent( index, e, item ){

        },
        uploadChange(e){
            debugger;
        },
        selColor(e){//显示颜色选择器.....
            this.$emit("showColorPicker", e , this.colorPicker.color, 'show')
        }
    },
    watch:{
        
    }    
}
</script>
<style lang="less">
@import url("~style/pageCommon.less");
.el-collapse-item__header{
    font-size:18px;
}
.colorQuote{
    display:inline-block;
    width:20px;
    height:20px;
    border:1px solid #ddd;
}
#setBg{
    height:30px;
    line-height:30px;
    vertical-align:middle;
    display:flex;
    align-items:center;
    cursor:pointer;
    .selBgColor{
        >span{
            vertical-align:middle;
        }
    }
}
#upload{
    margin-left:10px;
}
.radioGroup{
    display:flex;
    flex-wrap:wrap;
}
</style>


