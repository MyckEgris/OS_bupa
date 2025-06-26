window.addEventListener("lcw:ready", function handleLivechatReadyEvent() {
    var token = sessionStorage.getItem('access_token');
    Microsoft.Omnichannel.LiveChatWidget.SDK.setContextProvider(function contextProvider() {
        return {
            'codBot': { 'value': token.toString(), 'isDisplayable': true }
        };
    });
});
