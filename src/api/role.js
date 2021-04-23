import request from '@/utils/userRequest'

export function findPage(query) {
  return request({
    url: '/system/role/findPage',
    method: 'post',
    params: query
  })
}

export function orgFindPage(query) {
  return request({
    url: '/system/role/orgFindPage',
    method: 'post',
    params: query
  })
}

export function findAll() {
  return request({
    url: '/system/role/findAll',
    method: 'get'
  })
}

export function findByUserId(userId) {
  return request({
    url: '/system/role/findByUserId',
    method: 'post',
    params: userId
  })
}

export function getInfo(id) {
  return request({
    url: '/system/role/getInfo',
    method: 'get',
    params: { id }
  })
}

export function del(id) {
  return request({
    url: '/system/role/del',
    method: 'post',
    params: { id }
  })
}

export function delAll(data) {
  return request({
    url: '/system/role/delAll',
    method: 'post',
    data
  })
}

export function edit(query) {
  return request({
    url: '/system/role/edit',
    method: 'get',
    params: query
  })
}

export function save(data) {
  return request({
    url: '/system/role/save',
    method: 'post',
    data
  })
}
