<template>
  <div class="show">
    <el-select v-model="inferenceTaskId" label="选择需要展示的结果" placeholder="请选择" size="medium" style="width: 80%">
      <el-option
        v-for = "inferenceTaskPac in inferenceTaskPacs"
        :key = "inferenceTaskPac.id"
        :label = "inferenceTaskPac.name + ': ' + inferenceTaskPac.method"
        :value = "inferenceTaskPac.id">
      </el-option>
    </el-select>
    <el-button type="primary" icon="el-icon-plus" @click="showGraph()">展示</el-button>
    <el-container :visble.sync="showForm">
      <div id="myChart" :style="{width: '300px', height: '300px'}"></div>
      <div id="myChart1" :style="{width: '300px', height: '300px'}"></div>
      <div id="myChart2" :style="{width: '300px', height: '300px'}"></div>
    </el-container>
  </div>
</template>

<script>
import _ from '../common'

export default {
  name: 'hello',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      showForm: false,
      dataChunkPacs: [],
      dataChunks: [],
      topicModels: [],
      inferenceTaskPacs: [],
      pre: [],
      recall: [],
      index: [],
      test: '',
      inferenceTaskId: '',
      formLabelWidth: '120px'
    }
  },
  mounted () {
    this.getAllModel()
    this.getAllDataPac()
    this.getAllInference()
    this.getAllInferenceTaskPac()
    this.getGraphData(this.inferenceTaskId)
  },
  methods: {
    getAllModel () {
      _.get('/topics-model/training').then(resp => {
        _.D(resp.data)
        this.topicModels = resp.data.reverse()
      })
    },
    getAllData () {
      _.get('/input/data').then(resp => {
        _.D(resp.data)
        // this.dataChunks = []
        this.dataChunks = resp.data.reverse()
        // for (let i in resp.data) {
        //   this.dataChunks.push(resp.data[i])
        // }
      })
    },
    getAllDataPac () {
      _.get('/input/datapac').then(resp => {
        _.D(resp.data)
        this.dataChunkPacs = resp.data.reverse()
      })
    },
    getAllInference () {
      _.get('/topics-model/inference').then(resp => {
        _.D(resp.data)
        this.inferences = []
        // this.dataChunks = resp.data.reverse()
        for (let i in resp.data) {
          if (resp.data[i].status === 'Finished') {
            this.inferences.unshift(resp.data[i])
          }
        }
      })
    },
    getAllInferenceTaskPac () {
      _.get('/topics-model/inferencePac').then(resp => {
        _.D(resp.data)
        this.inferenceTaskPacs = resp.data.reverse()
      })
    },
    getGraphData () {
      // let paras = {method: this.method}
      // _.get('/ad/showAdResult/', paras).then(resp => {
      _.get('/topics-model/showAdResult/?method=' + this.inferenceTaskId).then(resp => {
        _.D(resp.data)
        this.pre = resp.data[0]
        this.recall = resp.data[1]
        this.index = resp.data[2]
      })
    },
    drawLine () {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById('myChart'))
      // 绘制图表
      myChart.setOption({
        title: { text: '准确度-召回率' },
        tooltip: {},
        xAxis: {
          type: 'value',
          data: this.pre
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          name: '召回率',
          type: 'line',
          data: this.recall
        }]
      })

      let myChart1 = this.$echarts.init(document.getElementById('myChart1'))
      // 绘制图表
      myChart1.setOption({
        title: { text: '召回率' },
        tooltip: {},
        xAxis: {
          // type: 'value',
          data: this.index
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          name: '召回率',
          type: 'line',
          data: this.recall
        }]
      })

      let myChart2 = this.$echarts.init(document.getElementById('myChart2'))
      // 绘制图表
      myChart2.setOption({
        title: { text: '精确度' },
        tooltip: {},
        xAxis: {
          // type: 'value',
          data: this.index
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          name: '召回率',
          type: 'line',
          data: this.pre
        }]
      })
    },
    showGraph () {
      this.showForm = true
      _.get('/topics-model/showAdResult/' + this.inferenceTaskId).then(resp => {
        _.D(resp.data)
        this.pre = resp.data[0]
        this.recall = resp.data[1]
        this.index = resp.data[2]
        this.drawLine()
      })
    }
  }
}
</script>

<style scoped>

</style>
