import request from '@/utils/request'

export function findPage(query) {
  return request({
    url: '/pen/servicePersonal/findPage',
    method: 'post',
    params: query
  })
}

export function findAll() {
  return request({
    url: '/pen/servicePersonal/findAll',
    method: 'get'
  })
}

export function findByOrg(orgId) {
  return request({
    url: '/pen/servicePersonal/findByOrg',
    method: 'get',
    params: { orgId }
  })
}

export function getInfo(id) {
  return request({
    url: '/pen/servicePersonal/getInfo',
    method: 'get',
    params: { id }
  })
}

export function del(id) {
  return request({
    url: '/pen/servicePersonal/del',
    method: 'post',
    params: { id }
  })
}

export function delAll(data) {
  return request({
    url: '/pen/servicePersonal/delAll',
    method: 'post',
    data
  })
}

export function edit(query) {
  return request({
    url: '/pen/servicePersonal/edit',
    method: 'get',
    params: query
  })
}

export function save(data) {
  return request({
    url: '/pen/servicePersonal/save',
    method: 'post',
    data
  })
}
