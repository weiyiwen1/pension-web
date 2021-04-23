import request from '@/utils/request'

export function findPage(query) {
  return request({
    url: '/pen/reception/findPage',
    method: 'post',
    params: query
  })
}

export function findAll() {
  return request({
    url: '/pen/reception/findAll',
    method: 'get'
  })
}

export function findByOrg(orgId) {
  return request({
    url: '/pen/reception/findByOrg',
    method: 'get',
    params: { orgId }
  })
}

export function getInfo(id) {
  return request({
    url: '/pen/reception/getInfo',
    method: 'get',
    params: { id }
  })
}

export function del(id) {
  return request({
    url: '/pen/reception/del',
    method: 'post',
    params: { id }
  })
}

export function delAll(data) {
  return request({
    url: '/pen/reception/delAll',
    method: 'post',
    data
  })
}

export function edit(query) {
  return request({
    url: '/pen/reception/edit',
    method: 'get',
    params: query
  })
}

export function save(data) {
  return request({
    url: '/pen/reception/save',
    method: 'post',
    data
  })
}
