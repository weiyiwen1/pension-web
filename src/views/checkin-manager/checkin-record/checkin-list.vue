<template>
  <div class="app-container">
    <!-- 搜索 -->
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery" class="form-inline">
        <el-form-item label="">
          <el-input v-model="listQuery.name" placeholder="名称" clearable size="small" />
        </el-form-item>
        <el-form-item>
          <el-button v-waves type="primary" icon="el-icon-search" size="small" @click="handleFilter">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-waves type="warning" icon="el-icon-refresh" size="small" @click="handleFilterClear">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 表格 -->
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="入住号" min-width="70px">
        <template slot-scope="scope">
          {{ scope.row.checkinNo }}
        </template>
      </el-table-column>
      <el-table-column label="姓名" min-width="70px">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="手机号" min-width="100px">
        <template slot-scope="scope">
          {{ scope.row.mobile }}
        </template>
      </el-table-column>
      <el-table-column label="身份证" min-width="150px">
        <template slot-scope="scope">
          {{ scope.row.idcard }}
        </template>
      </el-table-column>
      <el-table-column label="床位" min-width="150px">
        <template slot-scope="scope">
          {{ scope.row.buildingName + scope.row.floorName + scope.row.bedName }}
        </template>
      </el-table-column>
      <el-table-column label="护理等级" min-width="100px">
        <template slot-scope="scope">
          {{ nursingLevelMap[scope.row.nursingLevelId] }}
        </template>
      </el-table-column>
      <el-table-column label="状态" min-width="50px">
        <template slot-scope="scope">
          {{ checkinStatus[scope.row.status] }}
        </template>
      </el-table-column>
      <el-table-column label="入住时间" min-width="90px">
        <template slot-scope="scope">
          {{ formatDate(scope.row.checkinDate, "yyyy-MM-dd") }}
        </template>
      </el-table-column>
      <el-table-column label="退住时间" min-width="90px">
        <template slot-scope="scope">
          {{ formatDate(scope.row.checkoutDate, "yyyy-MM-dd") }}
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination v-show="total>0" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.psize" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script>
import { findCheckinPage, del, edit, delAll } from '@/api/checkin'
import { findByOrg as findNursingLevel } from '@/api/nursinglevel'
import waves from '@/directive/waves'
import { pickerOptions, getArrByKey, formatDate } from '@/utils'

export default {
  name: 'CheckinList',
  components: { },
  directives: {
    waves
  },
  filters: {
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      selectedRows: null,
      listLoading: false,
      showSearch: false,
      listQuery: {
        page: 1,
        psize: 10,
        name: ''
      },
      nursingLevelList: [],
      nursingLevelMap: {},
      checkinStatus: {
        checking_in: '正在办理入住',
        already_check_in: '在住',
        checkout_apply: '办理退住',
        unsettled_accounts: '退住未结算',
        already_check_out: '退住'
      },
      buttonDisabled: true,
      deleting: false,
      pickerOptions: pickerOptions,
      currentIndex: -1
    }
  },
  watch: {
  },
  created() {
    this.findNursingLevel()
    this.fetchList()
  },
  methods: {
    fetchList() {
      this.listLoading = true
      findCheckinPage(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.totalRow
        this.listLoading = false
      })
    },
    findNursingLevel() {
      findNursingLevel().then(response => {
        this.nursingLevelList = response.data
        if (this.nursingLevelList.length > 0) {
          for (let i = 0; i < this.nursingLevelList.length; i++) {
            const nursingLevel = this.nursingLevelList[i]
            this.nursingLevelMap[nursingLevel.id] = nursingLevel.name
          }
        }
      })
    },
    formatDate(date, format) {
      if (!date) {
        return ''
      }
      return formatDate(new Date(date), format)
    },
    handleFilter() {
      this.listQuery.page = 1
      this.fetchList()
    },
    handleFilterClear() {
      this.listQuery = {
        page: 1,
        psize: 10,
        sort: 0,
        name: ''
      }
      this.fetchList()
    },
    handleSizeChange(val) {
      this.listQuery.psize = val
      this.fetchList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.fetchList()
    },
    handleModifyEnabled(index, id, enabled) {
      this.list[index]['enabled'] = 1 - enabled
      edit(id, 'enabled', 1 - enabled).then(response => {})
    },
    handleSelectionChange(val) {
      if (val.length > 0) {
        this.buttonDisabled = false
      } else {
        this.buttonDisabled = true
      }
      this.selectedRows = val
    },
    handleCreate() {
      this.$refs.formNursingLevel.handleCreate()
    },
    handleUpdate(index, id) {
      this.currentIndex = index
      this.$refs.formNursingLevel.handleUpdate(id)
    },
    updateRow(temp) {
      if (this.currentIndex >= 0 && temp.id) {
        this.list.splice(this.currentIndex, 1, temp)
      } else {
        if (this.list.length >= 10) {
          this.list.pop()
        }
        this.list.push(temp)
        this.total = this.total + 1
      }
      this.currentIndex = -1
    },
    handleDelete(index, id) {
      const _this = this
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _this.$set(_this.list[index], 'delete', true)
        del(id).then(response => {
          if (response.code === 20000) {
            _this.list.splice(index, 1)
            _this.total = _this.total - 1
            _this.$notify.success(response.message)
          } else {
            _this.$notify.error(response.message)
          }
          _this.$set(_this.list[index], 'delete', false)
        }).catch(() => {
          _this.$set(_this.list[index], 'delete', false)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleDeleteAll() {
      const _this = this
      if (this.selectedRows.length > 0) {
        this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.deleting = true
          const ids = getArrByKey(_this.selectedRows, 'id')
          const idstr = ids.join(',')
          delAll({ ids: idstr }).then(response => {
            if (response.code === 20000) {
              const delindex = []
              _this.list.forEach(function(item, index, input) {
                if (ids.indexOf(item.id) > -1) {
                  delindex.push(index)
                }
              })
              for (let i = delindex.length - 1; i >= 0; i--) {
                _this.list.splice(delindex[i], 1)
              }
              _this.total = _this.total - delindex.length
              _this.$message.success(response.message)
            } else {
              _this.$message.error(response.message)
            }
            _this.deleting = false
          }).catch(() => {
            _this.deleting = false
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      } else {
        _this.$message.error('请选择要删除的数据')
      }
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
	.text-red{
		color: red;
		cursor: pointer;
	}
	.text-green{
		color: green;
		cursor: pointer;
	}
</style>
