"use strict";
var core;
(function (core) {
    class User {
        m_displayName;
        m_emailAddress;
        m_username;
        m_password;
        get DisplayName() {
            return this.m_displayName;
        }
        set DisplayName(name) {
            this.m_displayName = name;
        }
        get EmailAddress() {
            return this.m_emailAddress;
        }
        set EmailAddress(email_address) {
            this.m_emailAddress = email_address;
        }
        get Username() {
            return this.m_username;
        }
        set Username(user_name) {
            this.m_username = user_name;
        }
        get Password() {
            return this.m_password;
        }
        set Password(pass_word) {
            this.m_password = pass_word;
        }
        constructor(displayName = "", emailAddress = "", username = "", password = "") {
            this.m_displayName = displayName;
            this.m_emailAddress = emailAddress;
            this.m_username = username;
            this.m_password = password;
        }
        serialize() {
            if (this.m_displayName !== "" && this.m_emailAddress !== "" && this, this.m_username !== "")
                return `${this.m_displayName},${this.EmailAddress},${this.Username}`;
            console.error("One or more properties of the Contact Object are missing or invalid.");
            return null;
        }
        deserialize(data) {
            let propertyArray = data.split(",");
            this.m_displayName = propertyArray[0];
            this.m_emailAddress = propertyArray[1];
            this.m_username = propertyArray[2];
        }
        toString() {
            return `Display Name: ${this.DisplayName} \n Email Address: ${this.EmailAddress} \n Username: ${this.Username}`;
        }
        toJSON() {
            return {
                "Display Name": this.m_displayName,
                "Email Address": this.EmailAddress,
                "Username": this.Username
            };
        }
        fromJSON(data) {
            this.m_displayName = data.DisplayName;
            this.m_emailAddress = data.EmailAddress;
            this.m_username = data.Username;
            this.m_password = data.Password;
        }
    }
    core.User = User;
})(core || (core = {}));
//# sourceMappingURL=user.js.map