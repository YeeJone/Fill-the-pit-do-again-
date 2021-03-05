import failPng from './images/fail.png'
import successPng from './images/success.png'
import pendingPng from './images/pending.png'

export const PENDING = 'PENDING'
export const SUCCESS = 'SUCCESS'
export const FAIL = 'FAIL'

export const defaultLayoutInfo = {
  stageWidth: 260, // 每个 stage 的宽度
  parallelSpacingH: 220,
  nodeSpacingV: 70, // job 之间上下间隔距离
  jobWidth: 200, // job 宽度
  curveRadius: 12, // 曲线 radius
  connectorStrokeWidth: 2, //链接曲线的宽度
  initTop: 55, // 起始 top 值
};
// job border 宽度
export const nodeStrokeWidth = 1

export const statusToImg = {
  PENDING: pendingPng,
  SUCCESS: successPng,
  FAIL: failPng
} 


export const mockData = [
  {
    title: '编译',
    jobs: [
      {
        name: '编译',
        status: SUCCESS,
        time: 120000
      }
    ]
  },
  {
    title: '部署',
    jobs: [
      {
        name: '部署',
        status: SUCCESS,
        time: 120000
      }
    ]
  },
  {
    title: '代码扫描和检查',
    jobs: [
      {
        name: 'STC',
        status: SUCCESS,
        time: 120000
      },
      {
        name: 'PMD',
        status: SUCCESS,
        time: 130000
      }
    ]
  },
  {
    title: '集成测试',
    jobs: [
      {
        name: '集成测试',
        status: FAIL,
        time: 140000
      },
      {
        name: '单元测试',
        status: PENDING,
        time: 140000
      },
      {
        name: 'E2E 测试',
        status: PENDING,
        time: 140000
      },
    ]
  },
]