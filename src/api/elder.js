import request from '@/utils/careRequest'

export function findPage(query) {
  return request({
    url: '/elder/findPage',
    method: 'post',
    params: query
  })
}

export function findAll() {
  return request({
    url: '/elder/findAll',
    method: 'get'
  })
}

export function getInfo(id) {
  return request({
    url: '/elder/getInfo',
    method: 'get',
    params: { id }
  })
}

export function del(id) {
  return request({
    url: '/elder/del',
    method: 'post',
    params: { id }
  })
}

export function delAll(data) {
  return request({
    url: '/elder/delAll',
    method: 'post',
    data
  })
}

export function edit(query) {
  return request({
    url: '/elder/edit',
    method: 'get',
    params: query
  })
}

export function save(data) {
  return request({
    url: '/elder/save',
    method: 'post',
    data
  })
}
