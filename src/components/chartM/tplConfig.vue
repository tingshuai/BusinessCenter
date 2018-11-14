<template>
<div class="container" @drop="drop($event)" @dragover="dragover($event)" :style="config.container.style" :id="config.container.attrs.id">
        <template v-for="(item,index) in config.listBar">
            <!-- 文字类型 -->
            <vue-draggable-resizable :style="item.style" :is-conflict-check="true" :class="item.class" v-if="item.tag == 'font'" @resizing="onResizing" @dragging="onDragging($event)" :draggable="true" :resizable="true" :x="Number(item.style.left)" :y="Number(item.style.top)" :parent="true">
                <input type="text" v-model="item.value">
            </vue-draggable-resizable>
            <!-- 图片类型 -->
            <vue-draggable-resizable v-if="item.tag == 'img'" @resizing="onResizing" @dragging="onDragging($event)" :draggable="true" :resizable="true" :x="Number(item.style.left)" :y="Number(item.style.top)" :parent="true">
                <div :style="item.style" :is-conflict-check="true" :class="item.class">
                    <image :src="item.attrs.src" :style="item.imgStyle"></image>
                </div>
            </vue-draggable-resizable>
            <!-- 矩形 -->
            <vue-draggable-resizable :style="item.style" :is-conflict-check="true" :class="item.class" v-if="item.tag == 'rect'" @resizing="onResizing" @dragging="onDragging($event)" :draggable="true" :resizable="true" :x="Number(item.style.left)" :y="Number(item.style.top)" :parent="true">

            </vue-draggable-resizable>
            <!-- 表格类型 -->
            <vue-draggable-resizable :style="item.style" :is-conflict-check="true" :class="item.class" v-if="item.tag == 'table'" @resizing="onResizing" @dragging="onDragging($event)" :draggable="true" :resizable="true" :x="Number(item.style.left)" :y="Number(item.style.top)" :parent="true">
                
            </vue-draggable-resizable>
        </template>
</div>
</template>
<script>
import {mapState} from "vuex"
import VueDraggableResizable from 'vue-draggable-resizable'
export default {
    props:{
        config:{
            type:Object
        }
    },
    components:{
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
        })
    },
    methods:{
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


