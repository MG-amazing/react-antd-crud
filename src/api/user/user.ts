import request from '@/utils/request'

export function listTFormReact(params: any) {
    return request({
        url: '/system/formReact/list',
        method: 'get',
        params
    })
}

export function getTFormReact(id: number) {
    return request({
        url: `/system/formReact/${id}`,
        method: 'get'
    })
}

export function addTFormReact(data: any) {
    return request({
        url: '/system/formReact',
        method: 'post',
        data
    })
}

export function updateTFormReact(data: any) {
    return request({
        url: '/system/formReact',
        method: 'put',
        data
    })
}

export function deleteTFormReact(ids: number[]) {
    return request({
        url: `/system/formReact/${ids.join(',')}`,
        method: 'delete'
    })
}

export function exportTFormReact(params: any) {
    return request({
        url: '/system/formReact/export',
        method: 'post',
        data: params,
        responseType: 'blob'
    })
}
