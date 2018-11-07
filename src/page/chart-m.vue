<template>
<div class="">
    <aside class="controlBar">
        <section>
            <tpl-config :config="chartData"></tpl-config>
        </section>
    </aside>
    <aside class="container">

    </aside>
</div>
</template>
<script>
import {mapState} from "vuex"
import tplConfig from 'components/chartM/tplConfig.vue'
export default {
    components:{
        tplConfig
    },
    computed:{
        ...mapState({
            sidebarHeight : state=> state.app.sidebarHeight
        })
    },
    data(){
        return {
            chartData:{
                container:{
                    id:new Date().getTime(),
                    tag:"input",
                    value:"999",
                    style:{
                        'border':"1px solid red",
                        'fontSize':'22px',
                        'position':'relative',
                        'left':'',
                        'top':'',
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
                        draggable:false,
                        id:"container"
                    },
                    class:{

                    },
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
                            draggable:false,
                            "disabled":true
                        },
                        class:{

                        }
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
                        },
                        attribute:{
                            
                        },
                        attrs:{
                            draggable:false
                        },
                        class:{

                        }
                    }
                ]
            }
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


