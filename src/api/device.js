import request from '@/utils/request'
import store from '../store'

// 设备组

export function addDevGroup(group_name, template_id) {
  return request({
    url: '/devicegroup/add',
    method: 'post',
    params: {
      token: store.getters.token
    },
    data: {
      group_name: group_name,
      template_id: template_id
    }
  })
}

export function getDevGroupList(page, size) {
  return request({
    url: '/devicegroup/list',
    method: 'get',
    params: {
      token: store.getters.token,
      page: page,
      size: size
    }
  })
}

export function getBindDevGroupList(page, size) {
  return request({
    url: '/devicegroup/bindlist',
    method: 'get',
    params: {
      token: store.getters.token,
      page: page,
      size: size
    }
  })
}

export function editDevGroup(group_id, group_name, template_id) {
  return request({
    url: '/devicegroup/edit',
    method: 'post',
    params: {
      token: store.getters.token
    },
    data: {
      group_id: +group_id,
      group_name: group_name,
      template_id: +template_id
    }
  })
}

export function delDevGroup(group_id) {
  return request({
    url: '/devicegroup/delete',
    method: 'post',
    params: {
      token: store.getters.token
    },
    data: {
      group_id: +group_id
    }
  })
}

export function getCurrentGroupDevice(group_id) {
  return request({
    url: '/devicegroup/device',
    method: 'get',
    params: {
      token: store.getters.token,
      group_id: group_id
    }
  })
}

// 设备
export function newDevice(data) {
  return request({
    url: '/device/add',
    method: 'post',
    params: {
      token: store.getters.token
    },
    data: data
  })
}
export function activeDevice(device_name) {
  return request({
    url: '/iot/active',
    method: 'post',
    params: {
      token: store.getters.token
    },
    data: {
      device_name: device_name
    }
  })
}
export function getDeviceList(page, size) {
  return request({
    url: '/device/list',
    method: 'get',
    params: {
      token: store.getters.token,
      page: page,
      size: size
    }
  })
}
export function getDeviceDetail(device_id) {
  return request({
    url: '/device/detail',
    method: 'get',
    params: {
      token: store.getters.token,
      device_id: device_id
    }
  })
}
export function editDevice(data) {
  return request({
    url: '/device/edit',
    method: 'post',
    params: {
      token: store.getters.token
    },
    data: data
  })
}

// 将设备移除设备组
export function removeDeviceFromGroup(device_id, group_id) {
  return request({
    url: '/devicegroup/remove',
    method: 'post',
    params: {
      token: store.getters.token
    },
    data: {
      device_id: device_id,
      group_id: group_id
    }
  })
}

// 获取地区
export function getAreaList() {
  return request({
    url: '/area/list',
    method: 'get',
    params: {
      token: store.getters.token
    }
  })
}

// 模板
export function getTemplateList() {
  return request({
    url: '/devicetemp/list',
    method: 'get',
    params: {
      token: store.getters.token
    }
  })
}

