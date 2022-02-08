import TabsView from '@/layouts/tabs/TabsView'
import BlankView from '@/layouts/BlankView'
import PageView from '@/layouts/PageView'

// 路由配置
const options = {
  routes: [
    {
      path: '/login',
      name: '登录页',
      component: () => import('@/pages/login')
    },
    {
      path: '*',
      name: '404',
      component: () => import('@/pages/exception/404'),
    },
    {
      path: '/403',
      name: '403',
      component: () => import('@/pages/exception/403'),
    },
    {
      path: '/',
      name: '首页',
      component: TabsView,
      redirect: '/login',
      children: [
        {
          path: 'dashboard',
          name: '工作台',
          meta: {
            icon: 'dashboard'
          },
          component: BlankView,
          children: [
            {
              path: 'workplace',
              name: '工作台',
              meta: {
                page: {
                  closable: false
                },
                invisible: true
              },
              component: () => import('@/pages/dashboard/workplace'),
            },
            {
              path: 'analysis',
              name: '分析页',
              meta: {
                page: {
                  closable: false
                }
              },
              component: () => import('@/pages/dashboard/analysis'),
            }
          ]
        },
        {
          path: 'form',
          name: '表单页',
          meta: {
            icon: 'form',
            page: {
              cacheAble: false
            },
            invisible: true
          },
          component: PageView,
          children: [
            {
              path: 'basic',
              name: '基础表单',
              component: () => import('@/pages/form/basic'),
            },
            {
              path: 'step',
              name: '分步表单',
              component: () => import('@/pages/form/step'),
            },
            {
              path: 'advance',
              name: '高级表单',
              component: () => import('@/pages/form/advance'),
            }
          ]
        },
        {
          path: 'culture',
          name: '拍品',
          meta: {
            icon: 'table',
            invisible: false
          },
          component: PageView,
          children: [
            {
              path: 'list',
              name: '拍品包列表',
              meta: {
                // authority: 'queryForm',
              },
              component: () => import('@/pages/culture/list/productList'),
            },
            {
              path: 'detail',
              name: '拍品列表',
              meta: {
                invisible: true
                // authority: 'queryForm',
              },
              component: () => import('@/pages/culture/detail/productDetail'),
            },
            {
              path: 'add',
              name: '添加拍品',
              meta: {
                invisible: true
                // authority: 'queryForm',
              },
              component: () => import('@/pages/culture/add/addProduct'),
            },
            {
              path: 'innerDetail',
              name: '拍品详情',
              meta: {
                invisible: true
                // authority: 'queryForm',
              },
              component: () => import('@/pages/culture/detail/productInnerDetail'),
            }
          ]
        },
        {
          path: 'order',
          name: '订单',
          meta: {
            icon: 'table',
            invisible: false
          },
          component: PageView,
          children: [
            {
              path: 'list',
              name: '订单列表',
              meta: {
                // authority: 'queryForm',
              },
              component: () => import('@/pages/culture/list/orderList'),
            },
            {
              path: 'detail',
              name: '订单详情',
              meta: {
                invisible: true
                // authority: 'queryForm',
              },
              component: () => import('@/pages/culture/detail/orderDetail'),
            }
          ]
        },
        {
          path: 'article',
          name: '资讯',
          meta: {
            icon: 'table',
            invisible: false
          },
          component: PageView,
          children: [
            {
              path: 'list',
              name: '资讯列表',
              meta: {
                // authority: 'queryForm',
              },
              component: () => import('@/pages/culture/list/articleList'),
            },
            {
              path: 'detail',
              name: '资讯详情',
              meta: {
                invisible: true
                // authority: 'queryForm',
              },
              component: () => import('@/pages/culture/detail/articleDetail'),
            },
            {
              path: 'add',
              name: '上传资讯',
              meta: {
                // invisible: true
                // authority: 'queryForm',
              },
              component: () => import('@/pages/culture/add/addArticle'),
            }
          ]
        },
        {
          path: 'setting',
          name: '设置',
          meta: {
            icon: 'project',
            invisible: false
          },
          component: PageView,
          children: [
            {
              path: 'add',
              name: '添加/编辑自提点',
              meta: {
                invisible: true
                // authority: 'queryForm',
              },
              component: () => import('@/pages/culture/add/addSpot'),
            },
            {
              path: 'spot',
              name: '自提点',
              meta: {
                // authority: 'queryForm',
              },
              component: () => import('@/pages/culture/setting/spot'),
            },
            {
              path: 'manuInfo',
              name: '编辑企业信息',
              meta: {
                // authority: 'queryForm',
              },
              component: () => import('@/pages/culture/setting/manuInfo'),
            },
            {
              path: 'changePassword',
              name: '修改密码',
              meta: {
                invisible: true
                // authority: 'queryForm',
              },
              component: () => import('@/pages/culture/setting/changePassword'),
            }
          ]
        },
        {
          path: 'list',
          name: '列表页',
          meta: {
            icon: 'table',
            invisible: true
          },
          component: PageView,
          children: [
            {
              path: 'query',
              name: '查询表格',
              meta: {
                // authority: 'queryForm',
              },
              component: () => import('@/pages/list/QueryList'),
            },
            {
              path: 'query/detail/:id',
              name: '查询详情',
              meta: {
                highlight: '/list/query',
                invisible: true
              },
              component: () => import('@/pages/Demo')
            },
            {
              path: 'primary',
              name: '标准列表',
              component: () => import('@/pages/list/StandardList'),
            },
            {
              path: 'card',
              name: '卡片列表',
              component: () => import('@/pages/list/CardList'),
            },
            {
              path: 'search',
              name: '搜索列表',
              component: () => import('@/pages/list/search/SearchLayout'),
              children: [
                {
                  path: 'article',
                  name: '文章',
                  component: () => import('@/pages/list/search/ArticleList'),
                },
                {
                  path: 'application',
                  name: '应用',
                  component: () => import('@/pages/list/search/ApplicationList'),
                },
                {
                  path: 'project',
                  name: '项目',
                  component: () => import('@/pages/list/search/ProjectList'),
                }
              ]
            }
          ]
        },
        {
          path: 'details',
          name: '详情页',
          meta: {
            icon: 'profile',
            invisible: true
          },
          component: BlankView,
          children: [
            {
              path: 'basic',
              name: '基础详情页',
              component: () => import('@/pages/detail/BasicDetail')
            },
            {
              path: 'advance',
              name: '高级详情页',
              component: () => import('@/pages/detail/AdvancedDetail')
            }
          ]
        },
        {
          path: 'result',
          name: '结果页',
          meta: {
            icon: 'check-circle-o',
            invisible: true
          },
          component: PageView,
          children: [
            {
              path: 'success',
              name: '成功',
              component: () => import('@/pages/result/Success')
            },
            {
              path: 'error',
              name: '失败',
              component: () => import('@/pages/result/Error')
            }
          ]
        },
        {
          path: 'exception',
          name: '异常页',
          meta: {
            icon: 'warning',
            invisible: true
          },
          component: BlankView,
          children: [
            {
              path: '404',
              name: 'Exp404',
              component: () => import('@/pages/exception/404')
            },
            {
              path: '403',
              name: 'Exp403',
              component: () => import('@/pages/exception/403')
            },
            {
              path: '500',
              name: 'Exp500',
              component: () => import('@/pages/exception/500')
            }
          ]
        },
        {
          path: 'components',
          name: '内置组件',
          meta: {
            icon: 'appstore-o',
            invisible: true
          },
          component: PageView,
          children: [
            {
              path: 'taskCard',
              name: '任务卡片',
              component: () => import('@/pages/components/TaskCard')
            },
            {
              path: 'palette',
              name: '颜色复选框',
              component: () => import('@/pages/components/Palette')
            },
            {
              path: 'table',
              name: '高级表格',
              component: () => import('@/pages/components/table')
            }
          ]
        },
        {
          name: '验权表单',
          path: 'auth/form',
          meta: {
            icon: 'file-excel',
            authority: {
              permission: 'form'
            },
            invisible: true
          },
          component: () => import('@/pages/form/basic')
        },
        {
          name: '带参菜单',
          path: 'router/query',
          meta: {
            icon: 'project',
            query: {
              name: '菜单默认参数'
            },
            invisible: true
          },
          component: () => import('@/pages/Demo')
        },
        {
          name: '动态路由菜单',
          path: 'router/dynamic/:id',
          meta: {
            icon: 'project',
            params: {
              id: 123
            },
            invisible: true
          },
          component: () => import('@/pages/Demo')
        },
        {
          name: 'Ant Design Vue',
          path: 'antdv',
          meta: {
            icon: 'ant-design',
            link: 'https://www.antdv.com/docs/vue/introduce-cn/',
            invisible: true
          }
        },
        {
          name: '使用文档',
          path: 'document',
          meta: {
            icon: 'file-word',
            link: 'https://iczer.gitee.io/vue-antd-admin-docs/',
            invisible: true
          }
        }
      ]
    },
  ]
}

export default options
