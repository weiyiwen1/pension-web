import request from '@/utils/request'

export function findPage(query) {
  return request({
    url: '/serv/temporary/findPage',
    method: 'post',
    params: query
  })
}

export function findList(query) {
  return request({
    url: '/serv/temporary/findList',
    method: 'post',
    params: query
  })
}

export function findAll() {
  return request({
    url: '/serv/temporary/findAll',
    method: 'get'
  })
}

export function getInfo(id) {
  return request({
    url: '/serv/temporary/getInfo',
    method: 'get',
    params: { id }
  })
}

export function del(id) {
  return request({
    url: '/serv/temporary/del',
    method: 'post',
    params: { id }
  })
}

export function delAll(data) {
  return request({
    url: '/serv/temporary/delAll',
    method: 'post',
    data
  })
}

export function edit(query) {
  return request({
    url: '/serv/temporary/edit',
    method: 'get',
    params: query
  })
}

export function save(data) {
  return request({
    url: '/serv/temporary/save',
    method: 'post',
    data
  })
}
