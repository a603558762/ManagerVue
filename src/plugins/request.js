import axios from 'axios'

export function request(config) {
    //1.创建axios实例
    const instance = axios.create({
        baseURL: 'http://192.168.40.128:9000',
        timeout: 5000
    })

    //2.axios拦截器
    //2.1请求拦截
    instance.interceptors.request.use(config=>{
        //拦截操作 Authorization
        let token =  window.sessionStorage.getItem("token")

        if (token) config.headers.Authorization = "jwt " +token
        return config    //必须返回回去 否则调用处取不到
    },err=>{
        // console.log(err)
        return Promise.reject(err.request);
    })
    //2.2响应拦截
    instance.interceptors.response.use(res=>{
        //拦截操作
        // console.log("res:",res)
        return res //必须返回回去 否则调用处取不到
    },err=>{
         return Promise.reject(err.response);
        //console.log(err)
    })

    //3发送真正的网络请求【返回promise对象】
    return instance(config)
}