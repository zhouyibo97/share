/**
 * http输出工具类
 * response:输出对象，必须有
 * content:返回的内容，可选
 */
class output {
    constructor(response, content) {
        //定义基本属性
        this.response = response;
        this.content = JSON.stringify(content);
        //类型定义
        this.ContentType = `application/json`;
        //状态
        this.status = 200;
        //创建后自动发送
        // setTimeout(() => {
        //     this.send();
        // }, 0)
    }
    //发送方法
    send(content) {
        if (content) {
            this.content = JSON.stringify(content);
        }
        this.response.writeHead(this.status, { 'content-type': this.ContentType });
        this.response.end(this.content);
        return this;
    }
    //参数错误
    praram_error(error) {
        if (error) {
            this.content = JSON.stringify(error);
        }
        this.status = 400;
        return this;
    }

    //需要登录
    unauthorized(error) {
        if (error) {
            this.content = JSON.stringify(error);
        }
        this.status = 401;
        return this;
    }

    //没有权限403
    forbidden(error) {
        if (error) {
            this.content = JSON.stringify(error);
        }
        this.status = 403;
        return this;
    }

    //404
    not_found(error) {
        if (error) {
            this.content = JSON.stringify(error);
        }
        this.status = 404;
        return this;
    }
    //500内部错误
    internal_error(error) {
        if (error) {
            this.content = JSON.stringify(error);
        }
        this.status = 500;
        return this;
    }


}
module.exports = function (response, content) {
    return new output(response, content);
}