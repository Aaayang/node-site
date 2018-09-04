$(function() {
    const Index = function() {
        function init() {
            this.$loginChange = $('#js-login-change');
            this.$loginTitle = $('#js-login-title');
            this.$loginOrRegBtn = $('#js-loginorreg-btn');
            this.$loginTip = $('#js-login-tip');

            this.$username = $('#js-username');
            this.$password = $('#js-password');
            this.$repassword = $('#js-repassword');

            this.$logoutBtn = $('#js-logout-btn');

            this.$loginBox = $('#js-loginbox');

            this.$loginRegTip = $('#js-login-reg-tip');

            this.loginData = {
                titleTxt: "登录",
                repassword: false,
                btnTxt: '登录',
                loginTip: '没有账号',
                loginChange: '马上注册'
            };
            this.regData = {
                titleTxt: "注册",
                repassword: true,
                btnTxt: '注册',
                loginTip: '已有账号',
                loginChange: '马上登录'
            };
            this.bindEvent();
        }
        function bindEvent() {
            // 登录注册框切换
            this.switchLoginReg();
            // 登录注册按钮
            this.loginOrReg();
            // 退出
            this.logout();
        }
        function switchLoginReg() {
            let that = this;
            this.$loginChange.toggle(function() {
                that.$loginTitle.html(that.regData.titleTxt);
                that.$repassword.show();
                that.$loginOrRegBtn.html(that.regData.btnTxt);
                that.$loginTip.html(that.regData.loginTip);
                $(this).html(that.regData.loginChange);
            },function() {
                that.$loginTitle.html(that.loginData.titleTxt);
                that.$repassword.hide();
                that.$loginOrRegBtn.html(that.loginData.btnTxt);
                that.$loginTip.html(that.loginData.loginTip);
                $(this).html(that.loginData.loginChange);
            });
        }
        // 待优化
        function loginOrReg() {
            let that = this;
            this.$loginOrRegBtn.on('click', function() {
                if($(this).html() === '注册') {
                    $.ajax({
                        url: '/reg',
                        type: "POST",
                        data: {
                            username: that.$username.val(),
                            password: that.$password.val(),
                            repassword: that.$repassword.val()
                        },
                        dataType: 'json',
                        success: function(res) {
                            that.$loginRegTip.html(res.msg).fadeIn(200).addClass('tip-err').delay(2000).fadeOut();
                            that.$loginChange.click();
                        }
                    });
                } else {
                    $.ajax({
                        url: '/login',
                        type: "POST",
                        data: {
                            username: that.$username.val(),
                            password: that.$password.val()
                        },
                        dataType: 'json',
                        success: function(res) {
                            if(!res.code) {
                                setTimeout(() => {
                                    location.reload();    
                                }, 200);
                            } else {
                                that.$loginRegTip.html(res.msg).fadeIn(200).addClass('tip-err').delay(2000).fadeOut();
                            }
                        }
                    });
                }
            });
            
        }
        function logout() {
            this.$logoutBtn.on('click', function() {
                $.ajax({
                    url: '/logout',
                    type: "GET",
                    success: function(res) {
                        setTimeout(() => {
                            location.reload();    
                        }, 200);
                    }
                });
            });
        }
        return {
            init,
            bindEvent,
            switchLoginReg,
            loginOrReg,
            logout
        };
    }();
    Index.init();
});