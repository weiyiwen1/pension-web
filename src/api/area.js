import request from '@/utils/request'

export function findPage(query) {
  return request({
    url: '/area/findPage',
    method: 'post',
    params: query
  })
}

export function findAll() {
  return request({
    url: '/area/findAll',
    method: 'get'
  })
}

export function findByOrg() {
  return request({
    url: '/area/findByOrg',
    method: 'get'
  })
}

export function getInfo(id) {
  return request({
    url: '/area/getInfo',
    method: 'get',
    params: { id }
  })
}

export function del(id) {
  return request({
    url: '/area/del',
    method: 'post',
    params: { id }
  })
}

export function delAll(data) {
  return request({
    url: '/area/delAll',
    method: 'post',
    data
  })
}

export function edit(query) {
  return request({
    url: '/area/edit',
    method: 'get',
    params: query
  })
}

export function save(data) {
  return request({
    url: '/area/save',
    method: 'post',
    data
  })
}
