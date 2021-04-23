import request from '@/utils/request'

export function findPage(query) {
  return request({
    url: '/building/findPage',
    method: 'post',
    params: query
  })
}

export function findAll() {
  return request({
    url: '/building/findAll',
    method: 'get'
  })
}

export function getInfo(id) {
  return request({
    url: '/building/getInfo',
    method: 'get',
    params: { id }
  })
}

export function getFloors(orgId) {
  return request({
    url: '/building/getFloors',
    method: 'get',
    params: { orgId }
  })
}

export function del(id) {
  return request({
    url: '/building/del',
    method: 'post',
    params: { id }
  })
}

export function delAll(data) {
  return request({
    url: '/building/delAll',
    method: 'post',
    data
  })
}

export function edit(query) {
  return request({
    url: '/building/edit',
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
