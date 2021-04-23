import request from '@/utils/userRequest'

export function findPage(query) {
  return request({
    url: '/system/module/findPage',
    method: 'post',
    params: query
  })
}

export function findAll() {
  return request({
    url: '/system/module/findAll',
    method: 'get'
  })
}

export function findByOrg(orgId) {
  return request({
    url: '/system/module/findByOrg',
    method: 'post',
    params: { orgId }
  })
}

export function getInfo(id) {
  return request({
    url: '/system/module/getInfo',
    method: 'get',
    params: { id }
  })
}

export function del(id) {
  return request({
    url: '/system/module/del',
    method: 'post',
    params: { id }
  })
}

export function delAll(data) {
  return request({
    url: '/system/module/delAll',
    method: 'post',
    data
  })
}

export function edit(query) {
  return request({
    url: '/system/module/edit',
    method: 'get',
    params: query
  })
}

export function save(data) {
  return request({
    url: '/system/module/save',
    method: 'post',
    data
  })
}
