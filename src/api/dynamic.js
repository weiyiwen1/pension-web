import request from '@/utils/request'

export function findPage(query) {
  return request({
    url: '/pen/dynamicForm/findPage',
    method: 'post',
    params: query
  })
}

export function findAll() {
  return request({
    url: '/pen/dynamicForm/findAll',
    method: 'get'
  })
}

export function findByOrg() {
  return request({
    url: '/pen/dynamicForm/findByOrg',
    method: 'get'
  })
}

export function getInfo(id) {
  return request({
    url: '/pen/dynamicForm/getInfo',
    method: 'get',
    params: { id }
  })
}

export function del(id) {
  return request({
    url: '/pen/dynamicForm/del',
    method: 'post',
    params: { id }
  })
}

export function delAll(data) {
  return request({
    url: '/pen/dynamicForm/delAll',
    method: 'post',
    data
  })
}

export function edit(query) {
  return request({
    url: '/pen/dynamicForm/edit',
    method: 'get',
    params: query
  })
}

export function save(data) {
  return request({
    url: '/pen/dynamicForm/save',
    method: 'post',
    data
  })
}
