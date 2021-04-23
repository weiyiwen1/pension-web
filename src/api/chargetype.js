import request from '@/utils/request'

export function findPage(query) {
  return request({
    url: '/fina/chargetype/findPage',
    method: 'post',
    params: query
  })
}

export function findAll() {
  return request({
    url: '/fina/chargetype/findAll',
    method: 'get'
  })
}

export function findByOrg(orgId) {
  return request({
    url: '/fina/chargetype/findByOrg',
    method: 'get',
    params: { orgId }
  })
}

export function getInfo(id) {
  return request({
    url: '/fina/chargetype/getInfo',
    method: 'get',
    params: { id }
  })
}

export function del(id) {
  return request({
    url: '/fina/chargetype/del',
    method: 'post',
    params: { id }
  })
}

export function delAll(data) {
  return request({
    url: '/fina/chargetype/delAll',
    method: 'post',
    data
  })
}

export function edit(query) {
  return request({
    url: '/fina/chargetype/edit',
    method: 'get',
    params: query
  })
}

export function save(data) {
  return request({
    url: '/fina/chargetype/save',
    method: 'post',
    data
  })
}
