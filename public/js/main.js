$(function () {
    const Index = function () {
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

            this.$avatarFile = $('#js-avatar-file');
            this.$jsAvatarImg = $('#js-avatar-img');

            this.$mask = $('#js-mask');

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
            // 回车登录/注册
            this.bindEnter();
            // 退出
            this.logout();
            // 上传头像
            this.uploadAvatar();
            // 裁剪图片
            this.opeCutImg();
            // 遮罩
            this.handleMask();

            this.confirmCutImg();
        }
        function switchLoginReg() {
            let that = this;
            this.$loginChange.toggle(function () {
                that.$loginTitle.html(that.regData.titleTxt);
                that.$repassword.show();
                that.$loginOrRegBtn.html(that.regData.btnTxt);
                that.$loginTip.html(that.regData.loginTip);
                $(this).html(that.regData.loginChange);
            }, function () {
                that.$loginTitle.html(that.loginData.titleTxt);
                that.$repassword.hide();
                that.$loginOrRegBtn.html(that.loginData.btnTxt);
                that.$loginTip.html(that.loginData.loginTip);
                $(this).html(that.loginData.loginChange);
            });
        }
        function loginOrReg() {
            let that = this;
            this.$loginOrRegBtn.on('click', function () {
                let url = $(this).html() === '注册' ? '/reg' : '/login';
                let data = {
                    username: that.$username.val(),
                    password: that.$password.val(),
                    repassword: that.$repassword.val()
                };
                Utils.ajax({ url, data }).then(res => {
                    if (!res.code) {
                        setTimeout(() => {
                            location.reload();
                        }, 1000);
                    } else {

                    }
                    that.$loginRegTip.html(res.msg).stop().fadeIn(200).addClass('tip-err').delay(2000).fadeOut();
                });
            });
        }
        function bindEnter() {
            let that = this;
            function _submit(e) {
                if (e.keyCode === 13) {
                    that.$loginOrRegBtn.click();
                }
            }
            this.$username.on('keydown', _submit);
            this.$password.on('keydown', _submit);
        }
        function logout() {
            let that = this;
            this.$logoutBtn.on('click', function () {
                let url = "/logout";
                let type = "GET";
                Utils.ajax({ url, type }).then(res => {
                    if (!res.code) {
                        setTimeout(() => {
                            location.reload();
                        }, 1000);
                    } else {

                    }
                });
            });
        }
        function uploadAvatar() {
            let that = this;
            let fd = new FormData();
            this.$avatarFile.on('change', function (e) {
                fd.append('avatar', e.target.files[0]);
                $.ajax({
                    url: '/upload',
                    type: 'POST',
                    data: fd,
                    dataType: 'json',
                    processData: false, // 不处理数据
                    contentType: false, // 不设置内容类型
                    success: function (res) {
                        // 上传成功可以 jQ 替换，当然也可以刷新一下
                        // that.$jsAvatarImg.attr('src', `/public/upload/${res.avatar}`);
                        location.reload();
                    }
                });
            });
        }
        function opeCutImg() {
            let that = this;
            let $showCut = $('#js-show-cut');
            let $cutImg = $('#js-cut-img');
            $showCut.on('click', function() {
                that.$mask.show();
                let jcrop_api,
                    boundx,
                    boundy,
                    $preview = $('#preview-pane'),
                    $pcnt = $('#preview-pane .preview-container'),
                    $pimg = $('#preview-pane .preview-container img'),
                    xsize = $pcnt.width(),
                    ysize = $pcnt.height(),
                    $dciCon = $('#js-dci-con');
            
                $cutImg.Jcrop({
                    onChange: updatePreview,
                    onSelect: updatePreview,
                    aspectRatio: xsize / ysize,
                    // 设置图片的大小，不想是原始大小，这个通过后端裁剪完成
                    // boxWidth: $dciCon.width()
                }, function () {
                    let bounds = this.getBounds();
                    boundx = bounds[0];
                    boundy = bounds[1];
                    jcrop_api = this;
                    $preview.appendTo(jcrop_api.ui.holder);
                });
                function updatePreview(c) {
                    if (parseInt(c.w) > 0) {
                        let rx = xsize / c.w;
                        let ry = ysize / c.h;
                        $pimg.css({
                            width: Math.round(rx * boundx) + "px",
                            height: Math.round(ry * boundy) + 'px',
                            marginLeft: '-' + Math.round(rx * c.x) + 'px',
                            marginTop: '-' + Math.round(ry * c.y) + 'px'
                        });
                    }
                };
            });
        }
        function handleMask() {
            $('.dialog-cut-img').on('click', function(e) {
                e.stopPropagation();
            });
            this.$mask.on('click', function() {
                $(this).hide();
            });
        }
        function confirmCutImg() {
            let that = this;
            let $cutImgBtn = $('#js-cut-img-btn');
            $cutImgBtn.on('click', function() {
                let w = parseInt($(".jcrop-holder>div:first").css("width")),
                    h = parseInt($(".jcrop-holder>div:first").css("height")),
                    x = parseInt($(".jcrop-holder>div:first").css("left")),
                    y = parseInt($(".jcrop-holder>div:first").css("top"));
                $.get("/cutimg", {
                    w,
                    h,
                    x,
                    y
                }, function (res) {
                    if(!res.code) {
                        that.$mask.hide();
                        location.reload();
                    }
                });
            });
        }
        return {
            init,
            bindEvent,
            switchLoginReg,
            loginOrReg,
            logout,
            bindEnter,
            uploadAvatar,
            opeCutImg,
            handleMask,
            confirmCutImg
        };
    }();
    Index.init();
});