/*
// getting socket connection once you are connected
   window.addEventListener('DOMContentLoaded',function(){
    var  socket = io.connect('http://127.0.0.1:3000');
    const turnDisplay = document.querySelector('#whos-go');
    const infoDisplay = document.querySelector('#info');
    socket.on('mouse', mouseMsg)
  })
  */
    var socket = io.connect('http://127.0.0.1:3000');
   /*
    function show(){
      
     var data = {
     x:event.clientX,
     y:event.clientY
     } 
      
   socket.emit('mouse', data)
   console.log("hello", data)
   socket.on('mouse2', data);
   console.log("world", data)
};
*/
let cards = document.querySelectorAll('div');
cards = Array.from(cards);
let activeCard = "";// card witch was clicked//
var activeCards = [];//two cards are stock here to be compare//
const gamePairs = cards.length/2;//nombre the pairs to see if the game is over//
let gameResult = 0;
const startTime = new Date().getTime();
let score= document.querySelector('.ready');
var tablica;
//first click
const clickCard = function(){
activeCard = this;
    if (activeCard == activeCards[0]) return;
        tablica=activeCard.classList.remove("hidden");
        socket.emit('sending', activeCard.dataset.id)
        console.log(activeCard.dataset.id)
        
        
        if (activeCards.length === 0){
            activeCards[0]=activeCard;
         return;
}else{
cards.forEach(card=> card.removeEventListener("click", clickCard))
activeCards[1] = activeCard;

    setTimeout(function(){
    if (activeCards[0].className === activeCards[1].className)
    {
    console.log("Good job, you found the pair")
          score.innerHTML+=1;
          activeCards.forEach(card =>card.classList.add("off"))
          if(gameResult == gamePairs){
              const endTime = new Date().getTime();
              const gameTime = (endTime - startTime)/1000;
              alert("Done ")
              location.reload();
            }
    }else{
            console.log("sorry it's not a pair")
            activeCards.forEach(card => card.classList.add("hidden"))
        }
          activeCard="";
          activeCards.length = 0;//cleaning array, making the blocks ready to click again//
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
    cards.forEach(card=>{
    card.classList.add("hidden")
    card.addEventListener("click",clickCard)
     })
    },2000)
}
init()
 
