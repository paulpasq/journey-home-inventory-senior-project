export interface IInventory {
    element: any;
    DonationID: number;
      
    Tag: string; 
    DateRecieved: string;
    Donator: {

      DonatorID: number;
      Email: String;
      Name: String;
      Phone: String;
      Town: String;
   }
    DateDonated: string; 
    Condition: string; 
    Name: string; 
    Photo: string;
    PrimaryCategory: string; 
    SecondaryCategory: string; 
    DonatorID: number;
    Email: string;
    Quantity: number;
    Archived: boolean;
 }