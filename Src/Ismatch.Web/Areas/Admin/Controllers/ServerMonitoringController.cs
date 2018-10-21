using Cloud.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace IsMatch.Web.Areas.Admin.Controllers
{
    /// <summary>服务器监控控制器</summary>
    [IsMatchAuthorize]
    public class ServerMonitoringController : Controller
    {
        /// <summary>首页视图</summary>
        [IsMatchAuthorize(PermissionEnum.Access)]
        public ActionResult Index()
        {
            return View();
        }
    }
}