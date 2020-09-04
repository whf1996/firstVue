import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Welcome from '../components/Welcome'
import User from '../components/User'
import Snow from '../components/Snow'
import Course from '../components/Course'
import Question from '../components/Question'
import Banner from '../components/Banner'
import Reservation from '../components/Reservation'
import joinUs from '../components/JoinUs'
import Order from '../components/Order'
import Refund from '../components/Refund'
import HistoryCourse from '../components/HistoryCourse'
import CoachCourse from '../components/CoachCourse'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      redirect: '/welcome',
      children: [{
        path: '/welcome',
        name: 'Welcome',
        component: Welcome
      }, {
        path: '/user',
        name: 'User',
        component: User
      }, {
        path: '/snow',
        name: 'Snow',
        component: Snow
      }, {
        path: '/course',
        name: 'Course',
        component: Course
      }, {
        path: '/question',
        name: 'Question',
        component: Question
      }, {
        path: '/banner',
        name: 'Banner',
        component: Banner
      }, {
        path: '/reservation',
        name: 'Reservation',
        component: Reservation
      }, {
        path: '/joinus',
        name: 'joinUs',
        component: joinUs
      }, {
        path: '/order',
        name: 'Order',
        component: Order
      }, {
        path: '/refund',
        name: 'Refund',
        component: Refund
      }, {
        path: '/adminCourse',
        name: 'HistoryCourse',
        component: HistoryCourse
      }, {
        path: '/coachCourse',
        name: 'CoachCourse',
        component: CoachCourse
      }]
    }
  ]
})
// 挂载路由导航守卫,前端路由中间件
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    return next()
  }
  this.user = JSON.parse(window.localStorage.getItem('user'))
  if (to.path !== '/coachCourse' && this.user.is_resident !== 2) {
    return next('/coachCourse')
  }
  // const token = window.sessionStorage.getItem('token')
  // if (!token) return next('/login')
  return next()
})
export default router
