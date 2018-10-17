import Cookies from 'js-cookie'

const TokenKey = 'token'
const name = 'name'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getUserName() {
  return Cookies.get(name)
}

export function setUserName(uname) {
  return Cookies.set(name, uname)
}

export function removeUserName() {
  return Cookies.remove(name)
}
