const myfunctions ={
    getRepair:function(equipment , slotvalue){
         var itemRepairStatus = [];
         
        slotvalue.forEach(function(itemRequested){
            if(equipment.includes(itemRequested)){
               itemRepairStatus.push({repairavailable: itemRequested}); 
            }else{
                itemRepairStatus.push({repairnotavailable : itemRequested})
            }
        });
        return itemRepairStatus;
    },
    
    checkRoomServices:function(availableServices , requestedServices){
      if(availableServices.includes(requestedServices))
      return true;
        
    },
    
    checkFoodServices:function(availableFoodServices , requestFoodServices){
        //check if user is asking for menu
    //     var checkIfMenuRequested = false;
       
    //   // get food menu
    //   var getFoodMenu = Object.keys(availableFoodServices);
    //   if(requestFoodServices.includes("menu") || requestFoodServices.includes("food")){
    //     var generateFoodMenu ="Do you want to order food from ";
    //         getFoodMenu.forEach( key => generateFoodMenu += ", " + key); 
    //         generateFoodMenu += "?";
    //     return generateFoodMenu;
    //   }
       
    //   //show menu for specific food item
      
    //   //get all food items and check if requested item is available or not
    //     var getAllFood = [];
    //     if(!requestFoodServices.includes("menu") || !requestFoodServices.includes("food")){
    //          getFoodMenu.forEach(key => { 
    //          let value = availableFoodServices[key]; 
    //               value.forEach(element => getAllFood.push(element));
    //         }); 
    //         if(getAllFood.includes(requestFoodServices)){
    //              return "Your food item is ordered and will be delivered soon!";
    //         }else{
    //             return "Sorry! The food item is not available currently.";
    //         }
            
    //     }
    
    if(availableFoodServices.includes(requestFoodServices))
 
      return true;
    }
}
module.exports = myfunctions;
