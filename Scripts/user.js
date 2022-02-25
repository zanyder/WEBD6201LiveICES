(function (core) {
    class User {
        // constructor
        constructor(displayName = "", emailAddress = "", username = "") 
        {
            this.DisplayName = displayName;
            this.EmailAddress = emailAddress;
            this.Username = username;
        }
        // public methods
        serialize() {
            if (this.DisplayName !== "" && this.EmailAddress !== "" && this.Username !== "")
                return `${this.DisplayName},${this.EmailAddress},${this.Username}`;
            console.error("One or more properties of the Contact Object are missing or invalid.");
            return null;
        }
        deserialize(data) {
            let propertyArray = data.split(",");
            this.DisplayName = propertyArray[0];
            this.EmailAddress = propertyArray[1];
            this.Username = propertyArray[2];
        }
        //overridden methods
        toString() {
            return `Full Name: ${this.FullName} \n Contact Number: ${this.ContactNumber} \n Email Address: ${this.EmailAddress}`;
        }

        toJSON()
        {
            return{
                "DisplayName": this.DisplayName,
                "Email Address": this.EmailAddress,
                "Username": this.Username
            }
        }

        fromJSON(data)
        {
            this.DisplayName = data.DisplayName;
            this.EmailAddress = data.EmailAddress;
            this.Username = data.Username;
            this.Password = data.Password;
        }
    }
    core.User = User;
})(core || (core = {}))