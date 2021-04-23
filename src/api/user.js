import request from '@/utils/userRequest'

export function login(data) {
  return request({
    url: '/userLogin',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/userInfo',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/userLogout',
    method: 'post'
  })
}

export function fetchList(query) {
  return request({
    url: '/system/user/page',
    method: 'post',
    params: query
  })
}

export function orgFindPage(query) {
  return request({
    url: '/system/user/orgFindPage',
    method: 'post',
    params: query
  })
}

export function fetchAll(query) {
  return request({
    url: '/system/user/page',
    method: 'post',
    params: query
  })
}

export function userInfo(id) {
  return request({
    url: '/system/user/info',
    method: 'post',
    params: { id }
  })
}

export function save(data) {
  return request({
    url: '/system/user/save',
    method: 'post',
    data
  })
}

