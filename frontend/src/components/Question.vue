<template>
  <div>
    <header>
      <b>Question {{count}}</b>
      <span>/25</span>
    </header>
    <h1>{{question.question }}</h1>
    <div class="tag">{{ question.tag || "aaa"}}</div>
    <div v-if="question.options.length == 0">
      <input type="text" v-model="answer" placeholder="Enter your answer here" />
      <button @click="submitAnswer">Save</button>
    </div>
    <div v-else>
      <div
        :class="{'option': true, 'check': key===selected}"
        v-for="(option, key) in question.options"
        :key="key"
        @click="select(key)"
      >
        <div>{{ option}}</div>
        <svg
          v-if="key===selected"
          version="1.1"
          x="0px"
          y="0px"
          viewBox="0 0 512 512"
        >
          <path
            d="M437.019,74.98C388.667,26.629,324.38,0,256,0C187.619,0,123.331,26.629,74.98,74.98C26.628,123.332,0,187.62,0,256s26.628,132.667,74.98,181.019C123.332,485.371,187.619,512,256,512c68.38,0,132.667-26.629,181.019-74.981C485.371,388.667,512,324.38,512,256S485.371,123.333,437.019,74.98z M256,482C131.383,482,30,380.617,30,256S131.383,30,256,30s226,101.383,226,226S380.617,482,256,482z"
          />

          <path
            d="M378.305,173.859c-5.857-5.856-15.355-5.856-21.212,0.001L224.634,306.319l-69.727-69.727c-5.857-5.857-15.355-5.857-21.213,0c-5.858,5.857-5.858,15.355,0,21.213l80.333,80.333c2.929,2.929,6.768,4.393,10.606,4.393c3.838,0,7.678-1.465,10.606-4.393l143.066-143.066C384.163,189.215,384.163,179.717,378.305,173.859z"
          />
        </svg>
      </div>
      <button @click="submitAnswer">Submit</button>
    </div>
  </div>
</template>
<style scoped>
header {
  color: #8a93b9;
  font-size: 2rem;
  font-weight: 300;
  user-select: none;
}
header b {
  font-weight: bold;
}
header span {
  font-weight: normal;
}
h1 {
  color: #fff;
  font-size: 2rem;
  margin-top: 0.5rem;
  margin-bottom: 0.25rem;
  font-weight: bold;
  user-select: none;
}
.option {
  display: block;
  background: transparent;
  color: #fff;
  font-weight: normal;
  border-radius: 18px;
  border: 4px solid #22496a;
  margin-bottom: 1em;
  padding: 1em;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}
.option div {
  max-width: 90%;
}
.option svg {
  width: 24px;
  height: 24px;
  fill: #fff;
}
input {
  width: 100%;
  padding: 1rem;
  outline: 0;
  margin: 0.25rem 0;
  background: #ecf6ff;
  border: 3px solid #8a93b9;
  font-family: "Nunito";
  margin-bottom: 1em;
  border-radius: 16px;
}
.check {
  background: #00d565;
}
button {
  margin-bottom: 2rem;
}
.tag {
  border-radius: 5px;
  color:#8a93b9;
  padding: 4px;
  font-size: small;
  font-weight: bold;
  display:inline-block;
  background: #313a61;
  /* border: 1px solid #8a93b9; */
  margin-bottom: 1.5rem;
}
</style>
<script>
export default {
  props: {
    question: Object,
    questionId: String,
    onAnswer: Function,
    count: Number
  },
  data() {
    return {
      answer: null,
      selected: null
    };
  },
  methods: {
    submitAnswer() {
      this.onAnswer(this.questionId, this.answer);
      this.answer = null;
      this.selected = null;
    },
    select(key) {
      this.selected = key;
      this.answer = this.question.options[key];
    }
  }
};
</script>