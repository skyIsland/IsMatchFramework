using System.Web.Mvc;

namespace Ismatch.Web.Areas.Admin
{
    /// <summary>用户管理中心区域注册</summary>
    public class AdminAreaRegistration : AreaRegistration
    {
        /// <summary>区域名称</summary>
        public override string AreaName
        {
            get
            {
                return "Admin";
            }
        }
        /// <summary>注册区域</summary>
        /// <param name="context"></param>
        public override void RegisterArea(AreaRegistrationContext context)
        {
            context.MapRoute(
                "Admin_default",
                "Admin/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}