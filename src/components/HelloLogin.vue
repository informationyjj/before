<template>
    <div class="login-container">
      <div class="login-form">
        <h2>欢迎登录</h2>
        <form @submit.prevent="login">
          <div class="form-group">
            <input type="text" v-model="email" placeholder="邮箱" class="input-field">
          </div>
          <div class="form-group">
            <input type="password" v-model="password" placeholder="密码" class="input-field">
          </div>
          <button type="submit" class="btn-login">登录</button>
        </form>
        <p v-if="error" class="error-msg">{{ error }}</p>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios'
  export default {
    data() {
      return {
        email: '',
        password: '',
        error: ''
      };
    },
    methods: {
      login() {
  axios.post('http://localhost:8085/user/login', {
    email: this.email,
    password: this.password
  })
  .then(response => {
    // 处理登录成功逻辑，例如跳转到其他页面
    console.log(response.data.data);

    // 存储 token 到本地存储
    localStorage.setItem('token', response.data.data);
    console.log(localStorage.getItem('token'))

    // 使用 $router.push 进行路由跳转
    this.$router.push({ name: 'ShowBook' });
  })
  .catch(error => {
    // 处理登录失败逻辑，例如显示错误信息
    this.error = '登录失败，请检查用户名和密码';
    console.error(error);
  });
}

    }
  };
  </script>
  
  <style scoped>
  .login-container {
    background-image: url('https://source.unsplash.com/random/1920x1080');
    background-size: cover;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
  
  .login-form {
    background-color: rgba(255, 255, 255, 0.8);
    padding: 40px;
    border-radius: 10px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  }
  
  h2 {
    text-align: center;
    margin-bottom: 20px;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  .input-field {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  .btn-login {
    width: 100%;
    padding: 10px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .btn-login:hover {
    background-color: #0056b3;
  }
  
  .error-msg {
    color: red;
    text-align: center;
    margin-top: 10px;
  }
  </style>
  