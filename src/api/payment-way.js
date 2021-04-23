import request from '@/utils/request'

export function findPage(query) {
  return request({
    url: '/fina/paymentWay/findPage',
    method: 'post',
    params: query
  })
}

export function findAll() {
  return request({
    url: '/fina/paymentWay/findAll',
    method: 'get'
  })
}

export function findByOrg() {
  return request({
    url: '/fina/paymentWay/findByOrg',
    method: 'get'
  })
}

export function getInfo(id) {
  return request({
    url: '/fina/paymentWay/getInfo',
    method: 'get',
    params: { id }
  })
}

export function del(id) {
  return request({
    url: '/fina/paymentWay/del',
    method: 'post',
    params: { id }
  })
}

export function delAll(data) {
  return request({
    url: '/fina/paymentWay/delAll',
    method: 'post',
    data
  })
}

export function edit(query) {
  return request({
    url: '/fina/paymentWay/edit',
    method: 'get',
    params: query
  })
}

export function save(data) {
  return request({
    url: '/fina/paymentWay/save',
    method: 'post',
    data
  })
}
