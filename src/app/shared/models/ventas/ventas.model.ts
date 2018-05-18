export class Ventas {
    productName: string;
    productQty: number;
    productId: string;
    price: number;
    total: number;
    productCost: number;
    created_at: string = this.getTodayDate();

    getTodayDate(){
        var date = new Date(); 
        var today = ((date.getMonth()+1) +'/'+ date.getDate() + '/' +   date.getFullYear());  
           return today;
       }
 
}

