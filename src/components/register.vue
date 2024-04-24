<template>
    <div>
      <h1>注册页面</h1>
      <form @submit.prevent="handleSubmit">
        <label for="username">用户名：</label>
        <input type="text" id="username" v-model="userData.username" required>
        <label for="password">密码：</label>
        <input type="password" id="password" v-model="userData.password" required>
        <button type="submit">注册</button>
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        userData: {
          username: '',
          password: ''
        }
      };
    },
    methods: {
      handleSubmit() {
        // 发送 POST 请求到后台
        axios.post('http://example.com/register', this.userData)
          .then(response => {
            console.log('注册成功');
            // 处理注册成功的逻辑
          })
          .catch(error => {
            console.error('注册失败', error);
            // 处理注册失败的逻辑
          });
      }
    }
  };
  </script>
  