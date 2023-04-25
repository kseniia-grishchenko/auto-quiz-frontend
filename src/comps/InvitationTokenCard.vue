<template>
  <div>
    <h3>Запрошувальне посилання</h3>
    <div class="invitation-token">
      <span>{{invitationToken}}</span>
      <i class="el-icon-document-copy" @click="copyToken"></i>
    </div>
    <el-alert
      ref="alertEl"
      :style="{display: 'none'}"
      :title="'Copied ' + invitationToken"
      :closable="false"
      type="success">
    </el-alert>
  </div>
</template>

<script>
export default {
  props: {
    invitationToken: {
      type: String,
      default: ''
    }
  },
  methods: {
    async copyToken () {
      this.alertEl = this.$refs.alertEl.$el;

      await navigator.clipboard.writeText(this.invitationToken);
      this.alertEl.style.display = 'initial';

      setTimeout(() => {
        this.alertEl.style.display = 'none';
      }, 1000);
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../assets/variables.scss';

h3 {
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
  margin-bottom: 8px;
}

.invitation-token {
  background-color: $secondary-bg;
  padding: 16px 12px;
  display: flex;
  justify-content: space-between;
  color: $main-font;
  font-size: 14px;
  line-height: 17px;
  margin-bottom: 20px;

  i {
    cursor: pointer;
  }
}
</style>
