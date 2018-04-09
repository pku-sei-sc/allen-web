<template>
  <div class="infer">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>新增异常检测</span>
        <!--<el-button v-if="inference.status === 'Processing'" @click="queryProgress(inference.id)" style="float: right; padding: 5px 5px; margin-right: 10px" type="info">查看进度</el-button>-->
      </div>
      <el-form :model="addDetect" ref="addDetect">
        <el-form-item label="检测数据块1主题推断结果" :label-width="formLabelWidth" prop="manifestID1" :rules="{required: true, message: '检测数据块不能为空', trigger: 'blur'}">
          <el-select v-model="addDetect.manifestID1" placeholder="请选择" size="medium" style="width: 80%">
            <el-option
              v-for="inference in inferences"
              :key="inference.id"
              :label="'主题推断 '+ inference.id + ' 数据块 ' + inference.dataChunkId + ': ' + inference.manifestId"
              :value="inference.manifestId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="检测数据块2推断结果" :label-width="formLabelWidth" prop="manifestID2" :rules="{required: true, message: '检测数据块不能为空', trigger: 'blur'}">
          <el-select v-model="addDetect.manifestID2" placeholder="请选择" size="medium" style="width: 80%">
            <el-option
              v-for="inference in inferences"
              :key="inference.id"
              :label="'主题推断 '+ inference.id + ' 数据块 ' + inference.dataChunkId + ': ' + inference.manifestId"
              :value="inference.manifestId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="相似度计算方法" :label-width="formLabelWidth" prop="method" :rules="{required: true, message: '相似度计算方法不能为空', trigger: 'blur'}">
          <el-select v-model="addDetect.method" placeholder="请选择" size="medium" style="width: 80%">
            <el-option value="kl" label="KL散度"/>
            <el-option value="cosine" label="余弦相似度"/>
            <el-option value="inner" label="内积"/>
          </el-select>
        </el-form-item>
        <el-form-item label="Top" :label-width="formLabelWidth">
          <el-input v-model="addDetect.top" auto-complete="off" style="width: 80%"/>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="sendDetect()">确 定</el-button>
    </el-card>
  </div>
</template>

<script>
import _ from '../common'

export default {
  name: 'DetectManage',
  data () {
    return {
      inferences: [],
      dataChunks: [],
      topicModels: [],
      showAddModel: false,
      addDetect: {
        manifestID1: '',
        manifestID2: '',
        method: 'kl',
        top: null
      },
      formLabelWidth: '120px',
      timer: null
    }
  },
  mounted: function () {
    this.getAllInference()
    this.getAllModel()
    this.timer = setInterval(() => {
      this.getAllInference()
      this.getAllModel()
    }, 5000)
  },
  beforeDestroy: function () {
    clearInterval(this.timer)
  },
  filters: {
    getDate: val => {
      return _.getTimeStr(val)
    },
    getWholeDate: val => {
      return _.getTimeStr(val) + ' ' + _.getHourTime(val)
    }
  },
  methods: {
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
    getAllModel () {
      _.get('/topics-model/training').then(resp => {
        _.D(resp.data)
        this.topicModels = []
        // this.dataChunks = resp.data.reverse()
        for (let i in resp.data) {
          if (resp.data[i].status === 'Finished') {
            this.topicModels.unshift(resp.data[i])
          }
        }
      })
    },
    sendDetect () {
      this.$refs['addDetect'].validate(valid => {
        if (!valid) {
          return false
        }
        _.post('/ad/', this.addDetect, {}).then(resp => {
          _.D(resp.data)
        })
      })
    }
  }
}
</script>

<style scoped>
.infer {
  text-align: left;
  ;
}
.text {
  font-size: 14px;
}

.sql {
  margin-left: 10px;
  margin-bottom: 10px;
}

.item {
  margin-bottom: 14px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}

.box-card {
  /*width: 480px;*/
  margin: 10px 0;
  /*float: left;*/
}
</style>
