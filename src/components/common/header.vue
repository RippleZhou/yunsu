<template>
    <div class="template">
        <el-row class="layout-header fixed" @mouseout="show_member=false">
            <el-col :span="24">
                <div class="top-nav-content clearfix">

                    <div class="top-nav-left fl">
                        <h1 class="logo fl"><img :src="img_url" /></h1>
                        <p class="nav-title fl">管理控制台</p>
                    </div>

                    <ul class="top-nav-right fr">

                        <li class="right-nav-items">
                            <span class="header-text">消息</span>
                            <span class="num">0</span>
                        </li>

                        <li class="right-nav-items rel" @mouseover="show_member = true">
                            <span class="header-text">{{user_name}}</span>
                            <span class="work-id rel">工号：{{job_number}}</span>
                            <div class="member-list hide abs">
                                <div class="member-list-items edit-password-items" @click="editPassword">修改密码</div>
                                <div class="member-list-items" @click="logout">退出登录</div>
                            </div> 
                        </li>

                        <li class="right-nav-items">
                            <span class="header-text">任务单</span>
                            <span class="num">0</span>
                        </li>
                    </ul>

                </div>
            </el-col>
        </el-row>

        <el-dialog
            title="修改密码"
            custom-class="pub-dialog edit-password-dialog"
            :visible.sync="edit_password">
            <div class="login-form-base edit-password">
                <el-form 
                    :inline="true"                                
                    :model="edit_form" >
                    <div class="login-form-shadow">
                        <el-form-item prop='username'>
                            原始密码：    
                            <el-input 
                                type="text" 
                                auto-complete="off" 
                                v-model="edit_form.oldPassword"></el-input>
                        </el-form-item>

                        <el-form-item prop='password' class="password" >
                            　新密码： 
                            <el-input 
                                type="password" 
                                auto-complete="off"
                                v-model="edit_form.password" ></el-input>
                        </el-form-item>

                        <el-form-item prop='password' class="confirm_password" >
                            确认密码：
                            <el-input 
                                type="password" 
                                auto-complete="off"
                                v-model="edit_form.confirmPassword"></el-input>
                        </el-form-item>
                    </div>

                    <el-form-item class="message">
                        <el-button class="btn btn-green" @click="surePassword()">保存</el-button>
                        <el-button class="btn btn-gray" @click="closePassword">关闭</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    export default {

        name:"header",

        created() {
            this.user_name = sessionStorage.getItem("name");
            this.job_number = sessionStorage.getItem("jobNumber");
        },

        data() {

            var validateOldPass = (rule, value, callback) => {
                if (!value) callback(new Error('请输入旧密码'));
                callback();
            }

            var validatePass = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('请输入新密码'));
                } else {
                    if (this.edit_form.oldPassword) {
                        this.$refs.edit_form.validateField('oldPassword');
                    }
                    callback();
                }
            }

            var validateConfirmPass = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('请确认密码'));
                } else {
                    if (this.edit_form.confirmPassword) {
                        this.$refs.edit_form.validateField('password');
                    }
                    callback();
                }
            }

            return {
                img_url: require( '../../assets/images/logo.png'),

                job_number: undefined,
                user_name: undefined,
                
                show_member : false,
                edit_password : false,

                edit_form : {
                    oldPassword : undefined,
                    password : undefined,
                    confirmPassword : undefined
                },
                
                login_rules: {
                    oldPassword: [
                        { validator: validateOldPass, trigger: 'blur' }
                    ],
                    password: [
                        { validator: validatePass, trigger: 'blur' }
                    ],
                    confirmPassword: [
                        { validator: validateConfirmPass, trigger: 'blur' }
                    ]
                }
            }
        },

        methods: {

            logout(){
                let that = this;

                that.$baseConfirm("确定退出登录？",function() {
                    that.$ajaxWrap({
                        url : "memberAccount/logout",
                        success(res){
                            if(res.success){
                                that.$baseWarn("退出成功！",function(){
                                    that.$goRoute("/");
                                })
                            }
                        }
                    });                    
                })
            },

            editPassword(){
                this.edit_password = true;
            },

            closePassword(){
                let that = this;
                that.edit_password = false;
                that.$clearObject(that.edit_form)
            },

            surePassword(){
                let that = this,
                    send_data = that.edit_form;

                that.$ajaxWrap({
                    type : "post",
                    url : "memberAccount/changePassword",
                    data : send_data,
                    success(res){
                        if(res.success){
                            that.$baseWarn("修改成功，返回登录页重新登录！",function(){
                                that.$goRoute("/");
                                that.$clearObject(that.edit_form);
                            })
                        }
                    }
                });
            }
        }
    }
</script>
<style lang="stylus">

@import "../../assets/css/common.styl"

/* variable */ 
$gf = #fff;
$g3 = #333;
$default_blue = #158cff;
$default_bd_blue = #0176d6;
$default_border_color = #e5e5e5;
$header_bgcolor = #383d41;
$header_bdcolor = #2c2d2f;
$header_hover_color = #2a2f32;
$icon_tips_bgcolor = #fd9a01;


$default_green = #a4d43e;
$default_bd_green = #85b61d;
$default_green_hover = #8bbc22;
$default_bd_green_hover = $default_bd_green;

$default_gray = #bdbdbd;
$default_bd_gray = #a6a6a6;
$default_gray_hover = #a9a9a9;
$default_bd_gray_hover = $default_bd_gray;

.layout-header
    z-index: 1
    width: 100%

.top-nav-content
    height: 50px
    color: $gf
    font-size: 14px
    line-height: 50px
    background-color: $header_bgcolor

    .top-nav-left
        .logo,
        .nav-title
            padding: 0 16px
        .nav-title
            border-right: 1px solid $header_bdcolor
            border-left: 1px solid $header_bdcolor

    .top-nav-right
        .right-nav-items
            float: left
            height: 50px
            font-size: 0
            border-left: 1px solid $header_bdcolor;
            &:first-child
                padding: 0 32px
            &:nth-child(2)
                padding: 0 25px
                &:hover
                    .member-list
                        display: block
                .work-id
                    padding-left: 16px
                    &::before
                        content: ""
                        position: absolute
                        left: 0
                        top: 50%
                        margin-top: -8px;
                        width: 2px
                        height: 16px
                        background-color: #717477                    
                .header-text
                    padding-right: 16px
            
            &:last-child
                padding: 0 50px
            &:hover
                background-color: $header_hover_color
        .fa,
        .num,
        .work-id,
        .header-text
            font-size: 14px
            border-radius: 2px
            display: inline-block
            vertical-align: middle
        .num
            height: 22px
            padding 0 7px
            margin-left: 6px
            text-align: center
            line-height: 22px
            background-color: $icon_tips_bgcolor
        
        .member-list
            top: 50px
            width: 100%
            color: $g3
            font-size: 12px
            line-height: 45px
            text-indent: 25px
            background-color: $gf
            border: 1px solid $default_border_color
            border-top: 0 none
            box-shadow: 0 0 5px $default_border_color
            .edit-password-items
                border-bottom: 1px solid $default_border_color
            .member-list-items
                &:hover
                    background-color: $default_border_color

.edit-password-dialog
    &.el-dialog
        width: 720px 
        background-color: $gf 
    .el-dialog__header
        padding: 10px 15px 
        background-color: $default_blue
        .el-dialog__title,
        .el-dialog__close
            color: $gf
            font-weight: 400
    .el-dialog__body
        padding 30px 0 0 0
        .login-form-shadow
            width: 260px;
            margin: 0 auto;
        .el-form-item
            margin: 0
            margin-bottom:30px

            .el-input
                width: 160px
                .el-input__inner
                    width: 160px
            &.password
                position: relative
                top: -1px
            &.confirm_password
                position: relative
                top: -2px
        .btn-wrap
            .btn-login
                width: 100%
                margin-top: 16px
                color: $gf
                border-radius : 0
                border-color: $default_bd_blue
                background-color: $default_blue
        .el-form-item__content
            width: 100%
        .el-input__inner
            border-radius: 0
    .message
        width: 100%
        text-align: center
        .btn
            width: 75px
            height: 30px
            padding: 0
            color: $gf
            line-height : 30px
            border-radius: 0 
            &.btn-green
                background-color: $default_green
                border-color: $default_bd_green
                &:hover
                    background-color: $default_green_hover
                    border-color: $default_bd_green_hover 
            &.btn-gray
                background-color: $default_gray
                border-color: $default_bd_gray
                &:hover
                    background-color: $default_gray_hover
                    border-color: $default_bd_gray_hover

</style>
