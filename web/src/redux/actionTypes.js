/**
 * 动作定义
 */
export default{
    create:(type,data)=>{
        return {type,data};
    },
    //记录是不是第一次打开页面
    SET_VIEW_IS_MOUNT:Symbol(` SET_VIEW_IS_MOUNT`),
    //左边栏是否折叠
    COLLAPSED_VIEW_SIDER:Symbol(`COLLAPSED_VIEW_SIDER`),
    //设置登录状态
    SET_LOGIN_STATE:Symbol(`SET_LOGIN_STATE`),
    //身份失效后恢复操作队列
    DO_LOGIN_CALLBACK:Symbol(`DO_LOGIN_CALLBACK`)
}