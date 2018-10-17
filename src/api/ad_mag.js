import request from '@/utils/request'
// import { getToken } from '@/utils/auth'
import store from '../store'

export function getPlanList(page, size) {
  return request({
    url: '/plan/list',
    method: 'get',
    params: {
      token: store.getters.token,
      page: page,
      size: size
    }
  })
}

export function getAreaList() {
  return request({
    url: '/area/list',
    method: 'get',
    params: {
      token: store.getters.token
    }
  })
}

export function newPlan(planName) {
  return request({
    url: '/plan/add',
    method: 'post',
    params: {
      token: store.getters.token
    },
    data: {
      plan_name: planName
    }
  })
}

export function changePlanStatus(planId, status) {
  return request({
    url: '/plan/status',
    method: 'post',
    params: {
      token: store.getters.token
    },
    data: {
      plan_id: planId,
      status: status
    }
  })
}

export function editPlan(plan_id, plan_name) {
  return request({
    url: '/plan/edit',
    method: 'post',
    params: {
      token: store.getters.token
    },
    data: {
      plan_name: plan_name,
      plan_id: +plan_id
    }
  })
}

export function planAdDetail(planId) {
  return request({
    url: '/ad/list',
    method: 'get',
    params: {
      token: store.getters.token,
      plan_id: planId
    }
  })
}

export function getAdDetail(ad_id) {
  return request({
    url: '/ad/detail',
    method: 'get',
    params: {
      token: store.getters.token,
      ad_id: ad_id
    }
  })
}

export function changeAdStatus(ad_id, status) {
  return request({
    url: '/ad/status',
    method: 'post',
    params: {
      token: store.getters.token
    },
    data: {
      ad_id: +ad_id,
      status: +status
    }
  })
}

export function adDetailPage(adId) {
  return request({
    url: '/ad/detail',
    method: 'get',
    params: {
      token: store.getters.token,
      ad_id: adId
    }
  })
}

export function addNewAd(data) {
  return request({
    url: '/ad/add',
    method: 'post',
    params: {
      token: store.getters.token
    },
    data: data
  })
}

export function editAd(data) {
  return request({
    url: '/ad/edit',
    method: 'post',
    params: {
      token: store.getters.token
    },
    data: data
  })
}

export function uploadUrl(url) {
  return request({
    url: '/material/upload',
    method: 'post',
    params: {
      token: store.getters.token
    },
    data: {
      url: url
    }
  })
}

// 获取节目单
export function showList(obj) {
  return request({
    url: '/ad/showtime',
    method: 'get',
    params: {
      token: store.getters.token,
      ...obj
    }
  })
}

// 关闭广告
export function stopAd(ad_id) {
  return request({
    url: '/ad/stop',
    method: 'post',
    params: {
      token: store.getters.token
    },
    data: {
      ad_id: ad_id
    }
  })
}
