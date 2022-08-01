import request from '@/utils/request'
import qs from 'qs'
// 查询操作日志列表
export function sysLogList(page, query) {
  return request({
    url: '/sysLog/pageSysLogs',
    method: 'post',
    params: query,
    data:page
  })
}

// 删除操作日志
export function delOperlog(operId) {
  return request({
    url: '/monitor/operlog/' + operId,
    method: 'delete'
  })
}

// 清空操作日志
export function cleanOperlog() {
  return request({
    url: '/monitor/operlog/clean',
    method: 'delete'
  })
}
