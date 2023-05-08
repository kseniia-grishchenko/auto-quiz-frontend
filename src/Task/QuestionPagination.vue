<template>
  <div class="question-pagination" v-if="title">
    <div :class="['nav', prevDisabled && 'disabled' ]" @click="$emit('prev')" @mousedown.prevent>
      <svg width="32" height="32" viewbox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <use href="/assets/icons/arrow.svg#arrow"></use>
      </svg>
    </div>
    <span>{{title}}</span>
    <div :class="['nav', 'next', nextDisabled && 'disabled'] " @click="$emit('next')" @mousedown.prevent>
      <svg class="right" width="32" height="32" viewbox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <use href="/assets/icons/arrow.svg#arrow"></use>
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    prevDisabled: {
      type: Boolean,
      default: false
    },
    nextDisabled: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../assets/variables.scss';

.question-pagination {
  display: grid;
  align-items: center;
  justify-content: center;
  grid-template-columns: 1fr auto 1fr;
  padding: 20px;
}

.right {
  transform: rotate(180deg);
  justify-self: end;
}

span {
  font-size: 20px;
}

.nav {
  color: #404454;
  opacity: 0.4;
  cursor: pointer;
  width: 60px;
  padding: 10px;
}

.nav:hover {
  opacity: 1;
}

.nav.next {
  justify-self: end;
}
.nav.disabled {
  pointer-events: none;
}
</style>
