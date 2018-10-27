import http from "api/base.js"

//市场中心--市场管理
export let marketList = (data, self) => {
    return http.fetchPost('/market-mgr/list', data, self)
}

export let saveOrUpdateMarket = (data, self) => {
    return http.fetchPost('/market-mgr/save-or-update', data, self)
}

export let deletMarket = (data, self) => {
    return http.fetchPost('/market-mgr/delete', data, self)
}

export let ableOrDisableMarket = (data, self) => {
    return http.fetchPost('/market-mgr/able-or-disable', data, self)
}
