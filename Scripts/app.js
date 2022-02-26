// IIFE -- Immediately Invoked Function Expression
// AKA -- Anonymous Self-Executing Function
(function () {
  function AjaxRequest(method, url, callback) {
    //step 1 - instantiate XHR object
    let XHR = new XMLHttpRequest();

    // step 2 - create an event listener

    XHR.addEventListener("readystatechange", () => {
      if ((XHR.readyState === 4) & (XHR.status === 200)) {
        callback(XHR.responseText);
      }
    });

    //Step 3 - open a connection to the server

    XHR.open(method, url);

    // step 4 - send the request to the server

    XHR.send();
  }
  function LoadHeader()
   {
    $.get("./Views/components/header.html", function(html_data)
    {
      $("header").html(html_data);
      
      // capitalize the Active Link and then set the document title to the new string
      document.title = router.ActiveLink.substring(0, 1).toUpperCase() + router.ActiveLink.substring(1);
      // TODO: this needs to be fixed
      $(`li>a:contains(${document.title})`).addClass("active");
      CheckLogin();
    });
    
  }

  function LoadContent()
  {
    let page_name = router.ActiveLink; // alias
    let callback = ActiveLinkCallBack(); // returns a reference to the apprpriate function
    $.get(`./Views/content/${page_name}.html`, function(html_data)
    {
      $("main").html(html_data);

      callback();
    });
    
  }

  function LoadFooter()
  {
    $.get("./Views/components/footer.html", function(html_data)
    {
      $("footer").html(html_data);
    });
  }

  function DisplayHome() {
    console.log("Home Page");
    AjaxRequest("GET", "header.html", LoadHeader);

    $("#AboutUsButton").on("click", function () {
      location.href = "/#/about";
    });

    $("main").append(
      `<p id="MainParagraph" class="mt-3">This is the Main Paragraph</p>`
    );
    //Article.innerHTML = ArticleParagraph;
    $("body").append(`<article class="container">
    <p id="ArticleParagraph" class="mt-3">This is the Article Paragraph</p>
    </article>`);
  }
  function DisplayProducts() {
    console.log("Products Page");
  }
  function DisplayServices() {
    console.log("Services Page");
  }
  function DisplayAbout() {
    console.log("About Page");
  }
  function DisplayContacts() {
    console.log("Contacts Page");
    ContactFormValidation();

    let sendButton = document.getElementById("sendButton");
    let subscribeCheckbox = document.getElementById("subscribeCheckbox");

    sendButton.addEventListener(
      "click",
      function () // override the default onClick event. aka the submit function with this
      {
        if (subscribeCheckbox.checked) {
          console.log("Checkbox Checked!");

          if (subscribeCheckbox.checked) {
            AddContact(fullName.value, contactNumber.value, emailAddress.value);
          }
        }
      }
    );
  }

  function ContactFormValidation() {
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
  function DisplayContactListPage() {
    console.log("Contact List Page");
    
    if (localStorage.length > 0) {
      let contactList = document.getElementById("contactList"); // The tbody from contact-list.html

      let data = ""; // data container -> add deserialized data from localStorage

      let keys = Object.keys(localStorage); // returns a string array of keys from localStorage
  
      let index = 1; //counter for keys
  
      // for every key from Keys array, loop
      for (const key of keys) {
        let contactData = localStorage.getItem(key); // get localStorage data value related to key

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
        location.href = "/#/edit#add";
      });

      $("button.delete").on("click", function () {
        if (confirm("Are you sure?")) {
          localStorage.removeItem($(this).val());
        }

        location.href = "/#/contact-list";
      });

      $("button.edit").on("click", function () {
        location.href = "/#/edit#" + $(this).val();
      });
    }
  }

  function DisplayEditPage() {
    console.log("Edit Page");

    ContactFormValidation();

    let page = location.hash.substring(1);

    switch (page) {
      case "add":
        {
          $("main>h1").text("Add Contact");

          $("#editButton").html(`<i class="fas fa-plus-circle fa-lg"></i> Add`);

          $("#editButton").on("click", (event) => {
            event.preventDefault();
            // Add Contactt
            AddContact(fullName.value, contactNumber.value, emailAddress.value);
            // Refresh the contact-list page
            location.href = "/#/contact-list";
          });

          $("#cancelButton").on("click", () => {
            location.href = "/#/contact-list";
          });
        }
        break;
      default:
        {
          // get the contact info from localStorage
          let contact = new core.Contact();
          contact.deserialize(localStorage.getItem(page));

          // display the contact info in the edit form
          $("#fullName").val(contact.FullName);
          $("#contactNumber").val(contact.ContactNumber);
          $("#emailAddress").val(contact.EmailAddress);

          // when Edit is pressed - update the contact
          $("#editButton").on("click", (event) => {
            event.preventDefault();

            // get any changes from the form
            contact.FullName = $("#fullName").val();
            contact.ContactNumber = $("#contactNumber").val();
            contact.EmailAddress = $("#emailAddress").val();

            // replace the item in localStorage
            localStorage.setItem(page, contact.serialize());

            // return to the contact-list
            location.href = "/#/contact-list";
          });

          $("#cancelButton").on("click", () => {
            location.href = "/#/contact-list";
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
  function AddContact(fullName, contactNumber, emailAddress) {
    let contact = new core.Contact(fullName, contactNumber, emailAddress);
    if (contact.serialize()) {
      let key = contact.FullName.substring(0, 1) + Date.now();

      localStorage.setItem(key, contact.serialize());
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
  function ValidateField(field_Id, regular_expression, error_message) {
    let messageArea = $("#messageArea").hide();

    $("#" + field_Id).on("blur", function () {
      let textContentOfField = $(this).val();
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
  function DisplayRegister() {
    console.log("Register Page");
  }

  function DisplayLogin() 
  {
    console.log("Login Page");
    let messageArea = $("#messageArea").hide();

    $("#loginButton").on("click", () => {
      let success = false;
      // create an empty user object
      let newUser = new core.User();

      // user a jquery shortcut to load the users.json file
      $.get("./Data/users.json", (data) => {
        //for every user in the users.json file, loop
        for (const user of data.users) {
          // check if the username and password entered matched with user
          if (
            username.value == user.Username &&
            password.value == user.Password
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

          sessionStorage.setItem("user", newUser.serialize());

          //hide any errors
          $("#messageArea").removeAttr("class").hide();

          location.href = "/#/contact-list";
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
          location.href = "/#/home";
        });
      });
    });
  }

  function CheckLogin()
  {
    if(sessionStorage.getItem("user"))
    {
      // swap out login link for logout link
      $("#login").html(
        `<a id="logout" class="nav-link" href="#"><i class="fas fa-sign-out-alt"></i> Logout</a>`
      )

      $("#logout").on("click", ()=>{
        sessionStorage.clear();     // clear the session storage
        location.href = "/#/home"; //redirect back to index page
      })
      return true;
    }
  }

  function Display404Page()
  {

  }

  /**
   *  This function returns the callback function
   *  related to the active link
   *
   * @param {string} activeLink
   * @returns {function}
   */
  function ActiveLinkCallBack()
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
        console.error("ERROR: callback does not exist");
        break;
    }
  }
  function Start() {
    console.log("App Started");

    LoadHeader()
    
    LoadContent()

    LoadFooter()
  }

  window.addEventListener("load", Start);
})();
