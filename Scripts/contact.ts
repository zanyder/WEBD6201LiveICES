namespace core
{
    export class Contact {
        //private instance members
        private m_fullName: string;
        private m_contactNumber: string;
        private m_emailAddress: string;

        // gets/sets
        public get FullName(): string {
            //Validation goes here
            return this.m_fullName;
        }
        public set FullName(fullName) {
            this.m_fullName = fullName;
        }
        public get ContactNumber() {
            return this.m_contactNumber;
        }
        public set ContactNumber(contractNumber: string) {
            this.m_contactNumber = contractNumber;
        }
        public get EmailAddress() {
            return this.m_emailAddress;
        }
        public set EmailAddress(emailAddress) {
            this.m_emailAddress = emailAddress;
        }
        constructor(fullName: string = "", contactNumber: string = "", emailAddress: string = "") {
            this.m_fullName = fullName;
            this.m_contactNumber = contactNumber;
            this.m_emailAddress = emailAddress;
        }
        // public methods
        /**
         * This method converts the objects properties to a comma-seperated string
         * @returns string | null
         */
        serialize(): string | null {
            if (this.FullName !== "" && this.ContactNumber !== "" && this.EmailAddress !== "")
                return `${this.FullName},${this.ContactNumber},${this.EmailAddress}`;
            console.error("One or more properties of the Contact Object are missing or invalid.");
            return null;
        }

        /**
         * Seperates the data string parameter into the object's properties
         * @param data 
         */
        deserialize(data: string): void
        {
            let propertyArray: string[] = data.split(",");
            this.FullName = propertyArray[0];
            this.ContactNumber = propertyArray[1];
            this.EmailAddress = propertyArray[2];
        }
        //overridden methods
        /**
         * This method overides the objects ToString method 
         * @override
         * @returns {string} 
         */
        toString(): string
         {
            return `Full Name: ${this.FullName} \n Contact Number: ${this.ContactNumber} \n Email Address: ${this.EmailAddress}`;
        }
    }
}