"use strict";
(function()
{
    let protected_routes =[
        "contact-list"
    ];

    if(protected_routes.indexOf(router.ActiveLink) > -1)
    {
        if(!sessionStorage.getItem("user"))
    {
        // redirect to the login page
        location.href = "/login";
    }
    }
    
})();