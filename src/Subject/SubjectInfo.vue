<template>
  <el-row class="content">
    <div>
      <span>Назва:</span>
      <span>{{subject.name}}</span>
    </div>
    <div>
      <span>Вчителі:</span>
      <span>{{teacherList}}</span>
    </div>
    <div>
      <span>Запрошувальне посилання:</span>
      <span @click="copyLink">{{invitationLink}}</span>
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
  },
  computed: {
    teacherList () {
      return (this.subject.teachers || [])
        .map(teacher => `${teacher.first_name} ${teacher.last_name}`)
        .join(', ');
    },
    invitationLink () {
      return `${import.meta.env.VITE_APP_URL}/#/join-subject/${this.subject.invitation_token}`;
    }
  },
  methods: {
    async copyLink () {
      await navigator.clipboard.writeText(this.invitationLink);
      this.$notify({
        title: 'Успіх',
        message: 'Посилання успішно скопійовано',
        type: 'success',
        showClose: false
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.content {
  padding: 12px 0;

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
