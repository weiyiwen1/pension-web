import request from '@/utils/request'

export function findPage(query) {
  return request({
    url: '/fina/bill/findPage',
    method: 'post',
    params: query
  })
}

export function findSettlePage(query) {
  return request({
    url: '/fina/bill/findSettlePage',
    method: 'post',
    params: query
  })
}

export function findGeneratePage(query) {
  return request({
    url: '/fina/bill/findGeneratePage',
    method: 'post',
    params: query
  })
}

export function getLastGenerate() {
  return request({
    url: '/fina/bill/getLastGenerate',
    method: 'post'
  })
}

export function getBill(id) {
  return request({
    url: '/fina/bill/getBill',
    method: 'post',
    params: { id }
  })
}

export function confirmSettle(id) {
  return request({
    url: '/fina/bill/confirmSettle',
    method: 'post',
    params: { id }
  })
}

export function findSettleList(data) {
  return request({
    url: '/fina/bill/findSettleList',
    method: 'post',
    data
  })
}

export function generateBill(data) {
  return request({
    url: '/fina/bill/generateBill',
    method: 'post',
    data
  })
}

export function getUnSettleCheckout(checkinNo) {
  return request({
    url: '/fina/bill/getUnSettleCheckout',
    method: 'post',
    params: { checkinNo }
  })
}

export function confirmCheckoutSettle(checkinNo) {
  return request({
    url: '/fina/bill/confirmCheckoutSettle',
    method: 'post',
    params: { checkinNo }
  })
}

export function getPageByCheckinNo(checkinNo) {
  return request({
    url: '/fina/accountRecord/getPageByCheckinNo',
    method: 'get',
    params: { checkinNo }
  })
}