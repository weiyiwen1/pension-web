import request from '@/utils/request'

export function findPage(query) {
  return request({
    url: '/pen/serviceUnit/findPage',
    method: 'post',
    params: query
  })
}

export function findAll() {
  return request({
    url: '/pen/serviceUnit/findAll',
    method: 'get'
  })
}

export function findByOrg(orgId) {
  return request({
    url: '/pen/serviceUnit/findByOrg',
    method: 'get',
    params: { orgId }
  })
}

export function getInfo(id) {
  return request({
    url: '/pen/serviceUnit/getInfo',
    method: 'get',
    params: { id }
  })
}

export function del(id) {
  return request({
    url: '/pen/serviceUnit/del',
    method: 'post',
    params: { id }
  })
}

export function delAll(data) {
  return request({
    url: '/pen/serviceUnit/delAll',
    method: 'post',
    data
  })
}

export function edit(query) {
  return request({
    url: '/pen/serviceUnit/edit',
    method: 'get',
    params: query
  })
}

export function save(data) {
  return request({
    url: '/pen/serviceUnit/save',
    method: 'post',
    data
  })
}
