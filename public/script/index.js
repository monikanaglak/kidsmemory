
var socket = io.connect('http://localhost:3000');
let cards = document.querySelectorAll('div');
let scorePlayerOne = 0;
let scorePlayerTwo = 0;
//carte that was clicked//
let activeCard = "";
//array of two cliked carte//
var activeCards = [];
//array of sockets id//
var allPlayer=[];
var scoreOne = document.getElementById('scorePlayerOne');
var scoreTwo = document.getElementById('scorePlayerTwo');
var resultat = document.getElementById('winner');


cards = Array.from(cards);
socket.on('message', message =>{
  console.log(message); 
});
//trying to show avatar for each connection, this time server sends element of array with png in it //
/*
socket.on('avatar', function(data){
  console.log(data);
  var avatarReponse = document.getElementsByTagName(data);
  console.log(monika)
});
*/
//Trying to get for each socket different avatar, i'm pushing socket.id in array, filtring array and getting show avatar//
socket.on('yournumber', function(data){
  console.log(data);
  //putting all socket id in array allPlayer//
  
  let numberOfPlayers = data;
  if (numberOfPlayers >= 1 ){
    document.getElementById('jeden').style.display="block";
    document.getElementById('dwa').style.display='none';
  } if (numberOfPlayers >= 2){
    document.getElementById('dwa').style.display="block";
  }
})


//listener for clik that takes id of element in varaible msg and send to the server//
cards.forEach(card => {card.addEventListener("click", (e)=>{
  e.preventDefault();
  const msg = e.target.id;
  socket.emit('infos', msg);
})
//response of the server with card enemy clicked//
 socket.on('reponse', function(msg) {
        console.log("recived", msg);
        var reponseId= document.getElementById(msg);
        clickCard(msg, false);
  })
})

const clickCard = function(id, isPlayerOne){
      activeCard = document.getElementById(id);
      if (activeCard == activeCards[0])
      return;

      activeCard.classList.remove("hidden");
      if (activeCards.length === 0){
          activeCards[0] = activeCard;
      return;

      }
      else
      {
          activeCards[1] = activeCard;
          console.log("before", activeCards);

setTimeout(function(){
          console.log("after", activeCards);
        if (activeCards[0].className === activeCards[1].className){
           console.log("Good job, you found the pair");
        if (isPlayerOne){
           scorePlayerOne++;
           scoreOne.innerHTML="Points " + scorePlayerOne;

        }
        else
        {
          scorePlayerTwo++;
          scoreTwo.innerHTML = "Points " + scorePlayerTwo;
        }
          activeCards.forEach(card =>card.classList.add("off"))
        if(scorePlayerOne + scorePlayerTwo == 9){

          alert("Game over");
          if(scorePlayerOne > scorePlayerTwo){
            resultat.innerHTML = "Player one won the game"
          
         }else{
           resultat.innerHTML = " Enemy won the game "
         }
           const endTime = new Date().getTime();
           const gameTime = (endTime - startTime)/1000;
           alert("Game Over");
           location.reload();
       }
       }
       else
       {
          console.log("sorry it's not a pair")
          activeCards.forEach(card => card.classList.add("hidden"))
        }
          //resetting the table with card, making them ba able to be clickable again
          activeCard="";
          activeCards = [];
          /*
          cards.forEach(card=> card.addEventListener("click",()=>{clickCard(card.id)}));
          */
        }, 1000)
        }} 
      
const init = function(){
           setTimeout(function(){
          cards.forEach(card=>{ card.classList.add("hidden");
          card.addEventListener("click", ()=>{clickCard(card.id, true)});

        })
        },2000)
        }

        init()
    





   



   