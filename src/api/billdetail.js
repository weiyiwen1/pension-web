import request from '@/utils/request'

export function findPage(query) {
  return request({
    url: '/fina/billdetail/findPage',
    method: 'post',
    params: query
  })
}

export function floorBillDetailStatistics(data) {
  return request({
    url: '/fina/billdetail/floorBillDetailStatistics',
    method: 'post',
    data
  })
}

export function statisticsByCheckinNo(data) {
  return request({
    url: '/fina/billdetail/statisticsByCheckinNo',
    method: 'post',
    data
  })
}

export function findByCheckinNo(data) {
  return request({
    url: '/fina/billdetail/findListByCheckinNo',
    method: 'post',
    data
  })
}

export function findRefundByCheckinNo(data) {
  return request({
    url: '/fina/billdetail/findRefundListByCheckinNo',
    method: 'post',
    data
  })
}

export function findDetailPage(data) {
  return request({
    url: '/fina/billdetail/findDetailPage',
    method: 'post',
    data
  })
}

export function findRefundPage(data) {
  return request({
    url: '/fina/billdetail/findRefundPage',
    method: 'post',
    data
  })
}

export function confirmRefund(data) {
  return request({
    url: '/fina/billdetail/confirmRefund',
    method: 'post',
    data
  })
}
