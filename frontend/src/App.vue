<template>
  <div id="app">
    <header style="margin-top:0.5rem; margin-bottom:0.5rem;align-items:center;text-align:center;">
      <img src="./assets/nitc.png" style="height:50px;margin-right:0.5rem" />
      <img src="./assets/ieee.png" style="height:50px;margin-right:0.5rem" />
      <img src="./assets/ias-logo-lg.png" style="height:60px;" />
      <img src="./assets/comet.png" style="height:60px;" />
    </header>
    <div v-if="quizActive">
    <Login v-if="token==null && !this.success" :setLoading="setLoading" :onLogin="onLogin" />
    <Timer :submitAnswers="submitAnswers" v-if="token !== null && !this.success" />
    <Question
      :question="question"
      :count="count"
      :questionId="questionId"
      :onAnswer="onAnswer"
      v-if="token !== null && this.count <= 25 && !this.success"
    />
    <div v-if="this.success">
      <h1 style="margin-top:1rem">TechUp Lockdown</h1>
      <div class="success">
        <svg x="0px" y="0px" viewBox="0 0 512 512">
          <path
            d="M437.019,74.98C388.667,26.629,324.38,0,256,0C187.619,0,123.331,26.629,74.98,74.98C26.628,123.332,0,187.62,0,256s26.628,132.667,74.98,181.019C123.332,485.371,187.619,512,256,512c68.38,0,132.667-26.629,181.019-74.981C485.371,388.667,512,324.38,512,256S485.371,123.333,437.019,74.98z M256,482C131.383,482,30,380.617,30,256S131.383,30,256,30s226,101.383,226,226S380.617,482,256,482z"
          />
          <path
            d="M378.305,173.859c-5.857-5.856-15.355-5.856-21.212,0.001L224.634,306.319l-69.727-69.727c-5.857-5.857-15.355-5.857-21.213,0c-5.858,5.857-5.858,15.355,0,21.213l80.333,80.333c2.929,2.929,6.768,4.393,10.606,4.393c3.838,0,7.678-1.465,10.606-4.393l143.066-143.066C384.163,189.215,384.163,179.717,378.305,173.859z"
          />
        </svg>
        Answers submitted
      </div>
    </div>
    <div class="loading" v-if="this.loading">
      <div class="lds-dual-ring"></div>
    </div>
  </div>
  <div style="text-align:center" v-else>
      <h1 style="margin-top:1rem">TechUp Lockdown</h1>
      <p style="font-size:1.25rem; color:#fff"> The quiz is over now </p>
  </div>
  </div>

</template>
<style>
/*! minireset.css v0.0.6 | MIT License | github.com/jgthms/minireset.css */
html,
body,
p,
ol,
ul,
li,
dl,
dt,
dd,
blockquote,
figure,
fieldset,
legend,
textarea,
pre,
iframe,
hr,
h1,
h2,
h3,
h4,
h5,
h6 {
  margin: 0;
  padding: 0;
}
h1,
h2,
h3,
h4,
h5,
h6 {
  font-size: 100%;
  font-weight: normal;
}
ul {
  list-style: none;
}
button,
input,
select,
textarea {
  margin: 0;
}
html {
  box-sizing: border-box;
}
*,
*::before,
*::after {
  box-sizing: inherit;
}
img,
video {
  height: auto;
  max-width: 100%;
}
iframe {
  border: 0;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
}
td,
th {
  padding: 0;
}
td:not([align]),
th:not([align]) {
  text-align: left;
}

body {
  padding: 0.5rem;
  background: #252c4a;
  max-width: 400px;
  margin: auto;
  font-family: "Nunito", sans-serif;
}
h1 {
  color: #868fb4;
  font-size: 2.75rem;
  font-weight: bold;
  margin: 0;
  margin-bottom: 1rem;
}
button {
  display: block;
  outline: 0;
  margin: auto;
  background: #258aec;
  color: #fff;
  padding: 1rem 1.5rem;
  border-radius: 25px;
  cursor: pointer;
  font-size: 1.25rem;
  font-weight: bold;
  border: 0;
}
.loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #252c4a;
  display: flex;
  justify-content: center;
  align-items: center;
}
.success {
  margin: 1rem 0;
  margin-top: 2rem;
  background: #00d565;
  font-size: 2rem;
  padding: 2rem 1rem;
  text-align: center;
  border-radius: 20px;
  font-weight: bold;
  color: white;
}
.success svg {
  max-width: 10rem;
  display: block;
  margin: auto;
  fill: #fff;
  margin-bottom: 1rem;
}
.lds-dual-ring {
  display: inline-block;
  width: 80px;
  height: 80px;
}
.lds-dual-ring:after {
  content: " ";
  display: block;
  width: 64px;
  height: 64px;
  margin: 8px;
  border-radius: 50%;
  border: 6px solid #fff;
  border-color: #fff transparent #fff transparent;
  animation: lds-dual-ring 1.2s linear infinite;
}
@keyframes lds-dual-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.grecaptcha-badge { visibility: hidden; }
</style>
<script>
import Login from "./components/Login.vue";
import Question from "./components/Question.vue";
import Timer from "./components/Timer.vue";

export default {
  name: "App",
  components: {
    Login,
    Timer,
    Question
  },
  data() {
    return {
      questions: [],
      token: null,
      count: 0,
      question: {
        question: null,
        options: []
      },
      success: false,
      questionId: null,
      response: {},
      loading: false,
      quizActive: false,
    };
  },
  // mounted() {
  //   this.$recaptchaLoaded().then(() => this.loading = false)
  // },
  methods: {
    onLogin(token, questions) {
      this.loading = false;
      this.token = token;
      this.questions = questions;
      this.setRandomQuestion();
    },
    setLoading(state) {
      this.loading = state;
    },
    submitAnswers() {
      this.loading = true;
      fetch("https://quiz-nitcieee.herokuapp.com/api/submit", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.token
        },
        body: JSON.stringify(this.response)
      })
        .then(res => res.json())
        .then(() => {
          this.success = true;
          this.token = null;
          this.loading = false;
        })
        .catch(err => {
          this.success = false;
          this.token = null;
          this.loading = false;
          console.log(err);
        });
    },
    setRandomQuestion() {
      this.count++;
      let random = this.getRandomIndex();
      this.question = this.questions[random];
      this.question.options = this.question.options.sort(() => 0.5-Math.random());
      Reflect.deleteProperty(this.questions, random);
      this.questionId = random;
      return;
    },
    getRandomIndex() {
      return Object.keys(this.questions)[
        Math.floor(Math.random() * Object.keys(this.questions).length)
      ];
    },
    onAnswer(id, answer) {
      this.response[id] = answer;
      if (this.count >= 25) {
        this.submitAnswers();
        return;
      }
      this.setRandomQuestion();
    }
  }
};
</script>
