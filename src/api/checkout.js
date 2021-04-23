import request from '@/utils/request'

export function findPage(query) {
  return request({
    url: '/pen/checkout/findPage',
    method: 'post',
    params: query
  })
}

export function findAll() {
  return request({
    url: '/pen/checkout/findAll',
    method: 'get'
  })
}

export function getInfo(id) {
  return request({
    url: '/pen/checkout/getInfo',
    method: 'get',
    params: { id }
  })
}

export function findByCheckinNo(checkinNo) {
  return request({
    url: '/pen/checkout/findByCheckinNo',
    method: 'get',
    params: { checkinNo }
  })
}

export function cancel(id) {
  return request({
    url: '/pen/checkout/cancel',
    method: 'post',
    params: { id }
  })
}

export function del(id) {
  return request({
    url: '/pen/checkout/del',
    method: 'post',
    params: { id }
  })
}

export function delAll(data) {
  return request({
    url: '/pen/checkout/delAll',
    method: 'post',
    data
  })
}

export function edit(query) {
  return request({
    url: '/pen/checkout/edit',
    method: 'get',
    params: query
  })
}

export function save(data) {
  return request({
    url: '/pen/checkout/save',
    method: 'post',
    data
  })
}
