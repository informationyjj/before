// router.js

// import Vue from 'vue';
import VueRouter from "vue-router";
import HelloLogin from '@/components/HelloLogin.vue'
import ShowBook from '@/components/ShowBook.vue'

// Vue.use(VueRouter);

export default new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/HelloLogin', // 默认重定向到登录页面
    },
    {
      path: '/HelloLogin',
      name: 'HelloLogin',
      component: HelloLogin,
    },
    {
      path: '/ShowBook',
      name: 'ShowBook',
      component: ShowBook,
    },
  ],
});
