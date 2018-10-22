(function ($) {
    $.login = {
        Tips: function (msg) {
            if (msg) {
                new Dialog().alert(msg, {
                    type: 'warning'
                });
            }
        },
        loginClick: function () {
            var $username = $("#txt_account");
            var $password = $("#txt_password");
            if ($username.val() == "") {
                $username.focus();
                $.login.Tips('请输入用户名/手机号/邮箱。');
                return false;
            } else if ($password.val() == "") {
                $password.focus();
                $.login.Tips('请输入登录密码。');
                return false;
            } else {
                $("#login_button").attr('disabled', 'disabled').find('span').html("loading...");
                var rememberme = $("#rememberme").prop("checked");
                $.ajax({
                    url: "/Login/Login",
                    data: { username: $.trim($username.val()), password: $password.val(), rememberme: rememberme },
                    type: "post",
                    dataType: "json",
                    success: function (data) {
                        if (data.Status === 1) {
                            $("#login_button").find('span').html("登录成功，正在跳转...");
                            window.setTimeout(function () {
                                window.location.href = "/Home/Index";
                            }, 500);
                        } else {
                            $("#login_button").removeAttr('disabled').find('span').html("登录");
                            $.login.Tips(data.Msg);
                        }
                    },
                    error: function (error) {
                        $("#login_button").removeAttr('disabled').find('span').html("登录");
                        $code.val('');
                        $.login.Tips(error.statusText);
                    }
                });
            }
        },
        init: function () {
            var account = $('#txt_account');
            var password = $('#txt_password');

            var formLabelaccount = $('#form__label__account');
            var formLabelPassword = $('#form__label__password');

            account.focus(function () {
                if (!(account.val().length)) {
                    formLabelaccount.addClass('active');
                }
                $('.form__wrapper:eq(0)').addClass('form__wrapper__active');
            });

            account.blur(function () {
                if (!(account.val().length)) {
                    formLabelaccount.removeClass('active');
                }
                $('.form__wrapper:eq(0)').removeClass('form__wrapper__active');
            });

            password.focus(function () {
                if (!(password.val().length)) {
                    formLabelPassword.addClass('active');
                }
                $('.form__wrapper:eq(1)').addClass('form__wrapper__active');
            });

            password.blur(function () {
                if (!(password.val().length)) {
                    formLabelPassword.removeClass('active');
                }
                $('.form__wrapper:eq(1)').removeClass('form__wrapper__active');
            });

            account.change(function () {
                toogleBtn();
            });

            password.change(function () {
                toogleBtn();
            });

            function toogleBtn() {
                if ((account.val().length) && (password.val().length)) {
                    $('#login_button').addClass('bounceIn');
                } else {
                    $('#login_button').removeClass('bounceIn');
                }
            }
            
            //登陆错误
            var login_error = top.$.cookie('CookieLoginError');
            if (login_error != null) {
                switch (login_error) {
                    case "Timeout":
                        $.login.Tips("系统登录已超时,请重新登录");
                        break;
                    case "OnLine":
                        $.login.Tips("您的帐号已在其它地方登录,请重新登录");
                        break;
                    case "-1":
                        $.login.Tips("系统未知错误,请重新登录");
                        break;
                }
                top.$.cookie('CookieLoginError', '', { path: "/", expires: -1 });
            }
            $("#login_button").click(function () {
                $.login.loginClick();
            });
            document.onkeydown = function (e) {
                if (!e) e = window.event;
                if ((e.keyCode || e.which) == 13) {
                    document.getElementById("login_button").focus();
                    document.getElementById("login_button").click();
                }
            };
        }
    };
    $(function () {
        $.login.init();
    });
})(jQuery);