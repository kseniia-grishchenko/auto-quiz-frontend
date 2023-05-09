<template>
  <el-row class="content">
    <span>{{question.title}}</span>
    <el-button v-if="!isListening" type="primary" class="record-response" @click="$emit('record-response')">Записати відповідь</el-button>
    <el-button v-else type="primary" class="record-response" @click="$emit('stop-recording')">Готово</el-button>
    <div v-if="!editMode" class="result">{{result}}</div>
    <div>
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
    <el-button v-if="result && !isListening && !editMode" class="record-response" @click="editMode = true">Редагувати</el-button>
    <el-button v-if="editMode" class="record-response" @click="handleEditedResponse">Зберегти</el-button>
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
      console.log('here');
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
    result (result) {
      this.editedResult = result;
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
</style>
<style lang="scss" scoped>
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

span {
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
</style>
