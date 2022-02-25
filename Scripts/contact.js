(function (core) {
    class Contact {
        // // gets/sets
        // get FullName() {
        //     //Validation goes here
        //     return this.m_FullName;
        // }
        // set FullName(fullName) {
        //     this.m_FullName = fullName;
        // }
        // get ContactNumber() {
        //     return this.m_ContactNumber;
        // }
        // set ContactNumber(contractNumber) {
        //     this.m_ContactNumber = contractNumber;
        // }
        // get EmailAddress() {
        //     return this.m_EmailAddress;
        // }
        // set EmailAddress(emailAddress) {
        //     this.m_EmailAddress = emailAddress;
        // }
        // constructor
        constructor(fullName = "", contactNumber = "", emailAddress = "") {
            this.FullName = fullName;
            this.ContactNumber = contactNumber;
            this.EmailAddress = emailAddress;
        }
        // public methods
        serialize() {
            if (this.FullName !== "" && this.ContactNumber !== "" && this.EmailAddress !== "")
                return `${this.FullName},${this.ContactNumber},${this.EmailAddress}`;
            console.error("One or more properties of the Contact Object are missing or invalid.");
            return null;
        }
        deserialize(data) {
            let propertyArray = data.split(",");
            this.FullName = propertyArray[0];
            this.ContactNumber = propertyArray[1];
            this.EmailAddress = propertyArray[2];
        }
        //overridden methods
        toString() {
            return `Full Name: ${this.FullName} \n Contact Number: ${this.ContactNumber} \n Email Address: ${this.EmailAddress}`;
        }
    }
    core.Contact = Contact;
})(core || (core = {}))