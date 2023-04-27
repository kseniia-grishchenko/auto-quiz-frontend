<template>
  <el-button class="create-btn" @click="$emit('click')">
    <span>Створити {{title}}</span>
    <span>+</span>
  </el-button>
</template>

<script>
export default {
  props: {
    title: {
      String,
      default: ''
    }
  }
};
</script>

<style>
.create-btn > span {
  display: flex;
  justify-content: space-between;
}

.create-btn span {
  font-size: 18px;
  font-weight: 500;
}

.create-subject-btn span:last-of-type {
  font-size: 22px;
}
</style>
