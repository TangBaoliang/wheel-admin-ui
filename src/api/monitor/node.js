import request from '@/utils/request'


export function zkLists() {
  return request({
    url: '/zk/zkLists',
    method: 'get',
  })
}
