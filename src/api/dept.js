import request from '@/utils/userRequest'

export function findByOrg(orgId) {
  return request({
    url: '/system/dept/findByOrg',
    method: 'post',
    data: { orgId }
  })
}

export function orgFindList() {
  return request({
    url: '/system/dept/orgFindList',
    method: 'post'
  })
}

export function getinfo(id) {
  return request({
    url: '/system/dept/info',
    method: 'get',
    params: { id }
  })
}

export function save(data) {
  return request({
    url: '/system/dept/save',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: '/system/dept/del',
    method: 'get',
    params: { id }
  })
}

export function change(id, field, value) {
  const data = {
    val: id,
    field: field,
    value: value
  }
  return request({
    url: '/system/dept/change',
    method: 'post',
    data
  })
}

export function delBatch(data) {
  return request({
    url: '/system/dept/delBatch',
    method: 'post',
    data
  })
}

export function changeAll(data) {
  return request({
    url: '/system/dept/changeall',
    method: 'post',
    data
  })
}
