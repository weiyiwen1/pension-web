import request from '@/utils/request'

export function findPage(query) {
  return request({
    url: '/pen/leave/findPage',
    method: 'post',
    params: query
  })
}

export function findAll() {
  return request({
    url: '/pen/leave/findAll',
    method: 'get'
  })
}

export function getInfo(id) {
  return request({
    url: '/pen/leave/getInfo',
    method: 'get',
    params: { id }
  })
}

export function findByCheckinNo(checkinNo) {
  return request({
    url: '/pen/leave/findByCheckinNo',
    method: 'get',
    params: { checkinNo }
  })
}

export function cancel(id) {
  return request({
    url: '/pen/leave/cancel',
    method: 'post',
    params: { id }
  })
}

export function del(id) {
  return request({
    url: '/pen/leave/del',
    method: 'post',
    params: { id }
  })
}

export function delAll(data) {
  return request({
    url: '/pen/leave/delAll',
    method: 'post',
    data
  })
}

export function edit(query) {
  return request({
    url: '/pen/leave/edit',
    method: 'get',
    params: query
  })
}

export function save(data) {
  return request({
    url: '/pen/leave/save',
    method: 'post',
    data
  })
}
