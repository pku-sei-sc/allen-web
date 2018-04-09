<template>
  <div class="model">
    <el-button type="primary" icon="el-icon-plus" @click="showAddModel = true">添加</el-button>
    <el-dialog title="新建模型" :visible.sync="showAddModel" width="80%">
      <el-form :model="addModel" ref="addModel">
        <el-form-item label="输入数据块" :label-width="formLabelWidth" prop="dataChunkIds" :rules="{required: true, message: '输入数据块不能为空', trigger: 'blur'}">
          <el-select v-model="addModel.dataChunkIds" multiple placeholder="请选择" size="medium" style="width: 80%">
            <el-option
              v-for="dataChunk in dataChunks"
              :key="dataChunk.id"
              :label="'数据块 '+ dataChunk.id"
              :value="dataChunk.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="主题数目" :label-width="formLabelWidth" prop="totalTopics" :rules="{required: true, message: '主题数目不能为空', trigger: 'blur'}">
          <el-input v-model="addModel.totalTopics" auto-complete="off" style="width: 80%"/>
        </el-form-item>
        <el-form-item label="预处理规则文件" :label-width="formLabelWidth">
          <el-input v-model="addModel.ruleFile" auto-complete="off" style="width: 80%"/>
        </el-form-item>
        <el-form-item label="Alpha总和" :label-width="formLabelWidth">
          <el-input v-model="addModel.alphaSum" auto-complete="off" style="width: 80%"/>
        </el-form-item>
        <el-form-item label="Beta总和" :label-width="formLabelWidth">
          <el-input v-model="addModel.betaSum" auto-complete="off" style="width: 80%"/>
        </el-form-item>
        <el-form-item label="随机数种子" :label-width="formLabelWidth">
          <el-input v-model="addModel.randomSeed" auto-complete="off" style="width: 80%"/>
        </el-form-item>
        <el-form-item label="迭代次数" :label-width="formLabelWidth">
          <el-input v-model="addModel.numIteration" auto-complete="off" style="width: 80%"/>
        </el-form-item>
        <el-form-item label="后台打印主题间隔（迭代次数）" :label-width="formLabelWidth">
          <el-input v-model="addModel.showTopicsInterval" auto-complete="off" style="width: 80%"/>
        </el-form-item>
        <el-form-item label="后台打印主题词数（Top N）" :label-width="formLabelWidth">
          <el-input v-model="addModel.showTopicsNum" auto-complete="off" style="width: 80%"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showAddModel = false">取 消</el-button>
        <el-button type="primary" @click="sendAddModel()">确 定</el-button>
      </div>
    </el-dialog>
    <el-card v-for="topicModel in topicModels" :key="topicModel.id" class="box-card">
      <div slot="header" class="clearfix">
        <span>主题模型：{{topicModel.id}}</span>
        <el-button v-if="topicModel.status === 'Stopped'" @click="startTraining(topicModel, true)" style="float: right; padding: 5px 5px;" type="success">开始训练</el-button>
        <el-button v-if="topicModel.status !== 'Stopped'" @click="startTraining(topicModel, true)" style="float: right; padding: 5px 5px;" type="danger">重新训练</el-button>
        <el-button v-if="topicModel.status === 'Processing'" @click="queryProgress(topicModel.id)" style="float: right; padding: 5px 5px; margin-right: 10px" type="info">查看进度</el-button>
      </div>
      <div class="text item">创建时间：{{ topicModel.createTime | getWholeDate }}</div>
      <div class="text item">输入数据块：</div>
      <div v-for="(dataChunkId, idx) in topicModel.dataChunkIds" :key="idx" class="text sql">
        {{ dataChunkId }}
      </div>
      <div v-if="topicModel.ruleFile != null" class="text item">预处理规则：{{ topicModel.ruleFile }}</div>
      <div class="text item">主题数目：{{ topicModel.totalTopics }}</div>
      <div class="text item">Alpha总和：{{ topicModel.alphaSum }}</div>
      <div class="text item">Beta总和：{{ topicModel.betaSum }}</div>
      <div class="text item">模型随机数种子：{{ topicModel.randomSeed }}</div>
      <div class="text item">模型迭代次数：{{ topicModel.numIteration }}</div>
      <div class="text item">后台打印主题间隔（迭代次数）：{{ topicModel.showTopicsInterval }}</div>
      <div class="text item">后台打印主题词数（Top N）：{{ topicModel.showTopicsNum }}</div>
      <div class="text item">模型训练状态：{{ topicModel.status }}</div>
      <template v-if="topicModel.status === 'Finished'">
        <div class="text item">目录id：{{ topicModel.manifestId }}</div>
      </template>
    </el-card>
  </div>
</template>

<script>
import _ from '../common'

export default {
  name: 'ModelManage',
  data () {
    return {
      topicModels: [],
      dataChunks: [],
      dataSources: [],
      showAddModel: false,
      addModel: {
        dataChunkIds: [],
        totalTopics: '',
        ruleFile: 'rule/rule.yml',
        alphaSum: null,
        betaSum: null,
        randomSeed: null,
        numIteration: null,
        showTopicsInterval: null,
        showTopicsNum: null
      },
      formLabelWidth: '120px',
      timer: null
    }
  },
  mounted: function () {
    this.getAllModel()
    this.getAllData()
    this.timer = setInterval(() => {
      this.getAllModel()
      this.getAllData()
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
    getAllModel () {
      _.get('/topics-model/training').then(resp => {
        _.D(resp.data)
        this.topicModels = resp.data.reverse()
      })
    },
    getAllData () {
      _.get('/input/data').then(resp => {
        _.D(resp.data)
        this.dataChunks = []
        // this.dataChunks = resp.data.reverse()
        for (let i in resp.data) {
          if (resp.data[i].status === 'Finished') {
            this.dataChunks.unshift(resp.data[i])
          }
        }
      })
    },
    getAllSource () {
      _.get('/input/data-source').then(resp => {
        _.D(resp.data)
        this.dataSources = resp.data.reverse()
      })
    },
    sendAddModel () {
      this.$refs['addModel'].validate(valid => {
        if (!valid) {
          return false
        }
        // let params = {
        //   dataSourceId: this.addModel.source,
        //   sqls: sqlList,
        //   idName: this.addModel.idName,
        //   tokenName: this.addModel.tokenName,
        //   valueName: this.addModel.valueName
        // }
        _.post('/topics-model/training', this.addModel, {}).then(resp => {
          _.D(resp.data)
          this.getAllModel()
        })

        this.showAddModel = false
      })
    },
    startTraining (topicModel, forced) {
      _.post('/topics-model/training/' + topicModel.id + '/start', {
        forced: forced
      }).then(() => {
        // this.getAllData()
        topicModel.status = 'Processing'
      })
    },
    queryProgress (id) {
      _.get('/topics-model/' + id).then(resp => {
        alert(resp.data)
      }).catch(e => {
        _.D(e)
        alert(e.response.data.message)
      })
    }
  }
}
</script>

<style scoped>
.model {
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
