import request from '@/utils/request'
import store from '../store'

export function getMaterialList(searchObj) {
  return request({
    url: '/material/list',
    method: 'get',
    params: {
      token: store.getters.token,
      page: searchObj.currentPage,
      type: searchObj.type,
      group_type: searchObj.group_type,
      name: searchObj.name,
      status: searchObj.status
    }
  })
}
export function editMaterial(materialObj) {
  return request({
    url: '/material/edit',
    method: 'post',
    params: {
      token: store.getters.token
    },
    data: {
      group_type: materialObj.classsify_id,
      name: materialObj.name,
      id: materialObj.material_id
    }
  })
}
export function recoverMaterial(id) {
  return request({
    url: '/material/recover',
    method: 'post',
    params: {
      token: store.getters.token
    },
    data: {
      id: id
    }
  })
}
export function delMaterial(id, status) {
  return request({
    url: '/material/del',
    method: 'post',
    params: {
      token: store.getters.token
    },
    data: {
      id: id,
      status: status
    }
  })
}

// 分类
export function getMaterialTypeList(page, size) {
  return request({
    url: '/materialtype/list',
    method: 'post',
    params: {
      token: store.getters.token,
      page: page,
      size: size
    }
  })
}

export function addMaterialType(name) {
  return request({
    url: '/materialtype/add',
    method: 'post',
    params: {
      token: store.getters.token
    },
    data: {
      name: name
    }
  })
}

export function editMaterialType(id, name) {
  return request({
    url: '/materialtype/edit',
    method: 'post',
    params: {
      token: store.getters.token
    },
    data: {
      name: name,
      id: id
    }
  })
}
