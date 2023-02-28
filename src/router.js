import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/login'
import Home from './components/Home'
import Wellcome from './components/Wellcome'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: "/",
            redirect: '/login'
        },
        {
            path: "/login",
            component: Login,
        },
        {
            path: "/home", component: Home,
            redirect: "/wellcome",
            children: [
                {
                    path: "/wellcome",
                    component: Wellcome
                }
            ]
        }
    ]
})