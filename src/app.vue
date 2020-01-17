<template>
    <div>我是vue文件测试打包{{ name }}</div>
</template>
<script>
export default {
    data(){
        return {
            name: '张三'
        }
    }
}
</script>
<style scoped>
    div{
        color: red;
    }
</style>