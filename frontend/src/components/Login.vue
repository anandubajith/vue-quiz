<template>
  <div class="login" @submit.prevent="recaptcha">
    <h1>Corona Quiz</h1>
    <p>
      Please note that this is a timed quiz. You will get 10 mins to attempt 25 questions. Enter the following details. You will be mailed with your score and answers later.
      <br />
      <span
        style="color:gold;font-weight:bold;font-size:medium"
      >Note: Only NIT-Cians are eligible for prizes</span>
    </p>

    <form autocomplete="off2">
      <input type="text" v-model="name" placeholder="name" autocomplete="off" required />
      <input type="email" v-model="email" placeholder="email" autocomplete="off" required />
      <input
        type="text"
        v-model="phone"
        inputmode="numeric"
        autocomplete="off"
        pattern="[0-9]*"
        placeholder="phone"
      />
      <div class="check">
        <input type="checkbox" v-model="member" id="member" />
        <label for="member">I am an IEEE member</label>
      </div>
      <button type="submit">Start Quiz</button>
    </form>
    <div v-if="error" class="errors">{{ error }}</div>
  </div>
</template>
<style scoped>
button {
  margin-top: 2rem;
}
input {
  width: 100%;
  padding: 1rem;
  outline: 0;
  margin: 0.25rem 0;
  background: #ecf6ff;
  border: 3px solid #8a93b9;
  font-family: "Nunito";
  border-radius: 16px;
}
.errors {
  background: #ff3d58;
  margin: 1rem 0;
  margin-top: 2rem;
  font-size: 1.25rem;
  padding: 2rem 1rem;
  text-align: center;
  border-radius: 20px;
  font-weight: bold;
  color: #fff;
}
.danger {
  border: red;
}
h1 {
  color: #fff;
  margin-bottom: 0.5rem;
}
p {
  color: #959ec5;
  font-size: 1.25rem;
  margin-bottom: 1rem;
}
.check {
  font-size: 1.25rem;
  text-align: center;
  color: #959ec5;
  margin: 0.25rem 0;
}
input[type="checkbox"],
input[type="radio"] {
  position: absolute;
  opacity: 0;
  z-index: -1;
  max-width: 20px;
}
label {
  position: relative;
  display: inline-block;
  padding: 0 0 0 2em;
  height: 1.5em;
  line-height: 1.5;
  cursor: pointer;
}
label::before,
label::after {
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  width: 1.5em;
  height: 1.5em;
}
label::before {
  content: " ";
  border: 2px solid #bdc3c7;
  border-radius: 20%;
}
/* Checkbox */
input[type="checkbox"] + label::after {
  content: "\2714";
  color: #2c3e50;
  line-height: 1.5;
  text-align: center;
}
input[type="checkbox"]:checked + label::before,
input[type="radio"]:checked + label::before {
  background: #fff;
  border-color: #fff;
}
input[type="checkbox"] + label::after,
input[type="radio"] + label::after {
  -webkit-transform: scale(0);
  -ms-transform: scale(0);
  -o-transform: scale(0);
  transform: scale(0);
}
input[type="checkbox"]:checked + label::after,
input[type="radio"]:checked + label::after {
  -webkit-transform: scale(1);
  -ms-transform: scale(1);
  -o-transform: scale(1);
  transform: scale(1);
}
</style>
<script>
export default {
  name: "Login",
  props: {
    onLogin: Function,
    setLoading: Function
  },
  data() {
    return {
      name: null,
      email: null,
      phone: null,
      error: null,
      member: false
    };
  },
  methods: {
    async recaptcha() {
      this.setLoading(true);
      await this.$recaptchaLoaded();
      // Execute reCAPTCHA with action "login".
      this.token = await this.$recaptcha("login");
      this.doLogin();
    },
    doLogin() {
      if (!this.validate()) {
        return;
      }
      fetch("https://quiz-nitcieee.herokuapp.com/api/register", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: this.name,
          email: this.email,
          phone: this.phone,
          member: this.member,
          token: this.token
        })
      })
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            return response.text().then(text => {
              throw new Error(text);
            });
          }
        })
        .then(res => {
          this.onLogin(res.token, res.questions);
        })
        .catch(() => {
          // display errros
          this.setLoading(false);
          this.error = "Error: Invalid details";
        });
    },
    validate() {
      if (typeof this.name !== "string" || this.name.length == 0) {
        alert("Please enter name");
        return false;
      }
      if (typeof this.email != "string") {
        alert("Please enter valid email");
        return false;
      }
      if (
        this.phone == null ||
        !/^\d+$/.test(this.phone) ||
        this.phone.length != 10
      ) {
        alert("Please enter valid phone number 10 digit phone number");
        return false;
      }
      return true;
    }
  }
};
</script>
