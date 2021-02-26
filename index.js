/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');
//const { SimplifiedMVSIntent } = require('ask-sdk-controls');
const functions = require('./functions.js');

const equipments = ["TV","television","heating","heater","cooling","air conditioner","shower","basin","sink","wash basin","minibar"];
const availableRoomServices =["a late check-out","check-out","stock minibar","To order a ride","room clean","blanket","towel","extra towel","hairdryer","hair products","shampoo","charger","toothbrush","bathrobe","hand sanitizer","face mask","today’s room service special","room upgrade","flowers"];
const availableFoodServices =["fries", "salad", "crisps", "sandwich", "chocolate", "beer","sprite","pepsi","coca-cola","xyz-dish","abc-dish","pqr-dish" ,"waffers","grapes","watermelon","mangoes","apple"];

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'Welcome to Hotel Cloud. Which would you like to try?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            
            .getResponse();
    }
};

const HelloWorldIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'HelloWorldIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Hello World!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};


//const SerivceIntentHandler ={
//     canHandle(handlerInput) {
//         return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
//             && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ServiceIntent'
//     },
//      handle(handlerInput) {
//          var speakOutput = "";
//           const repromptText ="";
         
//          const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
//          const foodQuery = Alexa.getSlotValue(handlerInput.requestEnvelope, 'foodservices');
         
//          if(sessionAttributes.foodQuery){
            
//          }
         
//          if(foodQuery.includes("food")){
//               speakOutput = "You can order food from drink , snacks and fruits.";
//               repromptText = "What would you like to order from?";
//          }else{
//               sessionAttributes.foodQuery = foodQuery;
//               // setting if user is asking for food
//             handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
//             repromptText = `What do you want to order from ${foodQuery}?`;
//          }
           
         
//             return handlerInput.responseBuilder
//                 .speak(speakOutput)
//                 .reprompt(repromptText)
//                 .addElicitSlotDirective('foodQuery')
//                 //.withShouldEndSession(shouldEndSession)
//                 .getResponse();
//      }
     
     
    
// };

const RepairIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'RepairIntent';
    },
    handle(handlerInput) {
        
        var speakOutput="";
        var repromtOutput ="";
        var equipmentOrList = [];
        var itemsToBeRepaired = [];
        var itemsCantBeRepaired = [];
        const slotDescription = handlerInput.requestEnvelope.request.intent.slots.equipment;
         
         
        if (slotDescription.slotValue.type == "List") {
            slotDescription.slotValue.values.forEach( equipmentOrListe =>equipmentOrList.push(equipmentOrListe.value));
        } else {
            equipmentOrList.push(slotDescription.slotValue.value);
        }
        
        const isRepairAvailable = functions.getRepair(equipments , equipmentOrList);
        
       for(var i =0; i < isRepairAvailable.length ; i++){
           if(isRepairAvailable[i].repairavailable){
               itemsToBeRepaired.push(isRepairAvailable[i].repairavailable);
           }
           
           if(isRepairAvailable[i].repairnotavailable){
               itemsCantBeRepaired.push(isRepairAvailable[i].repairnotavailable);
           }
           
       }
      //console.log(itemsCantBeRepaired);
        if(itemsCantBeRepaired.length > 0){
            const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
            sessionAttributes.maintenanceCall = true;
            handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
            speakOutput = `I'm sorry for the inconvenience.would you like me to inform maintenance?`
            repromtOutput = `would you like me to inform maintenance? `;
            
        }else if(itemsToBeRepaired.length > 0){
             speakOutput = `I'm really sorry for the inconvenience. I've notified maintenance to fix your ${itemsToBeRepaired}, and they'll be with you in 10 minutes. Can I help you with anything else?`;
             repromtOutput =`Can I help you with anything else?`;
            
        }else{
            speakOutput=`I'm sorry I didn't quite understand that request, can you please try again?`;
            repromtOutput = `can you please try again?`; 
        }
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromtOutput)
            .getResponse();
    }
};



// 

const HourIntentHandler ={
     canHandle(handlerInput) {
         return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'HourIntent'
            && (!handlerInput.attributesManager.getSessionAttributes().spaAppointment
            && !handlerInput.attributesManager.getSessionAttributes().askForAppointmentDate);
    },
     handle(handlerInput) {
         const hourQureryFor = Alexa.getSlotValue(handlerInput.requestEnvelope, 'clock');
         const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
         var speakOutput = "";
         
         if(hourQureryFor.includes("spa")){
            speakOutput =  `The spa is open from 9am to 6pm every day. Would you like to make an appointment?`;
            sessionAttributes.spaAppointment = true;
            handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
         }
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
    
};

const BookApointmentHandler = {
    canHandle(handlerInput) {
         return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'HourIntent'
            && (!handlerInput.attributesManager.getSessionAttributes().spaAppointment
            && handlerInput.attributesManager.getSessionAttributes().askForAppointmentDate);
           
    },
     handle(handlerInput) {
         const bookingAppointmentTime = Alexa.getSlotValue(handlerInput.requestEnvelope, 'date');
         //const fixappointment = "";
          var speakOutput = "";
         if(handlerInput.attributesManager.getSessionAttributes().askForAppointmentDate){
             speakOutput = `Ok, You have made the appointment for spa at ${bookingAppointmentTime}, Would You like to confirm?`;
             
         }
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .addElicitSlotDirective('apointmentTime')
            //.addConfirmSlotDirective("fixappointment")
            .getResponse();
    }
    
};



const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
// const FallbackIntentHandler = {
//     canHandle(handlerInput) {
//         return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
//             && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
//     },
//     handle(handlerInput) {
//         const speakOutput = 'Sorry, I don\'t know about that. Please try again.';

//         return handlerInput.responseBuilder
//             .speak(speakOutput)
//             .reprompt(speakOutput)
//             .getResponse();
//     }
// };
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */


const YesIntentHandler = {
    canHandle(handlerInput) {
       // console.log(handlerInput.requestEnvelope.request.intent.slots.apointmentTime.value ?handlerInput.requestEnvelope.request.intent.slots.apointmentTime.value : '' );
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.YesIntent'
            &&( !handlerInput.attributesManager.getSessionAttributes().maintenanceCall
            && !handlerInput.attributesManager.getSessionAttributes().spaAppointment)
    },
    handle(handlerInput) {
        
        const speakOutput = 'Ok! What else would you like to to have?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
       
    }
};

const MaintenanceIntentHandler = {
    canHandle(handlerInput) {
       //console.log(Alexa.getSlotValue(handlerInput.requestEnvelope, 'fixappointment'));
       //console.log(handlerInput.requestEnvelope.request.intent.slots.fixappointment.confirmationStatus);
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.YesIntent'
            && (handlerInput.attributesManager.getSessionAttributes().maintenanceCall
            || handlerInput.attributesManager.getSessionAttributes().spaAppointment);
    },
    handle(handlerInput) {
         let speakOutput = "";
          const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        if(handlerInput.attributesManager.getSessionAttributes().maintenanceCall){
             speakOutput = `We have informed the maintenance team. They will get back to you shortly.`;
          return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
        }
        
            
        if(handlerInput.attributesManager.getSessionAttributes().spaAppointment){
             speakOutput = `What time should i schedule your appointment?`;
             sessionAttributes.spaAppointment = false;
             sessionAttributes.askForAppointmentDate = true;
             return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
       
        }

       
    }
};

const NoIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.NoIntent';
    },
    handle(handlerInput) {
        
        const speakOutput = 'Thank you for using the services of hotel cloud. We wish you a good day.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.withShouldEndSession(true)
            .getResponse();
    }
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
         handlerInput.attributesManager.getSessionAttributes().maintenanceCall = false;
         handlerInput.attributesManager.getSessionAttributes().spaAppointment = false;
           handlerInput.attributesManager.getSessionAttributes().askForAppointmentDate = false;
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};

/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
// const IntentReflectorHandler = {
//     canHandle(handlerInput) {
//         return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
//     },
//     handle(handlerInput) {
//         const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
//         const speakOutput = `You just triggered ${intentName}`;

//         return handlerInput.responseBuilder
//             .speak(speakOutput)
//             //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
//             .getResponse();
//     }
// };
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
// const ErrorHandler = {
//     canHandle() {
//         return true;
//     },
//     handle(handlerInput, error) {
//         const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
//         console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

//         return handlerInput.responseBuilder
//             .speak(speakOutput)
//             .reprompt(speakOutput)
//             .getResponse();
//     }
// };

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        HelloWorldIntentHandler,
        CancelAndStopIntentHandler,
        //FallbackIntentHandler,
        SessionEndedRequestHandler,
        RepairIntentHandler,
       // SerivceIntentHandler,
        YesIntentHandler,
        NoIntentHandler,
        MaintenanceIntentHandler,
        HourIntentHandler,
        BookApointmentHandler
       // SimplifiedMVSIntent
        )
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();
