import request from '@/utils/request'

export function findPage(query) {
  return request({
    url: '/fina/accountRecord/findPage',
    method: 'post',
    params: query
  })
}

export function findListByCheckinNo(data) {
  return request({
    url: '/fina/accountRecord/findListByCheckinNo',
    method: 'post',
    data
  })
}

export function getNexPayNo() {
  return request({
    url: '/fina/accountRecord/getNexPayNo',
    method: 'get'
  })
}

export function findAll() {
  return request({
    url: '/fina/accountRecord/findAll',
    method: 'get'
  })
}

export function getInfo(id) {
  return request({
    url: '/fina/accountRecord/getInfo',
    method: 'get',
    params: { id }
  })
}

export function del(id) {
  return request({
    url: '/fina/accountRecord/del',
    method: 'post',
    params: { id }
  })
}

export function delAll(data) {
  return request({
    url: '/fina/accountRecord/delAll',
    method: 'post',
    data
  })
}

export function edit(query) {
  return request({
    url: '/fina/accountRecord/edit',
    method: 'get',
    params: query
  })
}

export function payin(data) {
  return request({
    url: '/fina/accountRecord/payin',
    method: 'post',
    data
  })
}

export function refund(id) {
  return request({
    url: '/fina/accountRecord/refund',
    method: 'get',
    params: { id }
  })
}
