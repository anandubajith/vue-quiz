<template>
  <div class="login" @submit.prevent="doLogin">
    <div class="header">
      <h1>TechUp Lockdown</h1>
      <span
        style="font-size:13px;font-weight:bold"
      >Phase 2 of COMET initiative by Kerala Jt.Chapter IA/IE/PELS.</span>
    </div>

    <p>
      Please note that this is a timed quiz. You will get 10 mins to attempt 25 questions. Enter the following details. You will be mailed with your score and answers later.
      <br />
      <span
        style="color:gold;font-weight:bold;font-size:medium"
      >Note: Only NIT-Cians are eligible for prizes</span>
      <br />
    </p>

    <form autocomplete="off">
      <input type="text" v-model="name" placeholder="name" autocomplete="new-name" required />
      <input type="email" v-model="email" placeholder="email" autocomplete="new-email" required />
      <input
        type="text"
        v-model="phone"
        inputmode="numeric"
        autocomplete="new-phone"
        pattern="[0-9]*"
        placeholder="phone"
      />
      <div class="radio-outer">
        <label for="member" style="flex:1">Are you an IEEE Member?</label>
        <div class="radio-inner">
          <input type="radio" v-model="member" value="yes" id="yes" name="member" required />
          <label for="yes">Yes</label>
        </div>
        <div class="radio-inner">
          <input type="radio" v-model="member" value="no" id="no" name="member" required />
          <label for="no">No</label>
        </div>
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
.header h1 {
  margin-bottom: 0;
}
.header span {
  display: block;
  color:#8a93b9;
  margin-bottom: 0.5rem;;
}
p {
  color: #959ec5;
  font-size: 1.25rem;
  margin-bottom: 1rem;
}
.radio-outer {
  display: flex;
  width: 100%;
  align-items: center;
}
.radio-outer label {
  font-size: 1.25rem;
  color: #959ec5;
}
.radio-inner {
  display: flex;
  /* background: red; */
  align-items: center;
  font-size: 1.25rem;
  padding: 0.5rem;
  margin: 0 0.25rem;
}
.radio-inner input {
  margin-right: 0.25rem;
  width: auto;
}
input[type="radio"] {
  border: 0px;
  min-width: 1.5em;
  height: 1.5em;
  width: 100%;
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
    // async recaptcha() {
    //   this.setLoading(true);
    //   await this.$recaptchaLoaded();
    //   // Execute reCAPTCHA with action "login".
    //   this.token = await this.$recaptcha("login");
    //   this.doLogin();
    // },
    doLogin() {
      if (!this.validate()) {
        return;
      }
      this.setLoading(true);
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
          member: this.member === "yes",
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
