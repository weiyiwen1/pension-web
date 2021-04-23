/**
 * xiegaolei
 */
import { objectMerge } from '@/utils'

// 递归格式化成多维数组
function listToTreeMulti(list, root = '0', pk = 'id', pid = 'parentId', child = 'children', other = null) {
  const tree = []
  if (list) {
    list.forEach(item => {
      if (item[pid] === root) {
        if (other !== null) {
          item = objectMerge(item, other)
        }
        const children = listToTreeMulti(list, item[pk], pk, pid, child, other)
        if (children.length) {
          item[child] = children
        }
        tree.push(item)
      }
    })
  }
  return tree
}

function listToTreeSelect(list, root = '0', pk = 'id', pid = 'parentId', child = 'children', other = null) {
  const tree = []
  if (list) {
    list.forEach(item => {
      if (item[pid] === root) {
        item.label = item.name
        if (other !== null) {
          item = objectMerge(item, other)
        }
        const children = listToTreeSelect(list, item[pk], pk, pid, child, other)
        if (children.length) {
          item[child] = children
        }
        tree.push(item)
      }
    })
  }
  return tree
}

function getParentsId(list, id, pk = 'id', pid = 'parentId') {
  let tree = []
  if (list) {
    list.forEach(item => {
      if (item[pk] === id) {
        tree.unshift(item[pid])
        const parent = getParentsId(list, item[pid], pk, pid)
        if (parent.length) {
          tree = tree.concat(parent)
        }
      }
    })
  }
  return tree
}

// 递归修改值
function upadteArr(arr, attr, val, source) {
  if (arr) {
    arr.map(item => {
      if (item[attr] === val) {
        objectMerge(item, source)
      } else {
        upadteArr(item.children, attr, val, source)
      }
    })
  }

  return arr
}

const tree = {
  listToTreeMulti,
  listToTreeSelect,
  getParentsId,
  upadteArr
}

export default tree

