
var socket = io.connect('http://localhost:3000');
let cards = document.querySelectorAll('div');
let scorePlayerOne = 0;
let scorePlayerTwo = 0;

//carte that was clicked//
let activeCard = "";
//array of two cliked carte//
var activeCards = [];
var scoreOne = document.getElementById('scorePlayerOne');
var scoreTwo = document.getElementById('scorePlayerTwo');
cards = Array.from(cards);
socket.on('message', message =>{
  console.log(message); 
});
//listener for clik that takes id of element in varaible msg and send to the server//
cards.forEach(card => {card.addEventListener('click', (e)=>{
  e.preventDefault();
  const msg = e.target.id;
  socket.emit('infos', msg);
})

 socket.on('reponse', function(msg) {
        console.log("recived", msg);
       var reponseId= document.getElementById(msg);
       clickCard(msg , false);
  })
  
})

const clickCard = function(id, isPlayerOne){
  
      activeCard = document.getElementById(id);
      if (activeCard == activeCards[0])
      return;
      activeCard.classList.remove("hidden");
      if (activeCards.length === 0){
          activeCards[0]=activeCard;
      return;
      }else{
        
          activeCards[1] = activeCard;
          console.log("befor", activeCards);
setTimeout(function(){
  console.log("after",activeCards)
       if (activeCards[0].className === activeCards[1].className){
           console.log("Good job, you found the pair");
        if (isPlayerOne){
           scorePlayerOne++;
           scoreOne.innerHTML="Points " + scorePlayerOne;
        }else{
          scorePlayerTwo++;
          scoreTwo.innerHTML = "Points " + scorePlayerTwo;
        }
           activeCards.forEach(card =>card.classList.add("off"))
        if(scorePlayerOne + scorePlayerTwo == 9){
           const endTime = new Date().getTime();
           const gameTime = (endTime - startTime)/1000;
           alert("Game Over");
           location.reload();
        }
       }else{
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
             /*
           let i=0;
            cards.forEach(card=>{
            card.dataset.id=i
            i++;
          })
          */
          cards.forEach(card=>{ card.classList.add("hidden");
          card.addEventListener("click", ()=>{clickCard(card.id, true)});

  })
  },2000)
  }

  init()
    





   



   