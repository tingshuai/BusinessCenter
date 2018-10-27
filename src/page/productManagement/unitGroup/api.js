import http from "api/base.js"

export let getUnitList = (data, self) => {//获取单位列表
    return http.fetchGet('unit-groups/list', data, self)
}