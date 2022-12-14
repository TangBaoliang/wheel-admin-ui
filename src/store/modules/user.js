import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import de from 'element-ui/src/locale/lang/de'
import { Message } from 'element-ui'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    permissions: [],
    userInfo: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    },
    SET_INFO: (state, info) => {
      state.userInfo = info
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      const password = userInfo.password
      const code = userInfo.code
      const uuid = userInfo.uuid
      return new Promise((resolve, reject) => {

        login(username, password, code, uuid).then(res => {
          if (!res['success']) {
            Message({
              message: res['errorMsg'],
              type: 'error',
              duration: 2 * 1000
            })
            return reject(new Error(""));
          }
          setToken(res['data']['token'])
          commit('SET_TOKEN', res['data']['token'])
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo().then(res => {
          const user = res['data']
          // const avatar = (user.avatar == "" || user.avatar == null) ? require("@/assets/images/profile.jpg") : process.env.VUE_APP_BASE_API + user.avatar;
          const avatar = require("@/assets/images/profile.jpg")
          // if (res.roles && res.roles.length > 0) { // 验证返回的roles是否是一个非空数组
          //   commit('SET_ROLES', res.roles)
          //   commit('SET_PERMISSIONS', res.permissions)
          // } else {
          commit('SET_ROLES', ['ROLE_DEFAULT'])
          // }
          commit('SET_NAME', user['userName'])
          commit('SET_AVATAR', avatar)
          commit('SET_INFO', user)
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 退出系统
    LogOut({ commit, state }) {
      removeToken();
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_PERMISSIONS', [])
          // removeToken()
          resolve()
        }).catch(error => {
          reject(error)
          commit('SET_TOKEN', '')
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        // removeToken()
        resolve()
      })
    }
  }
}

export default user
