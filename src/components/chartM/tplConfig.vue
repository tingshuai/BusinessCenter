<template>
<div class="">
    <aside class="controlBar">
        <section>
            <div class="tit">模配置</div>
        </section>
    </aside>
    <aside class="container">
        <anchored :level="2" :config="config" @itemFocusEvent="itemFocusEvent">sdfsf</anchored>
    </aside>
</div>
</template>
<script>
import {mapState} from "vuex"
export default {
    props:{
        config:{
            type:Object
        }
    },
    components:{
        anchored:{
            render: function (createElement) {
                let _c = this.config.container;
                let that = this;
                return createElement('div',{
                   style: _c.style,
                   class: _c.class,
                   attrs:_c.attrs,
                   on:{
                       mousemove(e){

                       },
                       mouseup:function(e){
                           that.$emit('itemFocusEvent','',e,'');
                       }                       
                   }
                },this.config.listBar.map(function (item,index,array) {
                    if( item.tag == 'input' ){
                        return createElement('input',{
                            style: item.style,
                            class: item.class,
                            attrs:item.attrs,
                            on:{
                                input:function(e){
                                    debugger;
                                },
                                dragstart:function(e){
                                    
                                },
                                drag:function(e){
                                    that.$emit('itemFocusEvent',index,e,item);                                   
                                },
                                dragend:function(e){
                                    that.$emit('itemFocusEvent',index,e,item);
                                },
                                mousedown:function(e){
                                    that.$emit('itemFocusEvent',index,e,item);
                                },
                                mouseup:function(e){
                                    that.$emit('itemFocusEvent',index,e,item);
                                }
                            }
                        })
                    }else if( item.tag == "text" ){
                        return createElement('span',{
                            style: item.style,
                            class: item.class,
                            attrs:item.attrs,
                            on:{
                                input:function(e){
                                    debugger;
                                },
                                dragstart:function(e){
                                    that.$emit('itemFocusEvent',index,e,item);
                                },
                                dragend:function(e){
                                    // debugger;
                                },
                                mouseup:function(e){
                                    that.$emit('itemFocusEvent',index,e,item);
                                }                                
                            }
                        },item.value)
                    }
                }))
            },
            props: {
                level: {
                    type: Number,
                    required: true
                },
                config:{
                    type:Object,
                    required:true
                }
            }
        }
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
        itemFocusEvent( index, e, item ){
            if( e.type == 'mousemove' ){
                debugger;
            }else if( e.type == 'mousedown' ){
                this.config.container.curIndex = index;
                console.log( this.config.container.curIndex )
            }else if( e.type == 'mouseup' ){
                this.config.container.curIndex = '';
                console.log( this.config.container.curIndex )
            }else if( e.type == "dragstart" ){
                this.config.container.curIndex = index;
            }else if( e.type == "dragend"){
                this.config.container.curIndex = '';
            }else if( e.type == "drag"){
                this.config.listBar[ this.config.container.curIndex ].style.left = e.layerX + 'px';
                this.config.listBar[ this.config.container.curIndex ].style.top = e.layerY + 'px';                
            }
        }
    }
}
</script>
<style lang="less">
@import url("~style/pageCommon.less");
.qwCommonPage{

}
</style>


