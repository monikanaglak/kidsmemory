
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
app.use('/img', express.static(__dirname + '/public/img'));

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

/**********PARTIE SOCKET IO *****////////

var socketio = require('socket.io');
const http = require('http');
const io= socketio(server);
var avatars = [];
/*
app.use(express.static('public'));
*/
//connections of sockets//

io.on('connection', socket =>{
    if (avatars.length>=2) return;
    avatars.push({WS: socket, id: socket.id});
    console.log('You made socket connection');
    console.log(`Player ${socket.id} has connected`);
    for ( let player of avatars){
        
        player.WS.emit('yournumber', avatars.length)
    }
    socket.emit('message', 'Welcome to my game');
    socket.broadcast.emit('message', 'A user has join the game');
    socket.on('disconnect', ()=>{
        io.emit('message', 'A user has left the game');
        let idToDelete = socket.id;
        avatars = avatars.filter((i)=>{return i.id !== idToDelete })
        console.log(avatars.length);
        for ( let player of avatars){
        
            player.WS.emit('yournumber', avatars.length)
        }
    });
    
    socket.on('infos', msg =>{ 
        console.log(msg);
        socket.broadcast.emit('reponse', msg);
    });
});

  

    
















