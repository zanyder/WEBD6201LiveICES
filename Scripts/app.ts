// IIFE -- Immediately Invoked Function Expression
// AKA -- Anonymous Self-Executing Function
(function () {
  function AuthGuard(): void
  {
    let protected_routes: string[] = [
      "contact-list"
    ];

    if(protected_routes.indexOf(router.ActiveLink) > -1)
    {
        if(!sessionStorage.getItem("user"))
      {
        // if not... change the active link to the login page
        router.ActiveLink = "login";
      }
    }
  }

  function LoadLink(link: string, data: string = "")
  {
    router.ActiveLink = link;

    AuthGuard();

    router.LinkData = data;

    history.pushState({}, "", router.ActiveLink);

    // capitalize the active link and highlight the active link
    document.title = router.ActiveLink.substring(0, 1).toUpperCase() + router.ActiveLink.substring(1);

    $("ul>li>a").each(function(){
      $(this).removeClass("active");
    });
      
    $(`li>a:contains(${document.title})`).addClass("active");

    LoadContent();
  }
  function LoadHeader(): void
   {
      $.get("./Views/components/header.html", function(html_data)
      {
        $("header").html(html_data);
        
        // capitalize the Active Link and then set the document title to the new string
      
        CheckLogin();

        AddNavigationEvents();
      });
    
    }
  function AddNavigationEvents(): void
  {
    let navLinks = $("ul>li>a"); // find all Navigation links

    navLinks.off("click");
    navLinks.off("mouseover");

    // loop through each navigation link and load appropriate content on click
    navLinks.on("click", function(){
      LoadLink($(this).attr("data") as string);
    });

    // make nav links look like they are clickable
    navLinks.on("mouseover", function(){
        $(this).css('cursor', 'pointer');
    });
  }

  function AddLinkEvents(link: string): void
  {
    let linkQuery = $(`a.link[data${link}]`);
    // remove all link events
    linkQuery.off('click');
    linkQuery.off('mouseover');
    linkQuery.off('mouseout');


    // add css to adjust link aesthetic

    linkQuery.css("text-decoration", "underline");
    linkQuery.css("color", "blue");

    // add link events
    linkQuery.on("click", function()
    {
      LoadLink(`${link}`);
    });

    linkQuery.on("mouseover", function()
    {
      $(this).css('cursor', 'pointer');
      $(this).css('font-weight', 'bold');
    });

    linkQuery.on("mouseout", function()
    {
      $(this).css('font-weight', 'normal');
    });
  }

  function LoadContent(): void
  {
    let page_name = router.ActiveLink; // alias
    let callback = ActiveLinkCallBack(); // returns a reference to the apprpriate function
    $.get(`./Views/content/${page_name}.html`, function(html_data)
    {
      $("main").html(html_data);
      CheckLogin();
      callback();
    });
    
  }

  function LoadFooter(): void
  {
    $.get("./Views/components/footer.html", function(html_data)
    {
      $("footer").html(html_data);
    });
  }

  function DisplayHome(): void
   {
    console.log("Home Page");

    $("#AboutUsButton").on("click", function () {
      LoadLink("about");
      
    });

    $("main").append(
      `<p id="MainParagraph" class="mt-3">This is the Main Paragraph</p>`
    );
    //Article.innerHTML = ArticleParagraph;
    $("main").append(`<article>
    <p id="ArticleParagraph" class="mt-3">This is the Article Paragraph</p>
    </article>`);
  }
  function DisplayProducts(): void {
    console.log("Products Page");
  }
  function DisplayServices(): void {
    console.log("Services Page");
  }
  function DisplayAbout(): void {
    console.log("About Page");
  }
  function DisplayContacts(): void {
    console.log("Contacts Page");

    $("a[data='contact-list']").off("click");
    $("a[data='contact-list']").on("click", ()=>
    {
      LoadLink("contact-list");
    });

    ContactFormValidation();

    let sendButton = document.getElementById("sendButton") as HTMLElement; //TODO check if exists
    let subscribeCheckbox = document.getElementById("subscribeCheckbox") as HTMLInputElement;

    sendButton.addEventListener(
      "click",
      function () // override the default onClick event. aka the submit function with this
      {
        let fullName = document.forms[0].fullName.value;
        let contactNumber = document.forms[0].contactNumber.value;
        let emailAddress = document.forms[0].emailAddress.value;

        let contact = new core.Contact(fullName, contactNumber, emailAddress);
        
        if(contact.serialize())
        {
          let key = contact.FullName.substring(0,1) + Date.now();

          localStorage.setItem(key, contact.serialize() as string);
        }
          
      }

    );
  }

  function ContactFormValidation(): void 
  {
    let fullNamePattern =
      /^([A-Z][a-z]{1,3}.\s)?([A-Z][a-z]{1,25})+(\s|,|-)([A-Z][a-z]{1,25})+(\s|,|-)*$/;
    let contactNumberPattern =
      /^(\+\d{1,3}[\s-.])?\(?\d{3}\)?[\s-.]?\d{3}[\s-.]?\d{4}$/;
    let emailAddressPattern =
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,10}$/;

    ValidateField(
      "fullName",
      fullNamePattern,
      "Please enter a valid Full Name. This must include at least a capitalized first name followed by a capitalized last name."
    );
    ValidateField(
      "contactNumber",
      contactNumberPattern,
      "Please enter a valid Contact Number. Example: 905 999 9999"
    );
    ValidateField(
      "emailAddress",
      emailAddressPattern,
      "Please enter a valid Email Address Example: abc@abc.com."
    );
  }
  function DisplayContactListPage(): void
   {
    console.log("Contact List Page");
    
    if (localStorage.length > 0) {
      let contactList = document.getElementById("contactList") as HTMLElement; // The tbody from contact-list.html

      let data = ""; // data container -> add deserialized data from localStorage

      let keys = Object.keys(localStorage); // returns a string array of keys from localStorage
  
      let index = 1; //counter for keys
  
      // for every key from Keys array, loop
      for (const key of keys) {
        let contactData = localStorage.getItem(key) as string; // get localStorage data value related to key

        let contact = new core.Contact(); //Create a new empty contact to serialize and deserialize
        contact.deserialize(contactData);

        data += `<tr>
            <th scope="row" class="text-center">${index}</th>
            <td>${contact.FullName}</td>
            <td>${contact.ContactNumber}</td>
            <td>${contact.EmailAddress}</td>
            <td class="text-center"><button value="${key}" class="btn btn-primary btn-sm edit"><i class="fas fa-edit fa-sm"></i> Edit</button></td>
            <td class="text-center"><button value="${key}" class="btn btn-danger btn-sm delete"><i class="fas fa-trash-alt fa-sm"></i> Delete</button></td>
            </tr>
            `;
        index++;
        //Create Read Update Delete
      }

      contactList.innerHTML = data;

      $("#addButton").on("click", () => {
        LoadLink("edit", "add");
      });

      $("button.delete").on("click", function () {
        if (confirm("Are you sure?")) {
          localStorage.removeItem($(this).val() as string);
        }
        LoadLink("contact-list");
      
      });

      $("button.edit").on("click", function () {
        LoadLink("edit", $(this).val() as string)
      });
    }
  }

  function DisplayEditPage(): void
   {
    console.log("Edit Page");

    ContactFormValidation();

    let page = router.LinkData;

    switch (page) {
      case "add":
        {
          $("main>h1").text("Add Contact");

          $("#editButton").html(`<i class="fas fa-plus-circle fa-lg"></i> Add`);

          $("#editButton").on("click", (event) => {
            event.preventDefault();
            
            let fullName = document.forms[0].fullName.value;
            let contactNumber = document.forms[0].contactNumber.value;
            let emailAddress = document.forms[0].emailAddress.value;

            // Add Contactt
            AddContact(fullName, contactNumber, emailAddress);
            // Refresh the contact-list page
            LoadLink("contact-list");
          });

          $("#cancelButton").on("click", () => {
            LoadLink("contact-list");
          });
        }
        break;
      default:
        {
          // get the contact info from localStorage
          let contact = new core.Contact();
          contact.deserialize(localStorage.getItem(page) as string);

          // display the contact info in the edit form
          $("#fullName").val(contact.FullName);
          $("#contactNumber").val(contact.ContactNumber);
          $("#emailAddress").val(contact.EmailAddress);

          // when Edit is pressed - update the contact
          $("#editButton").on("click", (event) => {
            event.preventDefault();

            // get any changes from the form
            contact.FullName = $("#fullName").val() as string;
            contact.ContactNumber = $("#contactNumber").val() as string;
            contact.EmailAddress = $("#emailAddress").val() as string;

            // replace the item in localStorage
            localStorage.setItem(page, contact.serialize() as string);

            // return to the contact-list
            LoadLink("contact-list");
          });

          $("#cancelButton").on("click", () => {
            LoadLink("contact-list");
          });
        }
        break;
    }
  }
  /**
   * Adds a Contact Object to localStorage
   *
   * @param {string} fullName
   * @param {string} contactNumber
   * @param {string} emailAddress
   */
  function AddContact(fullName: string, contactNumber: string, emailAddress: string) {

    let contact = new core.Contact(fullName, contactNumber, emailAddress);

    if (contact.serialize()) {
      let key = contact.FullName.substring(0, 1) + Date.now();

      localStorage.setItem(key, contact.serialize() as string);
    }

  }
  /**
   *  This method validates an input text field in the form
   *  and displays an error in the message area div element
   *
   * @param {string} field_Id
   * @param {RegExp} regular_expression
   * @param {string} error_message
   */
  function ValidateField(field_Id: string, regular_expression: RegExp, error_message: string) {
    let messageArea = $("#messageArea").hide();

    $("#" + field_Id).on("blur", function () 
    {
      let textContentOfField = $(this).val() as string;
      if (!regular_expression.test(textContentOfField)) {
        //RegExp failed to validate
        $(this).trigger("focus").trigger("select");
        $("#submit").hide();
        messageArea.addClass("alert alert-danger");
        messageArea.text(error_message).show();
      } //Everything is Ok
      else {
        messageArea.removeAttr("class").hide(); // removes the attribute named class
      }
    });
  }
  function DisplayRegister(): void {
    console.log("Register Page");
    AddLinkEvents("login");
  }

  function CheckLogin(): void
  {
    if(sessionStorage.getItem("user"))
    {
      // swap out login link for logout link
      $("#login").html(
        `<a id="logout" class="nav-link" href="#"><i class="fas fa-sign-out-alt"></i> Logout</a>`
      )

      $("#logout").on("click", ()=>{
        sessionStorage.clear();     // clear the session storage

        // swap out the logout link for the login link
        $("#login").html(
          `<a class="nav-link" data="login"><i class="fas fa-sign-in-alt"></i> Login</a>`
        )

        LoadLink("login"); //redirect back to index page
      })
    }
  }

  function DisplayLogin(): void 
  {
    console.log("Login Page");
    let messageArea = $("#messageArea").hide();

    AddLinkEvents("register");

    $("#loginButton").on("click", () => {
      let success = false;
      // create an empty user object
      let newUser = new core.User();

      // user a jquery shortcut to load the users.json file
      $.get("./Data/users.json", (data) => {
        //for every user in the users.json file, loop
        for (const user of data.users) {
          
          let username = document.forms[0].username.value;
          let password = document.forms[0].password.value;
          // check if the username and password entered matched with user
          if (username == user.Username && password == user.Password
          ) {
            //get the user data from the file and assign it to the empty user
            newUser.fromJSON(user);
            success = true;
            break;
          } else {
          }
        }
        if (success) {
          //if username and password matches => success, perform the login sequence
          // add user to session storage

          sessionStorage.setItem("user", newUser.serialize() as string);

          //hide any errors
          $("#messageArea").removeAttr("class").hide();

          LoadLink("contact-list");
        } else {
          // display an error message
          $("#username").trigger("focus").trigger("select");
          messageArea
            .addClass("alert alert-danger")
            .text("Error: Invalid login information.")
            .show();
        }

        $("#cancelButton").on("click", () => {
          // clear the login form
          document.forms[0].reset();
          LoadLink("home");
        });
      });
    });
  }

  function Display404Page(): void
  {

  }

  /**
   *  This function returns the callback function
   *  related to the active link
   *
   * @param {string} activeLink
   * @returns {Function}
   */
  function ActiveLinkCallBack(): Function
  {
    switch(router.ActiveLink)
    {
      case "home": return DisplayHome;
      case "about": return DisplayAbout;
      case "projects": return DisplayProducts;
      case "services": return DisplayServices;
      case "contact": return DisplayContacts;
      case "contact-list": return DisplayContactListPage;
      case "edit": return DisplayEditPage;
      case "login": return DisplayLogin;
      case "register": return DisplayRegister;
      case "404": return Display404Page;
      default:
        console.error("ERROR: callback does not exist" + router.ActiveLink);
        return new Function();
    }
  }

  /**
   * This is the entry point to the web application
   *
   */
  function Start(): void
   {
    console.log("App Started");

    LoadHeader()
    
    LoadLink("home");

    LoadFooter()
  }

  window.addEventListener("load", Start);
})();
