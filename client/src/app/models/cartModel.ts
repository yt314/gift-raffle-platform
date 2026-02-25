 enum CartStatus
  {
      Draft,    // סל פתוח
      Paid,     // שולם
  }

  export class cartModel{
      public  Id! :number;
      public  UserId !:number;
      public  Status :CartStatus = CartStatus.Draft;
  }