<template>
	<div class="app-container">
		<!-- 操作 -->
		<el-row style="margin-bottom: 10px;">
			<el-col :xs="24" :sm="24" :lg="24">
				<el-button-group>
					<el-button type="primary" icon="el-icon-plus" @click="handleCreate" />
				</el-button-group>
			</el-col>
		</el-row>

		<!-- 表格 -->
		<el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;">
			<el-table-column label="姓名" width="100px">
				<template slot-scope="scope">
					{{ scope.row.name }}
				</template>
			</el-table-column>
			<el-table-column label="与老人关系" width="100px">
				<template slot-scope="scope">
					{{ consultRela[scope.row.relation] }}
				</template>
			</el-table-column>
			<el-table-column label="担保人" width="80px">
				<template slot-scope="scope">
					{{ scope.row.guardianFlag | guardianFilter }}
				</template>
			</el-table-column>
			<el-table-column label="联系电话" width="110px" align="center">
				<template slot-scope="scope">
					{{ scope.row.phone }}
				</template>
			</el-table-column>
			<el-table-column label="身份证" width="110px" align="center">
				<template slot-scope="scope">
					{{ scope.row.idcard }}
				</template>
			</el-table-column>
			<el-table-column label="性别" width="80px" align="center">
				<template slot-scope="scope">
					{{ scope.row.gender | genderFilter }}
				</template>
			</el-table-column>
			<el-table-column label="住址" width="110px" align="center">
				<template slot-scope="scope">
					{{ scope.row.address }}
				</template>
			</el-table-column>
			<el-table-column label="操作" align="center" width="180px" class-name="small-padding">
				<template slot-scope="scope">
					<el-tooltip content="编辑" placement="top">
						<el-button v-waves type="primary" size="mini" @click="handleUpdate(scope.$index,scope.row.id)">编辑</el-button>
					</el-tooltip>
					<el-tooltip content="取消" placement="top">
						<el-button v-waves :loading="scope.row.delete" type="danger" size="mini" @click="handleDel(scope.$index,scope.row.id)">删除</el-button>
					</el-tooltip>
				</template>
			</el-table-column>
		</el-table>

		<!-- 表单 -->
		<personRelationForm ref="formPersonRelation" :person-id="personId" @updateRow="updateRow" />
	</div>
</template>

<script>
	import {
		findByPersonId,
		del
	} from '@/api/person-relation'
	import personRelationForm from './form'
	import waves from '@/directive/waves'

	export default {
		name: 'PersonRelation',
		components: {
			personRelationForm
		},
		directives: {
			waves
		},
		filters: {
			guardianFilter(guardian) {
				const guardianMap = {
					0: '否',
					1: '是'
				}
				return guardianMap[guardian]
			},
			genderFilter(gender) {
				const genderMap = {
					1: '男',
					2: '女'
				}
				return genderMap[gender]
			},
		},
		props: {
			personId: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				tableKey: 0,
				dialogFormVisible: false,
				list: null,
				listLoading: true,
				buttonDisabled: true,
				deleting: false,
				currentIndex: -1,
				consultRela: {
					father_son: '父子',
					oneself: '本人',
					mother_son: '母子',
					father_daughter: '父女',
					mother_daughter: '母女',
					brotherhood: '兄弟',
					brother_sister: '兄妹',
					sisterhood: '姐妹',
					sister_brother: '姐弟',
					marriage_bonds: '夫妻',
					other: '其他'
				}
			}
		},
		watch: {},
		created() {},
		methods: {
			fetchList() {
				this.listLoading = true
				findByPersonId(this.personId).then(response => {
					this.list = response.data
					this.listLoading = false
				})
			},
			handleFilter() {
				this.fetchList()
			},
			handleFilterClear() {
				this.fetchList()
			},
			personRelation() {
				this.dialogFormVisible = true
				this.fetchList()
			},
			closeDialog() {
				this.$emit('findBedList')
				this.dialogFormVisible = false
			},
			handleCreate() {
				this.$refs.formPersonRelation.handleCreate()
			},
			handleUpdate(index, id) {
				this.currentIndex = index
				this.$refs.formPersonRelation.handleUpdate(id)
			},
			updateRow(temp) {
				if (this.currentIndex >= 0 && temp.id) {
					this.list.splice(this.currentIndex, 1, temp)
				} else {
					if (this.list.length >= 10) {
						this.list.pop()
					}
					this.list.unshift(temp)
				}
				this.currentIndex = -1
			},
			handleDel(index, id) {
				const _this = this
				this.$confirm('此操作将取消该退住申请, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					_this.currentIndex = index
					_this.$set(_this.list[index], 'delete', true)
					del(id).then(response => {
						if (response.code === 20000) {
							_this.updateRow(response.data)
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
			}
		}
	}
</script>
<style rel="stylesheet/scss" lang="scss">
	.text-red {
		color: red;
		cursor: pointer;
	}

	.text-green {
		color: green;
		cursor: pointer;
	}
</style>
