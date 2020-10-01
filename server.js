
const path = require('path');
const express = require('express');
const mongodb = require('mongodb');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const app = express();

app.use(session({
    resave:true,
    saveUninitialized:true,
    secret:'monika',
    store: new MongoStore({
        url: 'mongodb://localhost:27017/projet'
    })
}));

app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({
  extended: true  
}));
//Affichage du formulaire login/mot de passe
app.get('/login', (request,response, next)=>{
    response.render('login');
});
app.use(express.static(path.join(__dirname, "public")))
//verification login mot passe
app.post('/', (request, response, next)=>{
    request.body.login
    request.body.password
    mongodb.MongoClient.connect('mongodb://localhost:27017/projet', {
        useUnifiedTopology: true
    }, (error, client)=>{
        if (error){
            response.redirect('/login');
        } else {
            const db = client.db('projet');
            db.collection('utilisateurs', (error, collection)=>{
                collection.findOne({
                    login:request.body.login
                }, (error, result)=>{
                    if (error){
                        response.redirect('/login');
                    }else{
                        if (request.body.password === result.password){
                            request.session._id = result._id;
                            request.session.login = result.login;
                            response.redirect('/authenticated');
                        }else{
                            response.redirect('/login');
                        }
                    }
                })
            })
        }
    });
});
// affichage uniquement si l'utilisateur est identifie(possede 1 session)
app.get('/authenticated', (request, reponse, next)=>{
    if (request.session.login){
        reponse.render('authenticated', {
            _id: request.session._id,
            login: request.session.login
        });
    }else{
        response.redirect('/login');
    }
});

app.all((error, request, response, next)=>{
    response.status(404).send('<!DOCTYPE html><html><head><title>Erruer404</title></head><body><h1>Erreur 404 :page non trouver</h1></body></html>');
    });

const server = app.listen(3000, ()=>{
console.log('Server running on the port 3000')
});


//partie web socket
var socket;
const IOServer = require ('socket.io');
const ioServer = new IOServer(server);
ioServer.on('connection', (socket)=>{
    console.log('connexion web socket etablie : '+ socket.id );
    
     

       


  socket.on('quiSuisJe', (id) =>{
      mongodb.MongoClient.connect('mongodb://localhost:27017/projet', {
          useUnifiedTopology:true
      }, (error, client)=>{
          if(error) {
              //utilisateur non idéntifier
              socket.emit('reponseALaQuestion', {});
          }else {
              const db = client.db('projet');
              db.collection('utilisateurs', (error, collection)=>{
                  collection.findOne({
                      _id:mongodb.ObjectID(id)
                  },{
                      projection:{
                          _id:true,
                          login:true
                      }
                  }, (error,user)=>{
                      if (error){
                          //utilisateur non identifier
                          socket.emit('reponseALaQuestion', {});
                      }else{
                          //utilisateur identifier
                          console.log(user);
                          socket.emit('reponseALaQuestion', user);
                      }
                  })
              })
          }
      });
  });  
});
















