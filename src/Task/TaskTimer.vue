<template>
  <div class="timer">
    <div>{{ leftHours }} : {{ leftMinutes }} : {{ leftSeconds }}</div>
    <el-button v-if="lastQuestion && !taskFinished" type="danger" class="finish-btn" @click="$emit('finish-task')">Завершити тест</el-button>
  </div>
</template>

<script>
export default {
  data: () => ({
    leftHours: null,
    leftMinutes: null,
    leftSeconds: null
  }),
  props: {
    duration: {
      type: Number,
      default: 0
    },
    startedAt: {
      type: String,
      default: ''
    },
    lastQuestion: {
      type: Boolean,
      default: false
    },
    taskFinished: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    deadline () {
      return (new Date(this.startedAt)).getTime() + this.duration * 60 * 1e3;
    }

  },
  methods: {
    twoDigitRepresentation (value) {
      const strValue = String(value);
      if (strValue.length < 2) {
        return `0${strValue}`;
      }
      return strValue;
    },

    countdown () {
      if (this.deadline < Date.now()) {
        this.leftHours = this.twoDigitRepresentation(0);
        this.leftMinutes = this.twoDigitRepresentation(0);
        this.leftSeconds = this.twoDigitRepresentation(0);
        return;
      }
      const leftSeconds = (this.deadline - Date.now()) / 1e3;
      this.leftHours = this.twoDigitRepresentation(Math.floor(leftSeconds / 60 / 60));
      this.leftMinutes = this.twoDigitRepresentation(Math.floor(leftSeconds / 60));
      this.leftSeconds = this.twoDigitRepresentation(Math.floor(leftSeconds % 60));
    }
  },
  mounted () {
    this.interval = setInterval(this.countdown, 1);
  },
  beforeDestroy () {
    clearInterval(this.interval);
  }
};
</script>

<style lang="scss" scoped>
.timer {
  text-align: center;
  font-size: 22px;
  font-weight: 500;
  padding: 20px;
  position: relative;

  .finish-btn {
    width: auto;
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
