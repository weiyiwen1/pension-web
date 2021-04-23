<template>
  <div class="app-container">
    <el-row>
      <el-col :span="6" style="padding-right:10px;">
        <el-card class="box-card" shadow="never">
          <div slot="header">
            <span>老人信息</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="selectElder">选择</el-button>
          </div>
          <div class="input-wapper">
            <el-input v-model="elder.name" :readonly="true">
              <template slot="prepend"><span class="input-label">姓名</span></template>
            </el-input>
          </div>
          <div class="input-wapper">
            <el-input v-model="elder.idcard">
              <template slot="prepend"><span class="input-label">身份证</span></template>
            </el-input>
          </div>
          <div class="input-wapper">
            <el-input v-model="elder.mobile">
              <template slot="prepend"><span class="input-label">电话</span></template>
            </el-input>
          </div>
          <div class="input-wapper">
            <el-input v-model="elder.gender" :readonly="true">
              <template slot="prepend"><span class="input-label">性别</span></template>
            </el-input>
          </div>
          <div class="input-wapper">
            <el-input v-model="elder.age" :readonly="true">
              <template slot="prepend"><span class="input-label">年龄</span></template>
            </el-input>
          </div>
        </el-card>
      </el-col>
      <el-col :span="18">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="体温" name="first">
            <temperature ref="temperature" />
          </el-tab-pane>
          <el-tab-pane label="血压" name="second">
            <bloodPressure ref="bloodPressure" />
          </el-tab-pane>
          <el-tab-pane label="血氧" name="third">血氧</el-tab-pane>
          <el-tab-pane label="心率" name="fourth">心率</el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
    <selectElder ref="selectElder" @confirmSelectElder="confirmSelectElder" />
  </div>
</template>
<script>
import selectElder from './select-elder'
import temperature from './temperature'
import bloodPressure from './blood-pressure'

export default {
  components: { selectElder, temperature, bloodPressure },
  data() {
    return {
      activeName: 'first',
      elder: {}
    }
  },
  methods: {
    handleClick(tab, event) {
      if (tab.name === 'first') {
        this.$refs.temperature.showChart()
      } else if (tab.name === 'second') {
        this.$refs.bloodPressure.showChart()
      }
    },
    selectElder() {
      this.$refs.selectElder.handleCreate()
    },
    confirmSelectElder(elder) {
      this.elder = elder
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
  .el-card__header{
    padding:8px 15px;
    font-size: 14px;
  }
  .input-wapper{
    width:100%;
    margin-bottom:10px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .input-label{
    display: block;
    text-align: right;
    width:40px;
    line-height:24px;
    font-size: 12px;
  }
</style>
