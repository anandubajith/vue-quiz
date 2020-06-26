<template>
<div class="timer-outer">
  <div :class="{'timer-inner': true, 'danger': width<20}" :style="'width:'+width+'%'">
    <svg version="1.1" x="0px" y="0px" viewBox="0 0 510 510">
      <path
        style="fill-opacity:0.9;"
        d="M255,0C114.75,0,0,114.75,0,255s114.75,255,255,255s255-114.75,255-255S395.25,0,255,0z M255,459c-112.2,0-204-91.8-204-204S142.8,51,255,51s204,91.8,204,204S367.2,459,255,459z"
      />
      <polygon
        style="fill-opacity:0.9;"
        points="267.75,127.5 229.5,127.5 229.5,280.5 362.1,362.1 382.5,328.95 267.75,260.1 		"
      />
    </svg>
    <span>{{ time | prettify}}</span>
  </div>
</div>
</template>
<style scoped>
.timer-outer{
  width:100%;
  background:transparent;
  overflow:hidden;
  border: 4px solid #363d5e;
  margin: 1rem 0;
  border-radius: 27px;
}
.timer-inner {
  width: 100%;
  background: linear-gradient(90deg, #eb578b, #b46efa);
  padding: 0.5rem;
  display: flex;
  align-items: center;
  color: #fff;
  transition: 1s ease-in all;
  border-radius: 27px;
}
.danger {
  background: #ff3d58;
}
span {
  padding-left: 0.5rem;
  font-weight: bold;
}
svg {
  width: 24px;
  height: 24px;
  fill: #fff;
}
</style>
<script>
export default {
  props: {
    submitAnswers: Function
  },
  data() {
    return {
      time: 600,
      timer: null
    };
  },
  mounted() {
    this.timer = setInterval(() => {
      if (this.time > 0) {
        this.time--;
      } else {
        clearInterval(this.timer);
        this.handleTimeOut();
      }
    }, 1000);
  },
  filters: {
    prettify(v) {
      let minutes = Math.floor(v / 60);
      let seconds = v % 60;
      if (seconds < 10) {
        seconds = "0" + seconds;
      }
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      return minutes + ":" + seconds;
    }
  },
  computed: {
    width() {
      return this.time / 6;
    }
  },
  methods: {
    handleTimeOut() {
      this.submitAnswers();
    }
  }
};
</script>