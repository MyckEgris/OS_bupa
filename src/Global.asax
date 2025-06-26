<%@ Application Language="C#" %>
<%@ Import Namespace="System.Linq" %>
<%@ Import Namespace="System.IO.Compression" %>
<%@ Import Namespace="System.IO" %>
<%@ Import Namespace="System.Text" %>
<%@ Import Namespace="System" %>
<script runat="server">
	void Application_Start(object sender, EventArgs e)
    {

	}

	void Application_BeginRequest(object sender, EventArgs e)
    {
		var cookieKey = Base64Encode("config");
		string[] config =
		{
			"BASEURL",
			"APIHOST",
			"ISSUER",
			"REDIRECTURI",
			"RESPONSETYPE",
			"CLIENTID",
			"SCOPE",
			"OIDC",
			"STRICTDISCOVERYDOCUMENTVALIDATION",
			"POSTLOGOUTREDIRECTURI",
			"LOGOUTURL",
			"CLEARHASHAFTERLOGIN",
			"RETURNURL",
			"APIHOSTIMPERSONATION",
			"CLIENTIDIMPERSONATION",
			"SCOPEIMPERSONATION",
			"AUTHORIZATIONIMPERSONATION",
			"GOOGLECAPTCHASITEKEY",
			"CLIENTIDPAYMENTWITHOUTLOGGIN",
			"SCOPEPAYMENTWITHOUTLOGGIN",
			"SDUN",
			"SDUP",
			"GOOGLECAPTCHASITEKEYINVISIBLE",
			"APIHOSTCHANGEPORTFOLIO",
			"NEWBUSINESSQUOTATIONURL",
			"NEWBUSINESSQUOTEURLSAUTHORIZED",
			"CHATBOTSOURCE",
			"CHATBOTDATAORGID",
			"CHATBOTDATAORGURL",
			"CHATBOTDATAAPPENG",
			"CHATBOTDATAAPPSPA",
      "DIGITALHOST",
			"SPLITREDIRECTURL",
      "MEXICOCOSTUMERSERVICEPHONE",
      "MEXICOCOSTUMERSERVICEMAIL",
      "BGLACOSTUMERSERVICEPHONE",
      "BGLACOSTUMERSERVICEMAIL",
      "GOTOHOMETITLECURRENTBUSINESS",
      "GOTOHOMETITLEOFFSIDEBUSINESS",
      "AUTHFORMCURRENTBUSINESS",
      "AUTHFORMOFFSIDEBUSINESS",
      "PROVIDERSMAIL",
      "INACTIVITYMXPORTAL",
	  "NPSSURVEYURL",
	  "APIMHOST",
	  "APIMSUBSCRIPTION"
		};
		var configValue = buildString(config);

		HttpCookie configCookie = new HttpCookie(cookieKey);
        configCookie.Value = configValue;
		//configCookie.Expires = DateTime.Now.AddSeconds(20);
		HttpContext.Current.Response.Cookies.Add(configCookie);
	}

	private string buildString(string[] config)
	{
		var encoded = config.Select(p => Base64Encode(System.Configuration.ConfigurationManager.AppSettings[p])).ToArray();
		return Base64Encode(String.Join(".", encoded));
	}

	private static string Base64Encode(string plainText) {
		var plainTextBytes = System.Text.Encoding.UTF8.GetBytes(plainText);
		return System.Convert.ToBase64String(plainTextBytes);
	}


</script>
