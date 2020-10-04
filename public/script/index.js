
  var socket= io();
  let cards = document.querySelectorAll('div');
  let btn = document.querySelector('button');
  let score= document.querySelector('.ready');
  cards = Array.from(cards);
  let activeCard = "";//carte that was clicked//
  var activeCards = [];//pair of carte to be checked, if they have the same class name//
  var active;
  const gamePairs = cards.length/2;
  let gameResult = 0;
  const startTime = new Date().getTime();
  let playerNumber = 0;
  // once player has connected on click he gonne get connected to socket//
  btn.addEventListener('click', start);

  function start(){
    var socket = io();
     socket.on('player-Number', num =>{
       if(num === -1){
         alert("No place for other player, you have to wait")
         }else{
               playerNumber=parseInt(num)
              if(playerNumber === 1) currentPlayer = "otherPlayer"
              }
         })

       socket.on('player-connection', num =>{
       console.log(`Player numbero ${num} has connected`)
      });
      
     } 
  
      

  //main function of the game//
const clickCard = function(){
      activeCard = this;
      if (activeCard == activeCards[0])
      return;
      activeCard.classList.remove("hidden"); //when card id clicked remowe black and show color//
              //active stock the number of id of card that was clicked//
      active=activeCard.dataset.id;
      if (activeCards.length === 0){
          activeCards[0]=activeCard;
      return;
      }else{
          cards.forEach(card=> card.removeEventListener("click", clickCard))
          activeCards[1] = activeCard;

 setTimeout(function(){
       if (activeCards[0].className === activeCards[1].className){
        console.log("Good job, you found the pair");
          activeCards.forEach(card =>card.classList.add("off"))
       if(gameResult == gamePairs){
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
          activeCards.length = 0;
          cards.forEach(card=> card.addEventListener("click",clickCard))
  }, 1000)
  }}

  const init = function(){
        setTimeout(function(){
           let i=0;
            cards.forEach(card=>{
            card.dataset.id=i
            i++;
          })
          cards.forEach(card=>{ card.classList.add("hidden")
          card.addEventListener("click",clickCard)
  })
  },2000)
  }
  init()
    





   



   