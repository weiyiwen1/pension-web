import request from '@/utils/request'

export function findPage(query) {
  return request({
    url: '/nursinglevel/findPage',
    method: 'post',
    params: query
  })
}

export function findAll() {
  return request({
    url: '/nursinglevel/findAll',
    method: 'get'
  })
}

export function findByOrg(orgId) {
  return request({
    url: '/nursinglevel/findByOrg',
    method: 'get',
    params: { orgId }
  })
}

export function getInfo(id) {
  return request({
    url: '/nursinglevel/getInfo',
    method: 'get',
    params: { id }
  })
}

export function del(id) {
  return request({
    url: '/nursinglevel/del',
    method: 'post',
    params: { id }
  })
}

export function delAll(data) {
  return request({
    url: '/nursinglevel/delAll',
    method: 'post',
    data
  })
}

export function edit(query) {
  return request({
    url: '/nursinglevel/edit',
    method: 'get',
    params: query
  })
}

export function save(data) {
  return request({
    url: '/nursinglevel/save',
    method: 'post',
    data
  })
}
