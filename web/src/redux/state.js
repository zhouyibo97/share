import immutable from 'immutable';
export default immutable.fromJS({
    user_info:null,//保存用户信息
    //视图相关
    view:{
        viewLoading:false,//全屏加载中
        isMount:true,//第一次载入界面
        collapsed:false//左边栏折叠 

    },
    isLogin:false,//是否验证身份
    loginCallback:[]//login后自动回调队列 
})