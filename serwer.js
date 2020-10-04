
const express = require('express');
const mongodb = require('mongodb');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const MongoClient = mongodb.MongoClient;
const app = express();
const urlDb = 'mongodb+srv://monika:matisse@cluster0.zdf0i.mongodb.net/test';
const dbName = 'memory';
const collectionName = 'users';
const PORT = process.env.PORT || 3000;


app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({ extended: true  }));
app.use('/js', express.static(__dirname + '/public/script'));
app.use('/css', express.static(__dirname + '/public/style'));

app.use(session({
    resave:true,
    saveUninitialized:true,
    secret:'enomatopeya',
    store: new MongoStore({
        url: urlDb,
        dbName:dbName,
        collection:collectionName,
    })
}));

app.get('/', (request, response, next)=>{
    if(request.session.login){
        response.redirect('/game');
    }else{
    response.render('login', { pageTitle: 'Accueil' });
    }
});

app.get('/login', (request, response, next)=>{
    console.log(request.session)
    response.render('login', { pageTitle: 'Accueil' });
});

app.get('/registration', (request,response, next)=>{
    console.log(request.session)
    response.render('registration', { pageTitle: 'Create Your account if You want to Play' });
});
app.get('/game', (request,response, next)=>{
    if(request.session.login){
        response.render('game', {
            _id: request.session._id,
            login: request.session.login,
            pageTitle: 'GameRoom',
        });
    }else{
        response.redirect('/login');
    }
});

app.post('/login', (request, response, next)=>{
    if(!request.body.login || !request.body.password){
        response.redirect('/login');
        app.locals.message = 'Identifiant ou mot de passe non renseigné'
    }else {
        MongoClient.connect(urlDb, { useUnifiedTopology: true }, (err, client )=>{
            if (err){
                next(new Error (err));
            }else {
                const collection = client.db(dbName).collection(collectionName);
                collection.find({ login: request.body.login }).toArray((err, data)=>{
                    client.close();
                    if (err){
                        next (new Error (err));
                    }else {
                        if (!data.length){
                            response.redirect('/login');
                            app.locals.message = 'Identifiant introuvable';
                        }else {
                            if (request.body.password === data[0].password){
                                request.session._id = data[0]._id;
                                request.session.login = data[0].login;
                                response.redirect('/game');
                            }else {
                                response.redirect('/login');
                                app.locals.message = ' Your Passeword is incorect';
                            }
                        }
                    }
                });
            };
      });
   }
});

app.post('/processing', (request, response, next)=> {
    MongoClient.connect(urlDb, { useUnifiedTopology: true }, (err, client)=>{
        if (err){
            next (new Error (err));
        } else {
            const collection = client.db(dbName).collection(collectionName);
            collection.find({ login: request.body.login }).toArray((err, data)=>{
                console.log('data : ', data);
                if (err){
                    next (new Error(err));
                }
            if (data[0] === undefined){
                collection.insertOne({
                    login: request.body.login,
                    password: request.body.password
                }, (err, data)=>{
                    if (err) return;
                    client.close();
                    app.locals.message = 'Great you got your account'
                    response.redirect('/login');
                })
                }else{
                if (request.body.login === data[0].login){
                    app.locals.message = 'There is already un account at this name';
                    response.redirect('/login');
                }
             }
          });
        };
    });
});
            

const server = app.listen(PORT, ()=>{
console.log('Server is running on the port 3000')
})

/**********PARTIE SOCKET IO */
const socket = require("socket.io");
const io = socket(server);
//place to put player index connections
const connection = [null,null];
let activeCard="";
let activeCards=[];
let active;
const enemySquare=[];
io.sockets.on("connection", newConnection);
function newConnection(socket) {
  console.log("connected to WS server ID : " + socket.id);
   //finding  player number
  let playerIndex = -1;
  for(const i in connection){
      if(connection[i] === null){
          playerIndex = i;
          break
      }
  }

  
 //tell what player number they are
  socket.emit('player-number', playerIndex)
  console.log(`player ${playerIndex} has connected`)
  if(playerIndex === -1)return;
  connection[playerIndex] = false;
  socket.broadcast.emit('player-connection', playerIndex);
  socket.on('infos', function(data){
    console.log(data)
    
}) 

}



  

    
















