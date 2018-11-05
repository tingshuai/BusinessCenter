import http from "api/base.js"

export let cloudCompanyList = (data, self) => { //列表查询
    return http.fetchPost('/warehouse/list', data, self)
}