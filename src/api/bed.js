import request from '@/utils/request'

export function findPage(query) {
  return request({
    url: '/bed/findPage',
    method: 'post',
    params: query
  })
}

export function findAll() {
  return request({
    url: '/bed/findAll',
    method: 'get'
  })
}

export function getInfo(id) {
  return request({
    url: '/bed/getInfo',
    method: 'get',
    params: { id }
  })
}

export function getBedGradation(bedId) {
  return request({
    url: '/bed/getBedGradation',
    method: 'get',
    params: { bedId }
  })
}

export function del(id) {
  return request({
    url: '/bed/del',
    method: 'post',
    params: { id }
  })
}

export function delAll(data) {
  return request({
    url: '/bed/delAll',
    method: 'post',
    data
  })
}

export function edit(query) {
  return request({
    url: '/bed/edit',
    method: 'get',
    params: query
  })
}

export function save(data) {
  return request({
    url: '/bed/save',
    method: 'post',
    data
  })
}
