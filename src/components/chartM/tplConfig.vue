<template>
<div class="">
    <aside class="controlBar">
        <section>
            <div class="tit">模配置</div>
        </section>
    </aside>
    <aside class="container">
        <anchored ref="container" :level="2" :config="config" @itemFocusEvent="itemFocusEvent">sdfsf</anchored>
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
                           if( _c.curIndex != '' ){
                               that.$emit('itemFocusEvent','',e,'');
                           }
                       },
                       mouseup:function(e){
                          that.$emit('itemFocusEvent','',e,'');
                       },
                       mouseleave:function(e){
                          that.$emit('itemFocusEvent','',e,'');
                       }
                   },
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
                                // dragstart:function(e){
                                    
                                // },
                                // drag:function(e){
                                //     that.$emit('itemFocusEvent',index,e,item);                                   
                                // },
                                // dragend:function(e){
                                //     that.$emit('itemFocusEvent',index,e,item);
                                // },
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
                            domProps: {
                                innerHTML: item.value
                            },
                            on:{
                                input:function(e){
                                    debugger;
                                },
                                // dragstart:function(e){
                                //     that.$emit('itemFocusEvent',index,e,item);
                                // },
                                // dragend:function(e){
                                //     // debugger;
                                // },                               
                                mousedown:function(e){
                                    that.$emit('itemFocusEvent',index,e,item);
                                },
                                mouseup:function(e){
                                    that.$emit('itemFocusEvent',index,e,item);
                                }                             
                            }
                        })
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
            containerPosi:{
                clientLeft:"",
                clientTop:""
            },
            target: {
                offsetX:"",
                offsetY:""
            }
        }
    },
    mounted(){
        this.$nextTick(()=>{
            // 获取container 的left和top值
            let box = document.getElementById('container');
            this.containerPosi.clientLeft = box.getBoundingClientRect().left;
            this.containerPosi.clientTop = box.getBoundingClientRect().top;
        })
    },
    methods:{
        /*关闭前调用*/ 
        itemFocusEvent( index, e, item ){
            if( e.type == 'mousemove' ){
                // 设置目标元素的位置信息
                let _target = this.config.listBar[ this.config.container.curIndex ];
                let _left = e.clientX - this.containerPosi.clientLeft - this.target.offsetX;
                let _top = e.clientY - this.containerPosi.clientTop - this.target.offsetY;
                _target.style.left = _left + 'px';
                _target.style.top = _top + 'px';
                debugger;
                // console.log( e.clientX , this.containerPosi.clientLeft , this.target.offsetX , _left)
                // console.log( e.clientY , this.containerPosi.clientTop , e.offsetY , _top);
            }else if( e.type == 'mousedown' ){
                // 指示目标元素.......
                this.config.container.curIndex = index;
                // 记录鼠标距离目标元素的边界距离......
                this.target.offsetX = e.offsetX;
                this.target.offsetY = e.offsetY;
            }else if( e.type == 'mouseup' ){
                // 指示目标元素为空.......
                this.config.container.curIndex = '';
            }else if( e.type == "mouseleave" ){
                // 指示目标元素为空.......
                this.config.container.curIndex = '';
                console.log( "mouseleave" )
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


