<template>
  <el-container v-if="active">
    <el-header>
      <nav-header :title="subject.name" :navItems="navItems" :hash="hash"></nav-header>
    </el-header>
    <el-main>

    </el-main>
  </el-container>
</template>

<script>
import {
  getRequest
} from '../../api.js';
import NavHeader from '../../comps/NavHeader.vue';
export default {
  data: () => ({
    hash: '',
    id: null,
    subject: {},
    active: false
  }),
  computed: {
    navItems () {
      return [
        {
          title: 'Квізи',
          link: `#/subjects?id=${this.id}`
        },
        {
          title: 'Інформація',
          link: `#/subject?id=${this.id}&info=true`
        }
      ];
    }
  },
  methods: {
    hashHandler () {
      this.hash = location.hash;
      const match = location.hash.match(/#\/subjects\?id=(\d+)/);
      if (!match) return;
      this.active = !!match[0];
      this.id = match[1];
    }
  },
  watch: {
    async id (id) {
      const { data: subject } = await getRequest(`/api/subjects/${id}`);
      this.subject = subject;
    }
  },
  mounted () {
    window.addEventListener('hashchange', this.hashHandler);
    this.hashHandler();
  },
  beforeDestroy () {
    window.removeEventListener('hashchange', this.hashHandler);
  },
  components: {
    NavHeader
  }
};
</script>

<style>

</style>
