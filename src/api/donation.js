import request from '@/utils/request'

export function findPage(query) {
  return request({
    url: '/pen/donation/findPage',
    method: 'post',
    params: query
  })
}

export function findAll() {
  return request({
    url: '/pen/donation/findAll',
    method: 'get'
  })
}

export function findByOrg(orgId) {
  return request({
    url: '/pen/donation/findByOrg',
    method: 'get',
    params: { orgId }
  })
}

export function getInfo(id) {
  return request({
    url: '/pen/donation/getInfo',
    method: 'get',
    params: { id }
  })
}

export function del(id) {
  return request({
    url: '/pen/donation/del',
    method: 'post',
    params: { id }
  })
}

export function delAll(data) {
  return request({
    url: '/pen/donation/delAll',
    method: 'post',
    data
  })
}

export function edit(query) {
  return request({
    url: '/pen/donation/edit',
    method: 'get',
    params: query
  })
}

export function save(data) {
  return request({
    url: '/pen/donation/save',
    method: 'post',
    data
  })
}
