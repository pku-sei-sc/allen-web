<template>
  <div class="ad">
    <el-button type="primary" icon="el-icon-plus" @click="showAddForm = true">添加异常检测任务</el-button>
    <el-dialog title="新建异常检测任务" :visible.sync="showAddForm" width="80%">
      <el-form :model="addForm" ref="addForm">
        <el-form-item label="任务名" :label-width="formLabelWidth" :rules="{required: true, message: '任务名不能为空', trigger: 'blur'}">
          <el-input v-model="addForm.name"  auto-complete="off"  style="width: 80%"/>
        </el-form-item>
        <el-form-item label="输入数据块" :label-width="formLabelWidth" :rules="{required: true, message: '输入数据块不能为空', trigger: 'blur'}">
          <el-select v-model="addForm.dataChunkPacId" placeholder="请选择" size="medium" style="width: 80%">
            <el-option
              v-for="dataChunkPac in dataChunkPacs"
              :key="dataChunkPac.id"
              :label="dataChunkPac.id + ': ' + dataChunkPac.name"
              :value="dataChunkPac.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模型目录id" :label-width="formLabelWidth" prop="modelManifest" :rules="{required: true, message: '主题目录id不能为空', trigger: 'blur'}">
          <el-select v-model="addForm.modelManifest" placeholder="请选择" size="medium" style="width: 80%">
            <el-option
              v-for="topicModel in topicModels"
              :key="topicModel.id"
              :label="'主题模型 '+ topicModel.id + ': ' + topicModel.manifestId"
              :value="topicModel.manifestId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="相似度计算方法" :label-width="formLabelWidth" prop="method" :rules="{required: true, message: '相似度计算方法不能为空', trigger: 'blur'}">
          <el-select v-model="addForm.method" placeholder="请选择" size="medium" style="width: 80%">
            <el-option value="kl" label="KL散度"/>
            <el-option value="cosine" label="余弦相似度"/>
            <el-option value="inner" label="内积"/>
            <el-option value="mapping" label="匹配"/>
          </el-select>
        </el-form-item>
        <el-form-item label="模型是否reversed" :label-width="formLabelWidth" prop="modelManifest" :rules="{required: true, message: '是否reversed不能为空', trigger: 'blur'}">
          <el-select v-model="addForm.reversed" placeholder="请选择" size="medium" style="width: 80%">
            <el-option value="true" label="需要reverse"/>
            <el-option value="false" label="不需要reverse"/>
          </el-select>
        </el-form-item>
        <el-form-item label="预处理规则文件" :label-width="formLabelWidth">
          <el-input v-model="addForm.ruleFile" auto-complete="off" style="width: 80%"/>
        </el-form-item>
        <el-form-item label="阈值（mapping参数）" :label-width="formLabelWidth">
          <el-input v-model="addForm.threshold" auto-complete="off" style="width: 80%"/>
        </el-form-item>
        <el-form-item label="随机数种子" :label-width="formLabelWidth">
          <el-input v-model="addForm.randomSeed" auto-complete="off" style="width: 80%"/>
        </el-form-item>
        <el-form-item label="迭代次数" :label-width="formLabelWidth">
          <el-input v-model="addForm.numIterations" auto-complete="off" style="width: 80%"/>
        </el-form-item>
        <el-form-item label="BurnIn次数" :label-width="formLabelWidth">
          <el-input v-model="addForm.burnIn" auto-complete="off" style="width: 80%"/>
        </el-form-item>
        <el-form-item label="Thinning系数" :label-width="formLabelWidth">
          <el-input v-model="addForm.thinning" auto-complete="off" style="width: 80%"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showAddForm = false">取 消</el-button>
        <el-button type="primary" @click="sendAddTask()">确 定</el-button>
      </div>
    </el-dialog>

    <el-table :data="inferenceTaskPacs" style="width: 100%; padding: 5px 5px; margin-top: 15px">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="检测的数据块：">
              <span>{{props.row.dataChunkPacName}}</span>
            </el-form-item>
            <el-form-item label="使用方法：">
              <span>{{props.row.method}}</span>
            </el-form-item>
            <el-form-item label="选用模型：">
              <span>{{props.row.modelManifestId}}</span>
            </el-form-item>
            <el-form-item label="任务状态：">
              <span>{{props.row.status}}</span>
            </el-form-item>
            <!--<template v-if="props.row.status === 'Finished'">-->
              <!--<p/>-->
            <!--</template>-->
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="任务名" style="width: 15%"/>
      <el-table-column prop="dataChunkPacName" label="选用数据块名称" style="width: 25%"/>
      <el-table-column prop="status" label="数据导入状态" style="width: 10%"/>
      <el-table-column label="操作" style="width: 25%">
        <template slot-scope="scope">
          <el-button size="mini" @click="deleteTask(scope.row.id)"  type="danger">删除任务</el-button>
          <el-button size="mini" v-if="scope.row.status === 'Stopped'" @click="startInferenceTask(scope.row, true)" type="success">开始检测</el-button>
          <el-button size="mini" v-if="scope.row.status !== 'Stopped'" @click="startInferenceTask(scope.row, true)" type="danger">重新检测</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import _ from '../common'

export default {
  name: 'abnormal-detect',
  data () {
    return {
      showAddForm: false,
      dataChunkPacs: [],
      dataChunks: [],
      topicModels: [],
      inferenceTaskPacs: [],
      addForm: {
        name: '',
        dataChunkPacId: '',
        modelManifest: '',
        method: '',
        ruleFile: 'rule/rule.yml',
        randomSeed: null,
        numIterations: null,
        burnIn: null,
        thinning: null,
        top: null,
        reversed: 'false',
        threshold: ''
      },
      formLabelWidth: '200px'
    }
  },
  mounted: function () {
    this.getAllDataPac()
    this.getAllModel()
    this.getAllData()
    this.getAllInferenceTaskPac()
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
    getAllInferenceTaskPac () {
      _.get('/topics-model/inferencePac').then(resp => {
        _.D(resp.data)
        this.inferenceTaskPacs = resp.data.reverse()
      })
    },
    sendAddTask () {
      let para = {
        dataChunkPacId: this.addForm.dataChunkPacId,
        name: this.addForm.name,
        modelManifest: this.addForm.modelManifest,
        method: this.addForm.method,
        reversed: this.addForm.reversed,
        threshold: this.addForm.threshold,
        ruleFile: this.addForm.ruleFile,
        randomSeed: this.addForm.randomSeed,
        numIterations: this.addForm.numIterations,
        burnIn: this.addForm.burnIn,
        thinning: this.addForm.thinning,
        top: this.addForm.top
      }
      this.$refs['addForm'].validate(valid => {
        if (!valid) {
          return false
        }
        _.post('/topics-model/inferencePac', para, {}).then(resp => {
          _.D(resp.data)
          this.getAllInferenceTaskPac()
        })
      })
      this.showAddForm = false
    },
    // fixme
    startInferenceTask (inferencePac) {
      _.post('/topics-model/inferencePac/' + inferencePac.id + '/start ', {}).then(() => {
        inferencePac.status = 'Processing'
      })
    },
    // 获取datachunkpac Id
    getIndex (dataChunkPacId) {
      for (let index = 0; index < this.dataChunkPacs.length; index++) {
        if (this.dataChunkPacs[index].id === dataChunkPacId) {
          return index
        }
      }
    },
    deleteTask (id) {
      _.post('/topics-model/inferencePac/' + id + '/delete', {}).then(() => {
        this.getAllInferenceTaskPac()
      })
    }
  }
}
</script>

<style scoped>
.ad{
  text-align: left;
  ;
}
.el-table .warning-row {
  background: oldlace;
}

</style>
