import request from '@/utils/request'

export function findPage(query) {
  return request({
    url: '/pen/checkin/findPage',
    method: 'post',
    params: query
  })
}

export function findCheckinPage(data) {
  return request({
    url: '/pen/checkin/findCheckinPage',
    method: 'post',
    data
  })
}

export function findBirthdayList(data) {
  return request({
    url: '/pen/checkin/findBirthdayList',
    method: 'post',
    data
  })
}

export function findUnSettleCheckoutList(data) {
  return request({
    url: '/pen/checkin/findUnSettleCheckoutList',
    method: 'post',
    data
  })
}

export function findAll() {
  return request({
    url: '/pen/checkin/findAll',
    method: 'get'
  })
}

export function getInfo(id) {
  return request({
    url: '/pen/checkin/getInfo',
    method: 'get',
    params: { id }
  })
}

export function getByCheckinNo(checkinNo) {
  return request({
    url: '/pen/checkin/getByCheckinNo',
    method: 'get',
    params: { checkinNo }
  })
}

export function getPersonByIdcard(idcard) {
  return request({
    url: '/pen/checkin/getPersonByIdcard',
    method: 'get',
    params: { idcard }
  })
}

export function findBedList(floorId) {
  return request({
    url: '/pen/checkin/findBedList',
    method: 'get',
    params: { floorId }
  })
}

export function findChargeByCheckinNo(orgId, checkinNo) {
  return request({
    url: '/pen/checkin/findChargeByCheckinNo',
    method: 'get',
    params: { orgId, checkinNo }
  })
}

export function findExecCharge(data) {
  return request({
    url: '/pen/checkin/findExecCharge',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: '/pen/checkin/del',
    method: 'post',
    params: { id }
  })
}

export function delAll(data) {
  return request({
    url: '/pen/checkin/delAll',
    method: 'post',
    data
  })
}

export function edit(query) {
  return request({
    url: '/pen/checkin/edit',
    method: 'get',
    params: query
  })
}

export function saveCheckin(data) {
  return request({
    url: '/pen/checkin/saveCheckin',
    method: 'post',
    data
  })
}

export function saveCheckinCharge(data) {
  return request({
    url: '/pen/checkin/saveCheckinCharge',
    method: 'post',
    data
  })
}

export function confirmCheckin(data) {
  return request({
    url: '/pen/checkin/confirmCheckin',
    method: 'post',
    data
  })
}

export function confirmExecCharge(data) {
  return request({
    url: '/pen/checkin/confirmExecCharge',
    method: 'post',
    data
  })
}

export function isExecCharge(data) {
  return request({
    url: '/pen/checkin/isExecCharge',
    method: 'post',
    data
  })
}

export function confirmChangeBed(data) {
  return request({
    url: '/pen/checkin/confirmChangeBed',
    method: 'post',
    data
  })
}
