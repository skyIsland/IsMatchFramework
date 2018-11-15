var tab = tab || {};
(function ($) {
    /**
     * 初始化
     */
    tab.init = function () {
        $('.menuItem').on('click', tab.openTab);
    };
    tab.openTab = function () {
        var $that = $(this),
            url = $that.attr('href');
        if (!url || $.trim(url).length == 0) {
            return false;
        }
        var firstMenuTitle = $that.closest('li.parent ').children('a').text(),
            secondMenuTitle = $that.children('span').text(),
            menuId = $that.data('id');
        $('ol.page-head-nav>li:first-child>a').text(firstMenuTitle);
        $('ol.page-head-nav>li:last-child>a').text(secondMenuTitle).attr('href', url);
        $('#iframe0').attr('src', url).data('id', menuId);
        return false;
    };
})(jQuery);

$(function () {
    tab.init();
});