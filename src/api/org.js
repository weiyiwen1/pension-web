import request from '@/utils/userRequest'

export function findPage(query) {
  return request({
    url: '/system/org/findPage',
    method: 'post',
    params: query
  })
}

export function findAll() {
  return request({
    url: '/system/org/findAll',
    method: 'get'
  })
}

export function getInfo(id) {
  return request({
    url: '/system/org/getInfo',
    method: 'get',
    params: { id }
  })
}

export function loginUserOrg() {
  return request({
    url: '/system/org/loginUserOrg',
    method: 'get'
  })
}

export function del(id) {
  return request({
    url: '/system/org/del',
    method: 'post',
    params: { id }
  })
}

export function delAll(data) {
  return request({
    url: '/system/org/delAll',
    method: 'post',
    data
  })
}

export function edit(query) {
  return request({
    url: '/system/org/edit',
    method: 'get',
    params: query
  })
}

export function save(data) {
  return request({
    url: '/system/org/save',
    method: 'post',
    data
  })
}
