namespace core 
{
    export class User {

        // private instance members
        private m_displayName: string;
        private m_emailAddress: string;
        private m_username: string;
        private m_password: string;
        // getters and setters
        
        /**
         *
         *
         * @readonly
         * @type {string}
         * @memberof User
         */
        public get DisplayName(): string {
            return this.m_displayName;
        }
        public set DisplayName(name: string)
        {
            this.m_displayName = name;
        }

        public get EmailAddress(): string 
        {
            return this.m_emailAddress;
        }

        public set EmailAddress(email_address: string)
        {
            this.m_emailAddress = email_address;
        }
        public get Username(): string 
        {
            return this.m_username;
        }

        public set Username(user_name: string)
        {
            this.m_username = user_name;
        }

        public get Password(): string 
        {
            return this.m_password;
        }

        public set Password(pass_word: string)
        {
            this.m_password = pass_word;
        }



        // constructor
        constructor(displayName = "", emailAddress = "", username = "", password = "") 
        {
            this.m_displayName= displayName;
            this.m_emailAddress = emailAddress;
            this.m_username = username;
            this.m_password = password
        }
        // public methods
        /**
         * This method voncerts the object's properties into
         * a comma-seperated string
         *
         * @return {*}  {(string | null)}
         * @memberof User
         */
        serialize(): string | null
         {
            if (this.m_displayName !== "" && this.m_emailAddress !== "" && this,this.m_username !== "")
                return `${this.m_displayName},${this.EmailAddress},${this.Username}`;
            console.error("One or more properties of the Contact Object are missing or invalid.");
            return null;
        }
        
        /**
         * Seperates the data string parameter into the object's properties
         * @param data 
         */
        deserialize(data: string) {
            let propertyArray: string[] = data.split(",");
            this.m_displayName = propertyArray[0];
            this.m_emailAddress = propertyArray[1];
            this.m_username = propertyArray[2];
        }
        //overridden methods
        toString():string 
        {
            return `Display Name: ${this.DisplayName} \n Email Address: ${this.EmailAddress} \n Username: ${this.Username}`;
        }

        //  TODO need t fix the return type
        toJSON()
        {
            return{
                "Display Name": this.m_displayName,
                "Email Address": this.EmailAddress,
                "Username": this.Username
            }
        }

        // need to fix the return param type
        fromJSON(data: any)
        {
            this.m_displayName = data.DisplayName;
            this.m_emailAddress = data.EmailAddress;
            this.m_username = data.Username;
            this.m_password = data.Password;
        }
    }

}