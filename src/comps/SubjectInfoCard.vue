<template>
  <div class="info-card">
    <div>
      <span>Назва:</span>
      <div class="action-section" ref="test">
        <span v-if="!editMode">{{subject.name}}</span>
        <el-input ref="inputEl" v-else v-model="editedName"></el-input>
        <i v-if="!editMode" class="el-icon-edit" @click="editMode = true"></i>
      </div>
    </div>
    <div>
      <span>Запрошувальне посилання:</span>
      <div class="action-section">
        <span>{{subject.invitation_token}}</span>
        <i class="el-icon-copy-document" @click="copyToken"></i>
      </div>
    </div>
    <el-button
      type="danger"
      @click="$emit('delete-subject', subject.id)"
    >Видалити предмет</el-button>
    <el-alert
      ref="alertEl"
      :style="{display: 'none'}"
      :title="'Copied ' + this.subject.invitation_token"
      :closable="false"
      type="info">
    </el-alert>
  </div>
</template>

<script>
export default {
  data: () => ({
    inputEl: null,
    editMode: false,
    editedName: ''
  }),
  props: {
    subject: Object
  },
  methods: {
    async copyToken () {
      await navigator.clipboard.writeText(this.subject.invitation_token);
      this.alertEl.style.display = 'initial';

      setTimeout(() => {
        this.alertEl.style.display = 'none';
      }, 1000);
    }
  },
  watch: {
    subject: {
      handler (subject) {
        this.editedName = subject.name;
      },
      immediate: true
    },

    editedName (value) {
      if (value === this.subject.name) return;
      this.$emit('edit-subject-name', {
        id: this.subject.id,
        name: this.editedName
      });
    },

    editMode (value) {
      if (!value) return;
      this.$nextTick(() => {
        this.inputEl = this.$refs.inputEl.$el;
      });
    },

    inputEl (el) {
      if (!el) return;
      el.addEventListener('focusout', () => {
        this.editMode = false;
      });
    }
  },
  mounted () {
    this.alertEl = this.$refs.alertEl.$el;
  }
};
</script>
<style lang="scss">
  .info-card {
    i {
      cursor: pointer;
    }

    .el-input__inner {
      border: none;
      background: none;
      height: 18px;
      line-height: 18px;
      font-size: 16px;
      padding-left: 0;
      width: auto;
    }

    button {
      margin-top: 30px;
    }
  }

</style>
<style lang="scss" scoped>
  .info-card {
    display: flex;
    flex-direction: column;
    gap: 20px;

    > div {
      display: grid;
      grid-template-columns: repeat(2, 1fr);

      .action-section {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      span {
        font-size: 16px;
        line-height: 18px;
      }

      > span:first-of-type {
        font-weight: 700;
      }
    }
  }
</style>
