export default {
    getIsLoading:(state) => state.isLoading,//获取全局loading状态
    getUserName:(state) => state.userName,
    getUserImg:(state) => state.userImg,
    getCompanyName:(state) => state.companyName,
    getCompanyEnglish:(state) => state.companyEnglish,
    getCompanyLogo:(state) => state.companyLogo,
    getPorts:(state) => state.ports,//请求路径
    getShowSidebar:(state) => state.showSideBar//请求路径
    
}