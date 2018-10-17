import request from '@/utils/request'

export function login(phone, password, code) {
  return request({
    url: '/user/login',
    method: 'post',
    data: {
      phone,
      password,
      code
    }
  })
}

export function getMessage(phone) {
  return request({
    url: '/user/send-sms-code',
    method: 'post',
    data: {
      mobile: phone,
      call_type: 'login'
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/users/info',
    method: 'get',
    params: { token }
  })
}

export function logout(token) {
  return request({
    url: '/user/logout',
    method: 'post',
    params: { token }
  })
}
