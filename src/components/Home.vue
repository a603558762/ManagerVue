<template>
<div>
  wecome !
  <el-button type="info" @click="logout">Logout</el-button>
</div>
</template>

<script>
export default {
  name: "HomeP",
  methods:{
    logout(){
      window.sessionStorage.clear()
      this.$router.push("/login")
    }
  }
}
</script>

<style scoped>

</style>