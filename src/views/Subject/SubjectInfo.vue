<template>
  <el-row class="content">
    <div>
      <span>Назва:</span>
      <span>{{subject.name}}</span>
    </div>
    <div>
      <span>Вчителі:</span>
      <span>{{subject.teachers}}</span>
    </div>
    <div>
      <span>Запрошувальне посилання:</span>
      <span>{{subject.invitation_token}}</span>
    </div>
  </el-row>
</template>

<script>
export default {
  props: {
    subject: {
      type: Object,
      default: () => {}
    }
  }
};
</script>

<style lang="scss" scoped>
.content {
  div {
    margin-bottom: 20px;
    display: flex;
    gap: 20px;

    span {
      font-size: 20px;
    }

    span:first-of-type {
      font-weight: 600;
    }
  }
}
</style>
