import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import DataManage from '@/components/DataManage'
import ModelManage from '@/components/ModelManage'
import InferManage from '@/components/InferManage'
import DetectManage from '@/components/DetectManage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/data',
      name: 'DataManage',
      component: DataManage
    },
    {
      path: '/model',
      name: 'ModelManage',
      component: ModelManage
    },
    {
      path: '/infer',
      name: 'InferManage',
      component: InferManage
    },
    {
      path: '/detect',
      name: 'DetectManage',
      component: DetectManage
    }
  ]
})
