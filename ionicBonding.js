/**************************************************************
*Title:         Ionic Bonding Practice App
*Author:        Patrick Levy
*Last Updated:  3/31/2015  9:20PM
****************************************************************/

/************************************************************
/The following code will run on both the client and server
************************************************************/
//Create a collection of players in the Mongo Database to store scores
PlayersList = new Mongo.Collection('players');

/************************************************************
/The following code will only run on the client
************************************************************/
if (Meteor.isClient) {
  // Set defaults
  Session.setDefault('feedback', " ");
  Session.setDefault('anionFormula', " ");
  Session.setDefault('cationFormula', " ");
  Session.setDefault('anionName', " ");
  Session.setDefault('cationName', " ");
  Session.setDefault('scoreDisplay', 0);
  score = 0;
  attempts = 0;
  firstCheck = true
  
  //Select cation and anion
  pickIons();
  
  /**************************************************
  *Function: Randomly Selects a cation and anion
  ***************************************************/
  function pickIons(){
    
    //Check the number of anions in database
    numAnIons = ions.anions.length;

    //Generate a random anion index
    anionIndex = Math.floor((Math.random() * numAnIons));

    //Set the anion that was chosen  
    Session.set('anionFormula', ions.anions[anionIndex].formula);
    Session.set('anionName', ions.anions[anionIndex].name);

    //Check the number of cations in database
    numCatIons = ions.cations.length;

    //Generate a random cation index
    cationIndex = Math.floor((Math.random() * numCatIons));
      
    //Set the cation that was chosen
    Session.set('cationFormula', ions.cations[cationIndex].formula);
    Session.set('cationName', ions.cations[cationIndex].name);

    //Reset firstCheck, feedback, and selectors
    firstCheck = true;
    };

  /**********************************************************
  *Function: Check user's selected subscripts for correctness
  ***********************************************************/
  function checkInput(){
  
    //Take input from user selections
    cationSubscript = document.getElementById("catSubVal").value;
    anionSubscript = document.getElementById("anSubVal").value;

    //Calculate net positive and net negative charge
    posCharge = cationSubscript * ions.cations[cationIndex].charge;
    negCharge = anionSubscript * ions.anions[anionIndex].charge;
      
      //Indicate to user that they were correct
      if (posCharge === negCharge){
        Session.set('feedback', "Your answer is correct!");

        //Award points for first attempt
        if (firstCheck === true){
          score++;
          attempts++;
          Session.set('scoreDisplay', score);
          }
        
        //Pick new ions for next problem
        setTimeout (pickIons, 700);
        setTimeout (clearFeedback, 700);
        setTimeout (clearSelectors, 700);    //Why doesn't this work with parentheses e.g. clearSelectors() ?? 
    }
    else {
        //Indicate to user that were incorrect
        Session.set('feedback', "Your answer was incorrect! Try again.");
        clearSelectors();
        firstCheck = false;
        attempts++
    }
  };

  /**********************************************************
  *Function: Clear feedback indicator on screen
  ***********************************************************/
  function clearFeedback(){
      Session.set('feedback', '');
  };

  /**********************************************************
  *Function: Clear subscript selectors
  ***********************************************************/
  function clearSelectors(){
    catSubVal.options[0].selected = true;
    anSubVal.options[0].selected = true;

  };
  /*******************************************************************
  *Meteor Template: Provide feedback on correctness of subscripts
  ********************************************************************/
  Template.checkAnswers.helpers({
    feedback: function () {
      return Session.get('feedback');
    }
  });
  /*******************************************************************
  *Meteor Templates: Show formulas for selected cations and anions
  ********************************************************************/
  Template.ions.helpers({
    showCations: function () {
      return Session.get('cationFormula');
    },
    showAnions: function () {
      return Session.get('anionFormula');
    }
  });
  /*******************************************************************
  *Meteor Templates: Show names for selected cations and anions
  ********************************************************************/
  Template.displayName.helpers({
    showCatName: function () {
      return Session.get('cationName');
    },
    showAnName: function () {
      return Session.get('anionName');
    }
  });
  /**************************************************************************************
  *Meteor Templates: Call functions to check user input for correctness upon button click
  ***************************************************************************************/
  Template.checkAnswers.events({
    'click button': function () {
      checkInput();
      return Session.get('feedback');
  }
  });
  /*******************************************************************
  *Meteor Templates: Record current session score and name
  ********************************************************************/
  Template.addPlayerForm.events({
    'submit form': function(event) {
      event.preventDefault(); //Stops browser from refreshing, etc. after submit
      var playerNameVar = event.target.playerName.value;
      var currentUserId = Meteor.userId();
      PlayersList.insert({
        name: playerNameVar,
        score: score,
        attempts: attempts,
        createdBy: currentUserId
      });
    }
  });
  /*******************************************************************
  *Meteor Templates: Display score of current player's session
  ********************************************************************/
  Template.displayScore.helpers({
    'showScore': function () {
    return Session.get('scoreDisplay');
  }
  });
  /*******************************************************************
  *Meteor Templates: Returns the list of players with saved sessions
  ********************************************************************/
  Template.sessions.helpers({
    'player': function(){
      return PlayersList.find()
    }
  });
}
/************************************************************
/The following code will only run on the server
************************************************************/
if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}