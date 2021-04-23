import request from '@/utils/userRequest'

export function getList(query) {
  return request({
    url: '/system/menu/tableData',
    method: 'post',
    data: query
  })
}

export function getListAll() {
  return request({
    url: '/system/menu/tableData',
    method: 'post'
  })
}

export function findByModule(moduleId) {
  return request({
    url: '/system/menu/findByModule',
    method: 'post',
    data: { moduleId }
  })
}

export function findByModules(moduleIds) {
  return request({
    url: '/system/menu/findByModules',
    method: 'post',
    data: { moduleIds }
  })
}

export function findByRole(roleId) {
  return request({
    url: '/system/menu/findByRole',
    method: 'post',
    data: { roleId }
  })
}

export function getinfo(id) {
  return request({
    url: '/system/menu/info',
    method: 'get',
    params: { id }
  })
}

export function save(data) {
  return request({
    url: '/system/menu/save',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: '/system/menu/del',
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
    url: '/system/menu/change',
    method: 'post',
    data
  })
}

export function delBatch(data) {
  return request({
    url: '/system/menu/delBatch',
    method: 'post',
    data
  })
}

export function changeAll(data) {
  return request({
    url: '/system/menu/changeall',
    method: 'post',
    data
  })
}
