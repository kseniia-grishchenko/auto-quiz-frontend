<template>
  <div class="info-card">
    <div>
      <span>Назва:</span>
      <div class="action-section">
        <span v-if="!editMode">{{course.name}}</span>
        <el-input ref="inputEl" v-else v-model="editedName"></el-input>
        <i v-if="!editMode" class="el-icon-edit" @click="editMode = true"></i>
      </div>
    </div>
    <div>
      <span>Предмет:</span>
      <div class="action-section">
        <span>{{subject}}</span>
      </div>
    </div>
    <div>
      <span>Запрошувальне посилання:</span>
      <div class="action-section">
        <span>{{course.invitation_token}}</span>
        <i class="el-icon-copy-document" @click="copyToken"></i>
      </div>
    </div>
    <el-button
      type="danger"
      @click="$emit('delete-course', course.id)"
    >Видалити курс</el-button>
    <el-alert
      ref="alertEl"
      :style="{display: 'none'}"
      :title="'Copied ' + this.course.invitation_token"
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
    course: Object,
    subject: String
  },
  methods: {
    async copyToken () {
      await navigator.clipboard.writeText(this.course.invitation_token);
      this.alertEl.style.display = 'initial';

      setTimeout(() => {
        this.alertEl.style.display = 'none';
      }, 1000);
    }
  },
  watch: {
    course: {
      handler (course) {
        this.editedName = course.name;
      },
      immediate: true
    },

    editedName (value) {
      if (value === this.course.name) return;
      this.$emit('edit-course-name', {
        id: this.course.id,
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
      grid-template-columns: 300px 1fr;

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
