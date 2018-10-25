<template>
<div class="dataLog" :style="{minHeight:sidebarHeight}">
    <dataLogSearch></dataLogSearch>
</div>
</template>
<script>
import { mapState } from 'vuex'
import dataLogSearch from "./dataLogSearch.vue"
export default {
    components:{
        dataLogSearch
    },
    computed:{
        ...mapState({
            sidebarHeight : state=> state.app.sidebarHeight
        })
    },
    
}
</script>
<style lang="less">
.dataLog{

}
</style>

