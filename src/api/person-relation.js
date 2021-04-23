import request from '@/utils/request'

export function findPage(query) {
  return request({
    url: '/pen/personRelation/findPage',
    method: 'post',
    params: query
  })
}

export function findAll() {
  return request({
    url: '/pen/personRelation/findAll',
    method: 'get'
  })
}

export function getInfo(id) {
  return request({
    url: '/pen/personRelation/getInfo',
    method: 'get',
    params: { id }
  })
}

export function findByPersonId(personId) {
  return request({
    url: '/pen/personRelation/findByPersonId',
    method: 'get',
    params: { personId }
  })
}

export function del(id) {
  return request({
    url: '/pen/personRelation/del',
    method: 'post',
    params: { id }
  })
}

export function delAll(data) {
  return request({
    url: '/pen/personRelation/delAll',
    method: 'post',
    data
  })
}

export function save(data) {
  return request({
    url: '/pen/personRelation/save',
    method: 'post',
    data
  })
}
