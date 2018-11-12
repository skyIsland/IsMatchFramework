﻿/*****************************************************
 * Author  : 云飞扬
 * Version : 1.0.000
 * Date    :  2017-03-01
 ****************************************************/
/**==================================================云飞扬快速开发平台js模块====================================================**/

//云平台js模块
var IsMatch = IsMatch || {};
(function ($) {
    /********************通用模块**********************/

    /**
     * 通用模块
     * @property {Object} common
     */
    IsMatch.common = IsMatch.common || {};
    /**
     * 页面重新加载
     * @return {Boolean}
     */
    IsMatch.common.reload = function () {
        location.reload();
        return false;
    };
    /**
     * 正在加载遮罩层
     * @param  {Boolean} isShow 是否显示遮罩层
     * @param  {String}  text   显示文本
     */
    IsMatch.common.loading = function (isShow, text) {
        var $loadingpage = top.$("#loadingPage");
        var $loadingtext = $loadingpage.find('.loading-content');
        if (isShow) {
            $loadingpage.show();
        } else {
            if ($loadingtext.attr('istableloading') == undefined) {
                $loadingpage.hide();
            }
        }
        if (!!text) {
            $loadingtext.html(text);
        } else {
            $loadingtext.html("数据加载中，请稍候…");
        }
        $loadingtext.css("left", (top.$('body').width() - $loadingtext.width()) / 2 - 50);
        $loadingtext.css("top", (top.$('body').height() - $loadingtext.height()) / 2);
    };
    /**
     * 获取当前页面的查询字符串，以对象的形式返回
     * @return {Object}  返回键值对
     */
    IsMatch.common.getQueryStringArgs = function () {
        //取得查询字符串并去掉问号
        var qs = location.search.length > 0 ? location.search.substring(1) : "";
        //保存数据的对象
        var args = {};
        //取得每一项
        var items = qs.length ? qs.split("&") : [];
        var item = null;
        var value = null;
        var len = items.length;
        for (var i = 0; i < len; i++) {
            item = items[i].split("=");
            //参数解码
            name = decodeURIComponent(item[0])
            value = decodeURIComponent(item[1]);
            if (name.length) {
                args[name] = value;
            }
        }
        return args;
    };
    /**
     * 根据名称获取当前页面的查询字符串的值
     * @return {String}  返回对应的值
     */
    IsMatch.common.request = function (name) {
        var args = IsMatch.common.getQueryStringArgs();
        var result = "";
        if (args) {
            $.each(args, function (key, value) {
                if (key == name) {
                    result = value;
                    //退出遍历
                    return false;
                }
            });
        }
        return result;
    };
    /**
    * 获取当前页面的请求参数，以对象的形式返回
    * @return {Object}  返回键值对
    */
    IsMatch.common.getRequestData = function () {
        var requestData = IsMatch.common.getQueryStringArgs();
        //id参数
        requestData.id = requestData.id || "0";
        //页面类型 type=detail 表示查看详情
        requestData.type = requestData.type || null;
        return requestData;
    };
    /**
     * 获取当前窗口
     * @return {Object}  
     */
    IsMatch.common.currentWindow = function () {
        var iframeId = top.$(".iframe:visible").attr("id");
        return top.frames[iframeId];
    };
    /**
     * 获取浏览器类型
     * @return {String}  
     */
    IsMatch.common.browser = function () {
        var userAgent = navigator.userAgent;
        var isOpera = userAgent.indexOf("Opera") > -1;
        if (isOpera) {
            return "Opera"
        };
        if (userAgent.indexOf("Firefox") > -1) {
            return "FF";
        }
        if (userAgent.indexOf("Chrome") > -1) {
            if (window.navigator.webkitPersistentStorage.toString().indexOf('DeprecatedStorageQuota') > -1) {
                return "Chrome";
            } else {
                return "360";
            }
        }
        if (userAgent.indexOf("Safari") > -1) {
            return "Safari";
        }
        if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
            return "IE";
        };
    };
    /**
     * 下载
     * @param  {String} url    地址
     * @param  {Object} data   数据
     * @param  {String} method 方法类型，post或者get
     */
    IsMatch.common.download = function (url, data, method) {
        if (url && data) {
            data = typeof data == 'string' ? data : jQuery.param(data);
            var inputs = '';
            $.each(data.split('&'), function () {
                var pair = this.split('=');
                inputs += '<input type="hidden" name="' + pair[0] + '" value="' + pair[1] + '" />';
            });
            $('<form action="' + url + '" method="' + (method || 'post') + '">' + inputs + '</form>').appendTo('body').submit().remove();
        };
    };

    /********************弹窗模块**********************/

    /**
     * 弹窗模块
     * @property {Object} modal
     */
    IsMatch.modal = IsMatch.modal || {};
    /**
     * 打开弹窗
     * @param  {Object} options  选项
     */
    IsMatch.modal.open = function (options) {
        var defaults = {
            id: null,
            title: '系统窗口',
            width: "100px",
            height: "100px",
            url: '',
            shade: 0.3,
            maxmin: false, //开启最大化最小化按钮
            btn: ['确认', '关闭'],
            btnclass: ['btn btn-primary', 'btn btn-danger'],
            callBack: null
        };
        var options = $.extend(defaults, options);
        var _width = top.$(window).width() > parseInt(options.width.replace('px', '')) ? options.width : top.$(window).width() + 'px';
        var _height = top.$(window).height() > parseInt(options.height.replace('px', '')) ? options.height : top.$(window).height() + 'px';
        return top.layer.open({
            id: options.id,
            type: 2,
            shade: options.shade,
            maxmin: options.maxmin,
            title: options.title,
            fix: false,
            area: [_width, _height],
            content: options.url,
            btn: options.btn,
            btnclass: options.btnclass,
            /**
            * 点击确定按钮的回调
            * @param  {Number} index  索引
            * @param  {Object} layero 弹窗对象
            */
            yes: function (index, layero) {
                options.callBack(options.id, index, layero);
            }, cancel: function (index, layero) {
                return true;
            }
        });
    };
    /**
     * 关闭弹窗
     * @param  {Object} options  参数
     */
    IsMatch.modal.close = function () {
        var index = top.layer.getFrameIndex(window.frameElement.id); //先得到当前iframe层的索引
        var $IsdialogClose = top.$("#layui-layer" + index).find('.layui-layer-btn').find("#IsdialogClose");
        var IsClose = $IsdialogClose.is(":checked");
        if ($IsdialogClose.length == 0) {
            IsClose = true;
        }
        if (IsClose) {
            top.layer.close(index);
        } else {
            location.reload();
        }
    };
    /**
     * 弹窗提示
     * @param  {String} content  提示内容
     * @param  {Number} type  提示类型 1 成功 0 错误
     */
    IsMatch.modal.alert = function (content, type) {
        var icon = "fa-check-circle";
        switch (type) {
            case 0://失败
                icon = "fa-times-circle";
                break;
            case 1://成功
                icon = "fa-check-circle";
                break;
        }
        //if (type == 'success') {
        //    icon = "fa-check-circle";
        //}
        //if (type == 'error') {
        //    icon = "fa-times-circle";
        //}
        //if (type == 'warning') {
        //    icon = "fa-exclamation-circle";
        //}
        top.layer.alert(content, {
            icon: icon,
            title: "系统提示",
            btn: ['确认'],
            btnclass: ['btn btn-primary']
        });
    };
    /**
     * 弹窗消息，短暂显示后消失
     * @param  {String} content  提示内容
     * @param  {Number} type  提示类型 1 成功 0 错误
     */
    IsMatch.modal.msg = function (content, type) {
        if (type != undefined) {
            var icon = "fa-check-circle";
            var cssType = 'success';
            switch (type) {
                case 0://失败
                    icon = "fa-times-circle";
                    cssType = "error";
                    break;
                case 1://成功
                    icon = "fa-check-circle";
                    cssType = "success";
                    break;
            }
            //if (type == 'success') {
            //    icon = "fa-check-circle";
            //}
            //if (type == 'error') {
            //    icon = "fa-times-circle";
            //}
            //if (type == 'warning') {
            //    icon = "fa-exclamation-circle";
            //}
            top.layer.msg(content, { icon: icon, time: 4000, shift: 5 });
            top.$(".layui-layer-msg").find('i.' + icon).parents('.layui-layer-msg').addClass('layui-layer-msg-' + cssType);
        } else {
            top.layer.msg(content);
        }
    };
    /**
     * 弹窗确认
     * @param  {String} content  提示内容
     * @param  {Function} callBack  点击按钮后执行的回调函数，回调函数的参数类型为布尔值
     */
    IsMatch.modal.confirm = function (content, callBack) {
        top.layer.confirm(content, {
            icon: "fa-exclamation-circle",
            title: "系统提示",
            btn: ['确认', '取消'],
            btnclass: ['btn btn-primary', 'btn btn-danger'],
        }, function () {
            callBack(true);
        }, function () {
            callBack(false)
        });
    };

    /********************表单模块**********************/

    /**
     * 表单模块
     * @property {Object} 
     */
    IsMatch.form = IsMatch.form || {};

    /**
     * 表单数据加载
     * @param  {Object} options  选项
     */
    IsMatch.form.load = function (options) {
        var defaults = {
            url: "",
            params: [],
            loading: "数据加载中，请稍候…",
            success: null
        };
        var options = $.extend(defaults, options);
        //0毫秒后发起ajax请求
        window.setTimeout(function () {
            $.ajax({
                url: options.url,
                data: options.params,
                beforeSend: function () {
                    IsMatch.common.loading(true, options.loading);
                },
                success: function (data) {
                    if (data.Status === 1) {
                        if (data.Data && options.success) {
                            options.success(data);
                        }
                    } else {
                        IsMatch.modal.alert(data.Msg, data.Status);
                    }
                }
            });
        }, 0);
    }

    /**
     * 表单提交
     * @param  {Object} options  选项
     */
    IsMatch.form.submit = function (options) {
        var defaults = {
            url: "",
            params: [],
            loading: "正在提交数据...",
            success: null,
            close: true
        };
        var options = $.extend(defaults, options);
        //显示正在加载遮罩层
        //IsMatch.common.loading(true, options.loading);
        //0毫秒后发起ajax请求
        window.setTimeout(function () {
            if ($('[name=__RequestVerificationToken]').length > 0) {
                options.params["__RequestVerificationToken"] = $('[name=__RequestVerificationToken]').val();
            }
            $.ajax({
                url: options.url,
                data: options.params,
                beforeSend: function () {
                    IsMatch.common.loading(true, options.loading);
                },
                success: function (data) {
                    if (data.Status === 1) {
                        options.success(data);
                        IsMatch.modal.msg(data.Msg, data.Status);
                        if (options.close == true) {
                            IsMatch.modal.close();
                        }
                    } else {
                        IsMatch.modal.alert(data.Msg, data.Status);
                    }
                }
            });
        }, 0);
    }
    /**
     * 表单提交删除操作
     * @param  {Object} options  选项
     */
    IsMatch.form.delete = function (options) {
        var defaults = {
            prompt: "注：您确定要删除该项数据吗？",
            url: "",
            params: [],
            loading: "正在删除数据...",
            success: null,
            close: false
        };
        var options = $.extend(defaults, options);
        if ($('[name=__RequestVerificationToken]').length > 0) {
            options.params["__RequestVerificationToken"] = $('[name=__RequestVerificationToken]').val();
        }
        //弹出是否确认删除
        IsMatch.modal.confirm(options.prompt, function (r) {
            if (r) {
                //IsMatch.common.loading(true, options.loading);
                //显示正在加载遮罩层
                window.setTimeout(function () {
                    $.ajax({
                        url: options.url,
                        data: options.params,
                        beforeSend: function () {
                            IsMatch.common.loading(true, options.loading);
                        },
                        success: function (data) {
                            if (data.Status === 1) {
                                options.success(data);
                                IsMatch.modal.msg(data.Msg, data.Status);
                                if (options.close == true) {
                                    IsMatch.modal.close();
                                }
                            } else {
                                IsMatch.modal.alert(data.Msg, data.Status);
                            }
                        }
                    });
                }, 0);
            }
        });
    };
    /**
     * select绑定数据，将给定数据绑定到表单控件上
     * @param  {Object} $elements   jquery对象集合或者单个
     * @param  {Object} options    选项
     */
    IsMatch.form.bindSelect = function ($elements, options) {
        var defaults = {
            id: "ID",
            text: "Name",
            search: false,
            placeholder: "请选择",
            url: "",
            params: [],
            change: null
        };
        var options = $.extend(defaults, options);
        if ($elements && $elements instanceof jQuery && $elements.length > 0) {
            $.each($elements, function (key, value) {
                var $element = $(value);
                if (options.url) {
                    $.ajax({
                        url: options.url,
                        data: options.params,
                        //这里使用同步，需要选项优先加载
                        async: false,
                        success: function (data) {
                            if (data.Status === 1) {
                                $.each(data.Data, function (i) {
                                    $element.append($("<option></option>").val(data.Data[i][options.id]).html(data.Data[i][options.text]));
                                });
                                $element.select2({
                                    minimumResultsForSearch: options.search == true ? 0 : -1,
                                    separator: ",", // 分隔符
                                    placeholder: options.placeholder,
                                    language: "zh-CN"

                                });
                                $element.on("change", function (e) {
                                    if (options.change) {
                                        options.change(data.Data[$(this).find("option:selected").index()]);
                                    }
                                    $("#select2-" + $element.attr('id') + "-container").html($(this).find("option:selected").text().replace(/　　/g, ''));
                                });
                            }
                        }
                    });
                } else {
                    $element.select2({
                        minimumResultsForSearch: -1,
                        placeholder: options.placeholder,
                        language: "zh-CN"
                    });
                }
            });
        }
    };
    /**
     * 表单验证，返回true表示验证通过，false表示验证失败
     * @param  {String} id  表单id
     * @return {Boolean} 是否验证通过
     */
    IsMatch.form.valid = function (id) {
        return $("#" + id).valid({
            errorPlacement: function (error, element) {
                element.parents('.formValue').addClass('has-error');
                element.parents('.has-error').find('i.error').remove();
                element.parents('.has-error').append('<i class="form-control-feedback fa fa-exclamation-circle error" data-placement="left" data-toggle="tooltip" title="' + error + '"></i>');
                $("[data-toggle='tooltip']").tooltip();
                if (element.parents('.input-group').hasClass('input-group')) {
                    element.parents('.has-error').find('i.error').css('right', '33px')
                }
            },
            success: function (element) {
                element.parents('.has-error').find('i.error').remove();
                element.parent().removeClass('has-error');
            }
        });
    };
    /**
     * 表单数据序列化，以对象的形式返回
     * @param  {String} id  表单id
     * @return {Boolean} 键值对
     */
    IsMatch.form.serialize = function (id) {
        var element = $("#" + id);
        var postdata = {};
        element.find('input,select,textarea').each(function (r) {
            var $this = $(this);
            var id = $this.attr('id');
            var name = $this.attr('name');
            //如果name为空，说明这不是需要提交的表单控件
            if (!name) {
                //跳出本次循环
                return;
            }
            var type = $this.attr('type');
            switch (type) {
                case "radio":
                case "checkbox":
                    if ($this.prop("checked")) {
                        //这里的value是个on值
                        //postdata[name] = $this.val() ? $this.val() : true;
                        postdata[name] = true;
                    } else {
                        postdata[name] = false;
                    }
                    break;
                default:
                    var value = $this.val();
                    //数组的话直接转成以逗号分隔的字符串
                    if (value instanceof Array) {
                        var result = "";
                        for (var i = 0; i < value.length; i++) {
                            result += value[i] + ",";
                        }
                        //去除结尾的逗号
                        value = result.substring(0, result.lastIndexOf(","));
                    }
                    postdata[name] = value;
                    break;
            }
        });
        if ($('[name=__RequestVerificationToken]').length > 0) {
            postdata["__RequestVerificationToken"] = $('[name=__RequestVerificationToken]').val();
        }
        return postdata;
    };
    /**
     * 表单数据反序列化，将给定数据绑定到表单控件上
     * @param  {String} id   表单id
     * @param  {Object} data 数据
     */
    IsMatch.form.deserialize = function (id, data) {
        var element = $("#" + id);
        if (!data) {
            return;
        }
        for (var key in data) {
            var $id = element.find('#' + key);
            if (!$id) {
                return;
            }
            var value = $.trim(data[key]).replace(/&nbsp;/g, '');
            var type = $id.attr('type');
            if ($id.hasClass("select2-hidden-accessible")) {
                type = "select";
            }
            switch (type) {
                case "checkbox":
                    if (value == "true") {
                        $id.attr("checked", 'checked');
                    } else {
                        $id.removeAttr("checked");
                    }
                    break;
                case "select":
                    $id.val(value).trigger("change");
                    break;
                default:
                    $id.val(value);
                    break;
            }
        }
    };

    /********************表格模块**********************/

    /**
     * 表格模块
     * @property {Object} 
     */
    IsMatch.grid = IsMatch.grid || {};
    /**
     * 在指定控件上生成表格数据
     * @param  {String} id      控件id
     * @param  {Object} options 选项
     */
    IsMatch.grid.render = function (id, options) {
        var defaults = {
            url: '', //请求后台的URL（*）
            method: 'GET', //请求方式（*）
            toolbar: '#toolbar', //工具按钮用哪个容器
            striped: true, //是否显示行间隔色
            cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            pagination: true, //是否显示分页（*）
            sortable: false, //是否启用排序
            sortOrder: "asc", //排序方式
            queryParams: function(params) { //传递参数（*）
                return {
                    PageSize: params.limit, // 页面大小
                    PageIndex: params.offset, //页码
                    keyword: $('#txtKey').val()
                };
            },
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            pageNumber: 1, //初始化加载第一页，默认第一页
            pageSize: 20, //每页的记录行数（*）
            pageList: [20, 50, 100], //可供选择的每页的行数（*）
            search: false, //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
            strictSearch: true,
            showColumns: false, //是否显示所有的列
            showRefresh: false, //是否显示刷新按钮
            minimumCountColumns: 2, //最少允许的列数
            clickToSelect: true, //是否启用点击选中行
            height: 500, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
            uniqueId: "ID", //每一行的唯一标识，一般为主键列
            showToggle: false, //是否显示详细视图和列表视图的切换按钮
            cardView: false, //是否显示详细视图
            detailView: false, //是否显示父子表
            onLoadError: function(status) { // 远程数据加载失败时触发成功。
                IsMatch.common.loading(false);
                //登陆超时
                if (status == 401) {
                    IsMatch.modal.alert("登陆超时，请重新登陆！", 0);
                    setTimeout(function() {
                            top.location.href = "/Login/Index";
                        },
                        1000);
                } else if (status == 403) {
                    IsMatch.modal.alert("无权限访问！", 0);
                } else {
                    IsMatch.modal.msg(status + '未处理的错误。', 0);
                }
            },
            responseHandler: function (res) {// 特殊处理Data->rows,TotalCount->total
                res.rows = res.Data;
                res.total = res.TotalCount;
                delete res.Data;
                delete res.TotalCount;
                return res;
            }
        };
        options = $.extend(defaults, options);
        var $element = $("#" + id);
        return $element.bootstrapTable(options);
    },
    /**
     * 获取指定列的值 2018年11月11日22:51:05 todo: 
     * @param  {String} id      控件id
     */
    IsMatch.grid.getRowValue = function (id) {
        var $grid = $("#" + id);
        var selectedRowIds = $grid.jqGrid("getGridParam", "selarrrow");
        if (selectedRowIds != "") {
            var json = [];
            var len = selectedRowIds.length;
            for (var i = 0; i < len ; i++) {
                var rowData = $grid.jqGrid('getRowData', selectedRowIds[i]);
                json.push(rowData);
            }
            return json;
        } else {
            return $grid.jqGrid('getRowData', $grid.jqGrid('getGridParam', 'selrow'));
        }
    };


    /********************授权模块**********************/
    /**
     * 授权模块
     * @property {Object} 
     */
    IsMatch.auth = IsMatch.auth || {};
    /**
    * 获取当前页面所拥有的权限对象
    * @return {Object}
    */
    function getMenuPermission() {
        //赋值空对象
        var current = {};
        var menuID = top.$(".iframe:visible").data("id");
        var permissionManager = top.clientData ? top.clientData.PermissionManager : null;
        if (permissionManager && permissionManager.Permissions && permissionManager.Permissions.length > 0) {
            var permissions = permissionManager.Permissions;
            $.each(permissions, function (key, value) {
                //在权限数据里面找到对应菜单
                if (value.Menu && value.Menu.ID == menuID) {
                    current = value;
                    //退出循环
                    return false;
                }
            });
        }
        return current;
    }

    /**
     * 当前页面所拥有的菜单权限对象，缓存对象
     * @return {Object}
     */
    IsMatch.auth.current = null;

    /**
     * 允许的按钮
     * @param  {Object}  options 选项 
     */
    IsMatch.auth.grantedButtons = function (options) {
        var defaults = {
            location: 1,//按钮位置 1 初始 2 列表
            replaceValue: 0//参数替换值
        };
        options = $.extend(defaults, options);
        //var url = location.href;
        var result = "";
        //权限对象是否缓存，没有则缓存上
        if (!IsMatch.auth.current) {
            //获取当前页面所拥有的权限对象
            IsMatch.auth.current = getMenuPermission();
        }
        var current = IsMatch.auth.current;
        //授权的按钮
        if (current && current.Buttons && current.Buttons.length > 0) {
            $.each(current.Buttons, function (k, v) {
                //找相同位置的按钮
                if (options.location == v.Location) {
                    //图标
                    var icon = v.Icon ? '<i class="fa ' + v.Icon + '"></i>' : "";
                    var jsEvent = v.JsEvent;
                    //js事件是否包含有替换符
                    if (jsEvent.lastIndexOf("id") > 0) {
                        jsEvent = jsEvent.replace("id", options.replaceValue);
                    }
                    //根据不同的位置，生成按钮不同
                    switch (options.location) {
                        case 1:
                            result += '<a title="' + v.Name + '" class="btn btn-primary dropdown-text" onclick="' + jsEvent + '" >' + icon + v.Name + '</a>';
                            break;
                        case 2:
                            result += '<a title="' + v.Name + '" onclick="' + jsEvent + '">' + icon + v.Name + '</a>';
                            break;
                    }
                }
            });
        }
        return result;
    };
    /**
     * 验证给定字段是否授权
     * @param  {Object}  options 选项 
     */
    IsMatch.auth.fieldIsGranted = function (fieldName) {
        //权限对象是否缓存，没有则缓存上
        if (!IsMatch.auth.current) {
            //获取当前页面所拥有的权限对象
            IsMatch.auth.current = getMenuPermission();
        }
        var current = IsMatch.auth.current;
        //是否设置了字段权限
        if (current && current.RoleMenu && current.RoleMenu.FieldNames) {
            var fieldArray = current.RoleMenu.FieldNames.split(",");
            if (fieldArray && fieldArray.length > 0) {
                //字段权限类型：1允许0拒绝
                var isAllow = current.RoleMenu.IsAllow;
                if (isAllow) {
                    //允许判断给定字段名称是否存在
                    return fieldArray.indexOf(fieldName) >= 0;
                }
                else {
                    //拒绝则判断给定字段名称是否不存在
                    return fieldArray.indexOf(fieldName) < 0;
                }
            }
        }
        return true;
    };

    $.jsonWhere = function (data, action) {
        if (action == null) return;
        var reval = new Array();
        $(data).each(function (i, v) {
            if (action(v)) {
                reval.push(v);
            }
        });
        return reval;
    };
    $.DateFormat = function (jsondate) {// 格式化JSON时间为 yyyy年MM月dd日 hh:mm:ss
        if (!jsondate) return "";
        jsondate = jsondate.replace("/Date(", "").replace(")/", "");
        if (jsondate.indexOf("+") > 0) {
            jsondate = jsondate.substring(0, jsondate.indexOf("+"));
        }
        else if (jsondate.indexOf("-") > 0) {
            jsondate = jsondate.substring(0, jsondate.indexOf("-"));
        }

        var date = new Date(parseInt(jsondate, 10));
        var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
        var currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        var currentHours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        var currentMin = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        var currentSec = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();

        return date.getFullYear()
            + "年"
            + month
            + "月"
            + currentDate
            + "日"
            + " "
            + currentHours
            + ":"
            + currentMin
            + ":"
            + currentSec;
    };

})(jQuery);

$(function () {
    //设置全局 ajax 默认选项
    $.ajaxSetup({
        type: "post",
        dataType: "json",
        error: function (xhr, textStatus, errorThrown) {
            IsMatch.common.loading(false);
            //登陆超时
            if (xhr.status == 401) {
                IsMatch.modal.alert("登陆超时，请重新登陆！", 0);
                setTimeout(function () {
                    top.location.href = "/Login/Index";
                }, 1000);
            } else if (xhr.status == 403) {
                IsMatch.modal.alert("无权限访问" + xhr.statusText + "！", 0);
            }
            else {
                IsMatch.modal.msg(errorThrown, 0);
            }
        },
        complete: function () {
            IsMatch.common.loading(false);
        }
    });
    ////设置select2默认样式
    //if ($.fn.select2) {
    //    $.fn.select2.defaults.set("theme", "bootstrap");
    //}
    ////设置样式为select2-control的选择框为select2组件
    //IsMatch.form.bindSelect($(".select2-control"));
    ////body设置主题样式
    //document.body.className = localStorage.getItem('config-skin');
    //$("[data-toggle='tooltip']").tooltip();
});

