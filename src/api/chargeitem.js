import request from '@/utils/request'

export function findPage(query) {
  return request({
    url: '/fina/chargeitem/findPage',
    method: 'post',
    params: query
  })
}

export function findAll() {
  return request({
    url: '/fina/chargeitem/findAll',
    method: 'get'
  })
}

export function getInfo(id) {
  return request({
    url: '/fina/chargeitem/getInfo',
    method: 'get',
    params: { id }
  })
}

export function getItemPrices(orgId, chargeItemId) {
  return request({
    url: '/fina/chargeitem/getItemPrices',
    method: 'get',
    params: { orgId, chargeItemId }
  })
}

export function getChargeItemByOrg(orgId) {
  return request({
    url: '/fina/chargeitem/getChargeItemByOrg',
    method: 'get',
    params: { orgId }
  })
}

export function del(id) {
  return request({
    url: '/fina/chargeitem/del',
    method: 'post',
    params: { id }
  })
}

export function delAll(data) {
  return request({
    url: '/fina/chargeitem/delAll',
    method: 'post',
    data
  })
}

export function edit(query) {
  return request({
    url: '/fina/chargeitem/edit',
    method: 'get',
    params: query
  })
}

export function save(data) {
  return request({
    url: '/fina/chargeitem/save',
    method: 'post',
    data
  })
}
