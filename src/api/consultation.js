import request from '@/utils/request'

export function findPage(query) {
  return request({
    url: '/pen/consultation/findPage',
    method: 'post',
    params: query
  })
}

export function findAll() {
  return request({
    url: '/pen/consultation/findAll',
    method: 'get'
  })
}

export function findByOrg(orgId) {
  return request({
    url: '/pen/consultation/findByOrg',
    method: 'get',
    params: { orgId }
  })
}

export function getInfo(id) {
  return request({
    url: '/pen/consultation/getInfo',
    method: 'get',
    params: { id }
  })
}

export function del(id) {
  return request({
    url: '/pen/consultation/del',
    method: 'post',
    params: { id }
  })
}

export function delAll(data) {
  return request({
    url: '/pen/consultation/delAll',
    method: 'post',
    data
  })
}

export function edit(query) {
  return request({
    url: '/pen/consultation/edit',
    method: 'get',
    params: query
  })
}

export function save(data) {
  return request({
    url: '/pen/consultation/save',
    method: 'post',
    data
  })
}
