<template>
<div class="chartPage">
    <aside class="controlBar">
        <control-bar ref="controlBar" @showColorPicker="showColorPicker" :colorPicker="colorPicker" :controlConfig="controlConfig"></control-bar>
    </aside>
    <aside class="container">
        <tpl-config ref="chartCont" :config="chartData"></tpl-config>
    </aside>
    <chrome-picker v-show="colorPicker.show" :style="colorPicker.style" id="colorPicker" ref="colorPicker" :value="colorPicker.color" @input="updateValue"></chrome-picker>
</div>
</template>
<script>
import {mapState} from "vuex"
import tplConfig from 'components/chartM/tplConfig.vue';
import controlBar from 'components/chartM/controlBar.vue';
//颜色拾取器
import { Chrome } from 'vue-color'
// draggabilly移动插件...
var $ = require('jquery');
var jQueryBridget = require('jquery-bridget');
var Draggabilly = require('draggabilly');
jQueryBridget( 'draggabilly', Draggabilly, $ );
export default {
    components:{
        tplConfig,controlBar,
        'chrome-picker': Chrome
    },
    computed:{
        ...mapState({
            sidebarHeight : state=> state.app.sidebarHeight
        })
    },
    data(){
        return {
            colorPicker:{
                color:"#ffffff",
                show:false,
                style:{
                    top:0,
                    left:0
                }
            },
            controlConfig:{},
            chartData:{
                container:{
                    id:new Date().getTime(),
                    tag:"",
                    value:"999",
                    style:{
                        'border':"1px solid red",
                        'fontSize':'22px',
                        'position':'relative',
                        'left':'',
                        'top':'',
                        "background-color":"#ffffff",
                        "width":'500px',
                        "height":"500px",
                        "-moz-user-select": "none",
                        "-webkit-user-select": "none",
                        "-ms-user-select": "none",
                        "-khtml-user-select": "none",
                        "user-select": "none",
                    },
                    attribute:{

                    },
                    attrs:{
                        id:"container"
                    },
                    class:[],
                    curIndex:''//点击的当前项目下标....
                },
                listBar:[
                    {
                        id:new Date().getTime(),
                        tag:"input",
                        value:"999",
                        style:{
                            'border':"1px solid red",
                            'fontSize':'22px',
                            'position':'absolute',
                            'left':'20px',
                            'top':'',
                        },
                        attribute:{

                        },
                        attrs:{
                            "disabled":true
                        },
                        class:["_item"]
                    },
                    {
                        id:new Date().getTime(),
                        tag:"text",
                        value:"99",
                        style:{
                            'border':"1px solid red",
                            'fontSize':'22px',
                            'position':'absolute',
                            'left':'100px',
                            'top':'100px',
                            'cursor':'move'
                        },
                        attribute:{
                            
                        },
                        attrs:{
                            
                        },
                        class:["_item"]
                    }
                ]
            }
        }
    },
    mounted(){
        // this.init();
        this.$nextTick(()=>{
            let that = this;
            document.body.addEventListener( "click", (e)=>{
                let len = $('#colorPicker').has(e.target).length;
                if ( len == 0 ) {
                    that.colorPicker.show = false;
                }
            })
        })
    },
    methods:{
        updateValue(val){
            // 选择颜色时为相应元素赋值.....
            this.colorPicker.color = val.hex;
            this.chartData.container.style['background-color'] = val.hex;
        },
        showColorPicker(e, _color, _type){//定位显示颜色选择器....
            this.colorPicker.show = true;
            this.colorPicker.style.left = e.clientX + 'px';
            this.colorPicker.style.top = e.clientY + 'px';
        }
    }
}
</script>
<style lang="less">
@import url("~style/pageCommon.less");
.qwCommonPage{

}
.chartPage{
    display:flex;
    justify-content:flex-start;
    align-items:flex-start;
    .controlBar{
        width:300px;
    }
}
.controlBar{
    width:"";
}
#colorPicker{
    position:absolute;
}
</style>


