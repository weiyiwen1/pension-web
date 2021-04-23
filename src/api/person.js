import request from '@/utils/userRequest'

export function findPage(query) {
  return request({
    url: '/person/findPage',
    method: 'post',
    params: query
  })
}

export function findAll() {
  return request({
    url: '/person/findAll',
    method: 'get'
  })
}

export function getInfo(id) {
  return request({
    url: '/person/getInfo',
    method: 'get',
    params: { id }
  })
}

export function del(id) {
  return request({
    url: '/person/del',
    method: 'post',
    params: { id }
  })
}

export function delAll(data) {
  return request({
    url: '/person/delAll',
    method: 'post',
    data
  })
}

export function edit(query) {
  return request({
    url: '/person/edit',
    method: 'get',
    params: query
  })
}

export function save(data) {
  return request({
    url: '/person/save',
    method: 'post',
    data
  })
}
