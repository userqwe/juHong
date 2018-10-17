import request from '@/utils/request'
import store from '../store'

export function operateLog(paramsObj) {
  return request({
    url: '/operationlog/list',
    method: 'get',
    params: {
      token: store.getters.token,
      page: paramsObj.currentPage,
      size: paramsObj.size,
      content: paramsObj.content,
      start_time: paramsObj.start_time,
      end_time: paramsObj.end_time
    }
  })
}

export function modify_pwd(paramsObj) {
  return request({
    url: '/user/changepwd',
    method: 'post',
    params: {
      token: store.getters.token
    },
    data: {
      old_password: paramsObj.oldPassword,
      new_password: paramsObj.pass,
      re_password: paramsObj.checkPass
    }
  })
}

export function getUserList(paramsObj) {
  return request({
    url: '/administration/list',
    method: 'get',
    params: {
      token: store.getters.token,
      page: paramsObj.currentPage,
      size: paramsObj.size,
      // name: paramsObj.name,
      // phone: paramsObj.phone,
      // staus: paramsObj.status,
      // role_id: paramsObj.role_id
    }
  })
}

export function getRoleList() {
  return request({
    url: '/administration/rolelist',
    method: 'get',
    params: {
      token: store.getters.token
    }
  })
}

export function modifyUserStatus(id) {
  return request({
    url: '/administration/status',
    method: 'post',
    params: {
      token: store.getters.token
    },
    data: {
      id: id
    }
  })
}

export function modifyUserInfo(user_info) {
  return request({
    url: '/administration/edit',
    method: 'post',
    params: {
      token: store.getters.token
    },
    data: user_info
  })
}

export function permissionList(group_id) {
  return request({
    url: '/administration/admin-group-permission-list',
    method: 'get',
    params: {
      token: store.getters.token,
      group_id: group_id
    }
  })
}

export function addNewUser(user_info) {
  return request({
    url: '/user/reg',
    method: 'post',
    params: {
      token: store.getters.token
    },
    data: {
      phone: user_info.phone,
      password: user_info.password,
      role_id: user_info.role_id
    }
  })
}

export function refreshCache(group_id) {
  return request({
    url: '/administration/reset-admin-group-permission-cache',
    method: 'get',
    params: {
      token: store.getters.token,
      group_id: group_id
    }
  })
}

export function savePermission(group_id, node_id) {
  return request({
    url: '/administration/admin-group-permission-save',
    method: 'post',
    params: {
      token: store.getters.token
    },
    data: {
      group_id: group_id,
      node_id: node_id
    }
  })
}
