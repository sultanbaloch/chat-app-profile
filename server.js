var express = require('express');
var cors = require('cors');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var path = require("path");
var jwt = require('jsonwebtoken');
var cookieParser = require('cookie-parser');
var { userModle, tweetmodel } = require("./dbrepo/modles");
var app = express();
var authRoutes = require('./routes/auth')
var { SERVER_SECRET } = require("./core/index");

var http = require("http");
var socketIO = require("socket.io");
var server = http.createServer(app);
var io = socketIO(server);


const fs = require('fs')

//==============================================
const multer = require('multer')
const storage = multer.diskStorage({ // https://www.npmjs.com/package/multer#diskstorage
    destination: './uploads/',
    filename: function (req, file, cb) {
        cb(null, `${new Date().getTime()}-${file.filename}.${file.mimetype.split("/")[1]}`)
    }
})
var upload = multer({ storage: storage })


const admin = require("firebase-admin");

var serviceAccount = {
    "type": "service_account",
    "project_id": "chat-app-c6b0f",
    "private_key_id": "04f126ea5158720fc0c83d235bfdb1f91994f183",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCj6EwXxbnrGj7O\nq6lLMkpF/euqzIGfXJ8xLwd2uMP0b28A/GZt2cNiTKdA+07GQYLQBOshBZKS8K6u\nUNPTFlJdndJRw50Nk9zkNLBCiadrbxmpNZYWMEexk+PsA8HTvy+VotgyjMDkiDMo\nyHeG+xn82srCFqCSVjbSRKb4MOMjGjftBKQcrrV/kZU94yNrOuIFJP0u07Mrw092\nbPzUNA84maqzGSuLCy20uIr0RGyEsWdQ/889VwZ6b70UaQT7tsWJlBcsrtnl/uOM\nV0TU17LisC2sVFYEeF2CzgZrOC3C8+4Y9kgWJFnjz7knSjN7RR7SGj6BqK/d8a+a\nTwYU56p1AgMBAAECggEADLaRol1mhocGXJrhenDn5GZlz11l53G0ckjqzAlYP58e\nDcZF/pq/piH6bhaf/U4rAo4DG9BWFlofPmuMBokqcdLyM3/X8Gvp2/R/QGXza6iW\nJbL/lXCAuxQUv2NqNw2S+AkFumQC+SbcSvtDlB9pXFyvEd9V7IvN3EDRb5pBH+GC\nsfiCjjVelEyCIxYe1W5BA7iaR2NW3RRnU86szeUKkhnkd2zQwPLU3PaO1qTBzdAh\nUJxTiXXZu3bqggpkl8Czj37ezNXMvNuP3cVbft4KkUQHcEzDOJX6sZyJrC8G7VxV\n5v5OGnOPiMjlIbF5h2e3bhYgUlnllzT4y1NbHSZj8QKBgQDPapDo6Njiez7GGQlg\naUJU77sj7ysoRgy8SoHiDPeNdRivlsCnY/1fLIzayI7B1in7UWE45ePuBPxsCRw4\nwc9C106+7y3yGgIZpcLANS6DPPCkpO0FLChY0Iz6CYFV9Sc31LhFl5uDMXwb4+Cm\nu7X2IdyJFTFufZll5urdWAFlsQKBgQDKTMgV3gkgzedKZh5lWGl23ObopawUk7yF\nsHHKb4Ox0F9/7FMRdB2ENW5DcVeYGEdhfGuzwDhARCoN+jhIBRxWJ4DYL5LUmeaE\ngtC8qijOLrn/b/gULfreQNqCu4yPFmuW1kezD7F378ilYTIdpPGCuDIBF8wUYr8Z\nzfl75aEOBQKBgB3UNIzaV76SfN+eYCPWX2y5oU80qR88m75EdNNejAdy7J7r7j7k\neV7DmGoqZ6VmuFjlRjcZkKL9YpPi54UeEkGJl1CMMy5bISwxE4Xy4AKNtAnpkhCp\nXhAPxgZ7cXc8L2yvEeUoPXwrlK6qIfe4jR2dlwq72oUKWRI3mFVGv8SxAoGAK4L4\nRjvLmtKuvMHaJ9IsXPSGdeOsb4CXO+oHj5MMsGIxKEKcW1SuRJF5dega/wu5zq4E\nPFVLxAblRLxc/qCax60XeWhCHJg9jKLWYr32qOJD/z0GDtEU9Fjept/QC7a2zWqp\nYUou0a0xauDM9rNTfto/ZxzHOFtE3zf+QTfSvEECgYBWYUfGWoYiHVEVi75FnsIQ\nnTMXf26P7kuWkll4krLOQHeLnNljTOvya7c5O3ZBf42a5glMn8g7qltS8AoFoj+a\nxTndi/+FYmI+3nJsMZsw0/4A/8vBVaAf/gQII2+GJQNKxYlxeaj/2x3624v29z84\nfNKVCjc88muYIRMfdhGZ8w==\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-vneid@chat-app-c6b0f.iam.gserviceaccount.com",
    "client_id": "117398903662143548342",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-vneid%40chat-app-c6b0f.iam.gserviceaccount.com"
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    DATABASE_URL: "https://chat-app-c6b0f-default-rtdb.firebaseio.com/"
});
const bucket = admin.storage().bucket("gs://chat-app-c6b0f.appspot.com");

io.on("connection", () => {
    console.log("user Connected");
})
const PORT = process.env.PORT || 5000;


app.use(cors({
    origin: '*',
    credentials: true
}))
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cookieParser())
app.use('/', authRoutes)
app.use("/", express.static(path.resolve(path.join(__dirname, "public"))));

app.use(function (req, res, next) {
    // console.log('cookie', req.cookies)

    if (!req.cookies.jToken) {
        res.status(401).send("include http-only credentials with every request")
        return;
    }

    jwt.verify(req.cookies.jToken, SERVER_SECRET, function (err, decodedData) {
        if (!err) {
            const issueDate = decodedData.iat * 1000
            const nowDate = new Date().getTime()
            const diff = nowDate - issueDate

            if (diff > 300000) {
                res.status(401).send('Token Expired')

            } else {
                var token = jwt.sign({
                    id: decodedData.id,
                    name: decodedData.name,
                    email: decodedData.email
                }, SERVER_SECRET)
                res.cookie('jToken', token, {
                    maxAge: 86400000,
                    httpOnly: true
                })
                req.body.jToken = decodedData
                next()
            }
        } else {
            res.status(401).send('invalid Token')
        }

    });

})

app.get('/Profile', (req, res, next) => {
    console.log(req.body)
    userModle.findById(req.body.jToken.id, "name email phone gender profilePic createdOn",
        function (err, data) {
            console.log(data)
            if (!err) {
                res.send({
                    profile: data
                })
            } else {
                res.status(404).send({
                    message: "server err"
                })
            }

        })

})

app.post('/tweet', (req, res, next) => {
    // console.log(req.body)

    if (!req.body.userName && !req.body.tweet || !req.body.userEmail) {
        res.status(403).send({
            message: "please provide email or tweet/message"
        })
    }
    var newTweet = new tweetmodel({
        "name": req.body.userName,
        "tweet": req.body.tweet
    })
    newTweet.save((err, data) => {
        if (!err) {
            res.send({
                status: 200,
                message: "Post created",
                data: data
            })
            console.log(data.tweet)
            io.emit("NEW_POST", data)
        } else {
            console.log(err);
            res.status(500).send({
                message: "user create error, " + err
            })
        }
    });
})

app.get('/getTweets', (req, res, next) => {

    console.log(req.body)
    tweetmodel.find({}, (err, data) => {
        if (err) {
            console.log(err)
        }
        else {
            console.log(data)
            // data = data[data.length -1]
            res.send(data)
        }
    })
})




///////////////////////////////*************************************** for only profile picture */



app.post("/upload", upload.any(), (req, res, next) => {

    console.log("req.body: ", req.body);
    console.log("req.body: ", JSON.parse(req.body.myDetails));
    console.log("req.files: ", req.files);

    console.log("uploaded file name: ", req.files[0].originalname);
    console.log("file type: ", req.files[0].mimetype);
    console.log("file name in server folders: ", req.files[0].filename);
    console.log("file path in server folders: ", req.files[0].path);

    bucket.upload(
        req.files[0].path,
        // {
        //     destination: `${new Date().getTime()}-new-image.png`, // give destination name if you want to give a certain name to file in bucket, include date to make name unique otherwise it will replace previous file with the same name
        // },
        function (err, file, apiResponse) {
            if (!err) {
                // console.log("api resp: ", apiResponse);

                file.getSignedUrl({
                    action: 'read',
                    expires: '03-09-2491'
                }).then((urlData, err) => {
                    if (!err) {
                        console.log("public downloadable url: ", urlData[0]) // this is public downloadable url 
                        console.log(req.body.email)
                        userModle.findOne({ email: req.body.email }, (err, users) => {
                            console.log(users)
                            if (!err) {
                                users.update({ profilePic: urlData[0] }, {}, function (err, data) {
                                    console.log(users)
                                    res.send({
                                        status: 200,
                                        message: "image uploaded",
                                        picture: users.profilePic
                                    });
                                })
                            }
                            else {
                                res.send({
                                    message: "error"
                                });
                            }
                        })
                        try {
                            fs.unlinkSync(req.files[0].path)
                           
                        } catch (err) {
                            console.error(err)
                        }

                        
                    }
                })
            } else {
                console.log("err: ", err)
                res.status(500).send();
            }
        });
})



server.listen(PORT, () => {
    console.log("surver is running on : ", PORT)
});







