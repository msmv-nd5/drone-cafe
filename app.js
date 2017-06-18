const express = require("express");
const bodyParser = require("body-parser");
var {ObjectId} = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const drone = require('netology-fake-drone-api');

const app = express();
const rtAPIv1 = express.Router();



app.use("/node_modules", express.static(__dirname + '/node_modules'));
app.use("/src", express.static(__dirname + '/src'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended": true}));



app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

app.use("/api/v1", rtAPIv1);
var io = require('socket.io').listen(app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
}));


io.on('connection', function (socket) {
MongoClient.connect("mongodb://dronecafe:ljcfctNFNG0PNcykW9KE@ds123182.mlab.com:23182/dronecafe", function(err, db) {
    db.collection('users', function(err, collection) {
        //collection.remove({});
        //список пользователей
        rtAPIv1.get("/users/", function(req, res) {
            collection.find().toArray((err, result) => {
                res.send(result);
            });
        });

        //новый пользователь
        rtAPIv1.post("/users/", function(req, res) {
            let user = new User(req.body.name,req.body.email,req.body.credit);
            collection.insert(user, (err, result) => {
                res.send(result);
            });
        });

        //баланс пользователя его email
        rtAPIv1.get("/users/:email", function(req, res) {
            collection.find({"email": req.params.email}).toArray((err, result) => {
                res.send(result);
            });
        });

        //обновляем пользователя его email
        rtAPIv1.put("/users/", function(req, res) {
            let user = new User(req.body.name, req.body.email, req.body.credit);
            collection.update({"email": req.body.email}, user, (err, result) => {
                res.send(result);
            });
        });

    });

    db.collection('menu', function(err, collection) {
        //список
        rtAPIv1.get("/menu/", function(req, res) {
            collection.find().toArray((err, result) => {
                res.send(result);
            });
        });
    });


    db.collection('order', function(err, collection) {
        //collection.remove({});
        //список
        rtAPIv1.get("/orders/", function(req, res) {
            collection.find().toArray((err, result) => {
                res.send(result);
            });
        });

        //новый заказ
        rtAPIv1.post("/orders/", function(req, res) {
            let order = new Order(req.body.email,req.body.title,req.body.image,req.body.rating,req.body.ingredients,req.body.price,req.body.status, new Date(), 0, 0, 0);
            collection.insert(order, (err, result) => {
                socket.broadcast.emit('new order');
                res.send(result);
            });
        });

        //обновить заказ по id
        rtAPIv1.put("/orders/:id", function(req, res) {
            let order = new Order(req.body.email,req.body.title,req.body.image,req.body.rating,req.body.ingredients,req.body.price,req.body.status, req.body.starttime, 0, 0, 0);
            collection.update({"_id": ObjectId(req.params.id)}, order, (err, result) => {
                socket.broadcast.emit('order changed', {
                    data: order
                });

                if (req.body.status == "cooking") {
                    order.cookingStarted = new Date();
                    collection.update({"_id": ObjectId(req.params.id)}, order, (err, result) => {
                        socket.broadcast.emit('new order');
                    })
                }


                if (req.body.status == "deliver") {
                    order.cookedIn = new Date() - new Date(order.cookingStarted);
                    collection.update({"_id": ObjectId(req.params.id)}, order, (err, result) => {
                        socket.broadcast.emit('new order');
                    })

                    drone.deliver(order)
                        .then(() => {
                        order.status = "delivered";
                        order.endtime = Math.floor((new Date() - new Date(order.starttime)) / 1000);
                            collection.update({"_id": ObjectId(req.params.id)}, order, (err, result) => {
                                socket.broadcast.emit('order changed', {
                                    data: order
                                });


                                setTimeout(()=>{
                                    order.status = "deleted";
                                    collection.update({"_id": ObjectId(req.params.id)}, order, (err, result) => {
                                        socket.broadcast.emit('order changed', {
                                            data: order
                                        });
                                    })
                                }, 120000);


                            })
                        })
                        .catch(() => {
                            order.status = "problem";
                            collection.update({"_id": ObjectId(req.params.id)}, order, (err, result) => {
                                //обновляем баланс

                                db.collection('users', function(err, userCollection) {
                                    userCollection.update({"email": order.email}, {$inc: { credit: order.price }});
                                });

                                socket.broadcast.emit('order changed', {
                                    data: order
                                });

                               /* Код для автоудаления проблемного заказа.
                               Закомментирован, т.к. по доп. заданию предлагаем клиенту самому решить что делать с заказом.
                               setTimeout(()=>{
                                    order.status = "deleted";
                                    collection.update({"_id": ObjectId(req.params.id)}, order, (err, result) => {
                                        socket.broadcast.emit('order changed', {
                                            data: order
                                        });
                                    })
                                }, 120000);*/
                            })
                        });
                }
                res.send(result);
            });
        });

        //список заказов пользователя
        rtAPIv1.get("/orders/:email", function(req, res) {
            collection.find({"email": req.params.email}).toArray((err, result) => {
                res.send(result);
            });
        });

    });
});
});









class User {
    constructor(name, email, credit) {
        this.name = name;
        this.email = email;
        this.credit = credit;
    }
}

class Order {
    constructor(email, title, image, rating, ingredients, price, status, starttime, endtime, cookingStarted, cookedIn) {
        this.email = email;
        this.title = title;
        this.image = image;
        this.rating = rating;
        this.ingredients = ingredients;
        this.price = price;
        this.status = status;
        this.starttime = starttime;
        this.endtime = endtime;
        this.cookingStarted = cookingStarted;
        this.cookedIn = cookedIn;
    }
}
