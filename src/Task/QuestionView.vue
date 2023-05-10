<template>
  <el-row class="content">
    <div class="title">{{question.title}}</div>
    <div v-if="!taskFinished">
      <el-button v-if="!isListening" type="primary" class="record-response" @click="$emit('record-response')">Записати відповідь</el-button>
      <el-button v-else type="primary" class="record-response" @click="$emit('stop-recording')">Готово</el-button>
    </div>
    <div v-if="!editMode" class="result">{{result}}</div>
    <div v-if="!taskFinished">
      <el-input
        v-if="editMode"
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 4}"
        v-model="editedResult"
        class="edited-input"
        ref="input">
      </el-input>
      <div v-if="badSimilarity" class="error">Ви не можете редагувати відповідь більше, ніж на 80%</div>
    </div>
    <div v-if="!taskFinished">
      <el-button v-if="result && !isListening && !editMode" class="record-response" @click="editMode = true">Редагувати</el-button>
      <el-button v-if="editMode" class="record-response" @click="handleEditedResponse">Зберегти</el-button>
    </div>
    <el-alert
      v-if="answer"
      type="info"
      :closable="false"
      class="explanation-block">
      <div class="score">Ви заробили {{ answer.mark }} балів</div>
      <div>Пояснення: {{ answer.comment }}</div>
    </el-alert>
  </el-row>
</template>

<script>
import { distance } from 'fastest-levenshtein';

export default {
  data: () => ({
    editedResult: '',
    editMode: false,
    badSimilarity: false
  }),
  props: {
    question: {
      type: Object,
      default: () => {}
    },
    isListening: {
      type: Boolean,
      default: false
    },
    result: {
      type: String,
      default: ''
    },
    answer: {
      type: Object,
      default: null
    },
    taskFinished: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    similarity () {
      const distanceBetweenStrings = distance(this.editedResult, this.result);
      return 1 - (distanceBetweenStrings) / Math.max(this.editedResult.length, this.result.length);
    }
  },
  methods: {
    handleEditedResponse () {
      this.badSimilarity = this.similarity < 0.8;
      if (!this.badSimilarity) {
        this.editMode = false;
        this.$emit('edited-response', this.editedResult);
        return;
      }
      this.$refs.input.$el.classList.add('invalid');
    }
  },
  watch: {
    question () {
      this.editedResult = '';
      this.editMode = false;
      this.badSimilarity = false;
    },
    result: {
      handler (result) {
        this.editedResult = result;
      },
      immediate: true
    }
  }
};
</script>

<style lang="scss">
.edited-input.invalid {
  textarea {
    border-color: red;
  }
}

.explanation-block {
  margin-top: 60px;
  * {
    font-size: 18px;
  }
}
</style>
<style lang="scss" scoped>
@import '../assets/variables.scss';
.content {
  display: flex;
  flex-direction: column;
  padding: 100px 40px;
  align-items: center;
}

.record-response {
  margin-top: 60px;
  width: auto;
}

.title {
  font-size: 26px;
}

.record-response {
  font-size: 20px;
}

.result {
  margin-top: 60px;
  font-size: 20px;
}

.edited-input {
  margin-top: 60px;
  font-size: 20px;
}

.error {
  color: red;
}

.score {
  color: $main-font;
  font-weight: 500;
  margin-bottom: 20px;
}
</style>
