<template>
<div class="container" @drop="drop($event)" @dragover="dragover($event)" :style="config.container.style" :id="config.container.attrs.id">
        <!-- <anchored ref="container" @switchLayer="switchLayer" @addItem="addItem" :level="2" :config="config" @itemFocusEvent="itemFocusEvent">sdfsf</anchored> -->
        <template v-for="(item,index) in config.listBar">
            <!-- 文字类型 -->
            <vue-draggable-resizable :style="item.style" :class="item.class" v-if="item.tag == 'font'" @resizing="onResizing" @dragging="onDragging($event)" :draggable="true" :resizable="true" :x="Number(item.style.left)" :y="Number(item.style.top)" :parent="true">
                <input type="text" v-model="item.value">
            </vue-draggable-resizable>
            <!-- 图片类型 -->
            <vue-draggable-resizable :style="item.style" v-if="item.tag == 'img'" :class="item.class" @resizing="onResizing" @dragging="onDragging($event)" :draggable="true" :resizable="true" :x="Number(item.style.left)" :y="Number(item.style.top)" :parent="true">
                <image :src="item.attrs.src" :style="item.imgStyle"></image>
            </vue-draggable-resizable>
            <!-- 矩形 -->
            <vue-draggable-resizable :style="item.style" :class="item.class" v-if="item.tag == 'rect'" @resizing="onResizing" @dragging="onDragging($event)" :draggable="true" :resizable="true" :x="Number(item.style.left)" :y="Number(item.style.top)" :parent="true">

            </vue-draggable-resizable>
            <!-- 表格类型 -->
            <vue-draggable-resizable :style="item.style" :class="item.class" v-if="item.tag == 'table'" @resizing="onResizing" @dragging="onDragging($event)" :draggable="true" :resizable="true" :x="Number(item.style.left)" :y="Number(item.style.top)" :parent="true">
                
            </vue-draggable-resizable>
        </template>
</div>
</template>
<script>
// var $ = require('jquery');
// var jQueryBridget = require('jquery-bridget');
// var Draggabilly = require('draggabilly');
// jQueryBridget( 'draggabilly', Draggabilly, $ );
import {mapState} from "vuex"
import VueDraggableResizable from 'vue-draggable-resizable'
export default {
    props:{
        config:{
            type:Object
        }
    },
    components:{
        // anchored:{
        //     render: function (createElement) {
        //         let _c = this.config.container;
        //         let that = this;
        //         return createElement('div',{
        //            style: _c.style,
        //            class: _c.class,
        //            attrs:_c.attrs,
        //            on:{
        //                drop(e){
        //                     let data = e.dataTransfer.getData("type");
        //                     that.$emit("addItem",e,data);
        //                     that.$nextTick(()=>{
        //                         let $draggabilly = $('._item').draggabilly({
        //                             containment:"#container"
        //                         })
        //                         $('._item').on("dragMove",(e)=>{
        //                             console.log( e );
        //                         })
        //                     })
        //                },
        //                dragover(e){
        //                    e.preventDefault();
        //                }
        //            },
        //         },this.config.listBar.map(function (item,index,array) {
        //             if( item.tag == 'font' ){
        //                 return createElement('div',{
        //                     style: {
        //                         ...item.style,
        //                         cursor:'move'
        //                     },
        //                     class: item.class,
        //                     attrs: item.attrs,
        //                     on:{
        //                         click(e){
        //                             that.$emit("switchLayer", e, index);
        //                         },
        //                         drag(e){
        //                             console.log(e);
        //                         }
        //                     }
        //                 },[createElement('input',{
        //                         style: {},
        //                         class: [],
        //                         attrs: {},
        //                         domProps:{
        //                             value:item.value
        //                         },
        //                         on:{
        //                             input:function(e){
        //                                 self.$emit('input',e.target.value)
        //                             }
        //                         }
        //                 })])
        //             }else if( item.tag == "text" ){
        //                 return createElement('span',{
        //                     style: item.style,
        //                     class: item.class,
        //                     attrs:item.attrs,
        //                     domProps: {
        //                         innerHTML: item.value
        //                     },
        //                     on:{}
        //                 })
        //             }else if( item.tag == "img" ){
        //                 return createElement('div',{
        //                     style: {
        //                         ...item.style,
        //                         cursor:'move'
        //                     },
        //                     class: item.class,
        //                     attrs: {},
        //                     on:{
        //                         click(e){
        //                             that.$emit("switchLayer", e, index);
        //                         }
        //                     }
        //                 },[createElement('image',{
        //                         style: {...item.imgstyle},
        //                         class: [],
        //                         attrs: item.attrs,
        //                         domProps:{
                                    
        //                         },
        //                         on:{
                                    
        //                         }
        //                 })])
        //             }else if( item.tag == 'rect'){
        //                 return createElement('div',{
        //                     style: {
        //                         ...item.style,
        //                         cursor:'move'
        //                     },
        //                     class: item.class,
        //                     attrs: {},
        //                     on:{
        //                         click(e){
        //                             that.$emit("switchLayer", e, index);
        //                         }                                
        //                     }
        //                 })
        //             }else if( item.tag == 'table' ){
        //                 return createElement('div',{
        //                     style: {
        //                         ...item.style,
        //                         cursor:'move'
        //                     },
        //                     class: item.class,
        //                     attrs: {},
        //                     on:{
        //                         click(e){
        //                             that.$emit("switchLayer", e, index);
        //                         }                                
        //                     }
        //                 })                        
        //             }
        //         }))
        //     },
        //     props: {
        //         level: {
        //             type: Number,
        //             required: true
        //         },
        //         config:{
        //             type:Object,
        //             required:true
        //         }
        //     }
        // },
        VueDraggableResizable
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
            },
            draggabilly:"",//draggabilly对象....
        }
    },
    mounted(){
        this.$nextTick(()=>{
            // 获取container 的left和top值
            let box = document.getElementById('container');
            this.containerPosi.clientLeft = box.getBoundingClientRect().left;
            this.containerPosi.clientTop = box.getBoundingClientRect().top;
            this.bindDragbillity();
        })
    },
    methods:{
        /*关闭前调用*/ 
        itemFocusEvent( index, e, item ){
            if( e.type == 'mousemove' ){
                debugger;
                // 设置目标元素的位置信息
                let _target = this.config.listBar[ this.config.container.curIndex ];
                let _left = e.clientX - this.containerPosi.clientLeft - this.target.offsetX;
                let _top = e.clientY - this.containerPosi.clientTop - this.target.offsetY;
                _target.style.left = _left + 'px';
                _target.style.top = _top + 'px';
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
            }else if( e.type == 'drag' ){

            }else if( e.type == 'dragstart' ){

            }else if( e.type == 'dragend' ){
                
            }
        },
        bindDragbillity(){

        },
        switchLayer(e,index){
            this.$emit("pSwitchLayer", e, index);
        },
        onDragging(e){
            // console.log(e);
        },
        drop(e){
            let type = e.dataTransfer.getData("type");
            this.$emit("addPitem",e,type,this.containerPosi);
            this.$nextTick(()=>{
               
            })            
        },
        dragover(e){
            e.preventDefault();
        },
        onResizing(e,m,n,x,y){
            console.log(e,m,n,x,y);
        }
    },
    watch:{
        "config.listBar":{
            handler(n,o){

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


