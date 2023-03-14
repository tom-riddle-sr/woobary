var express = require("express");
var cors = require("cors");
var app = express();

app.use(express.static("test1"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

var fs = require("fs");
var dataFileName = "./data.json";

app.listen(5000);
console.log("Web伺服器就緒，開始接受用戶端連線.");
console.log("「Ctrl + C」可結束伺服器程式.");

app.get("/index", function (req, res) {
    var a = fs.readFileSync(dataFileName)
    var b = JSON.parse(a)
    res.set("Content-type", "application/json")
    res.send(JSON.stringify(b))
})

app.get("/index/item/:id", function (req, res) {
    var a = fs.readFileSync(dataFileName);
    var b = JSON.parse(a);

    var targetIndex = -1;
    for (let i = 0; i < b.length; i++) {
        if (b[i].id.toString() == req.params.id.toString()) {
            targetIndex = i;
            break;
        }
    }
    if (targetIndex < 0) {
        res.send("not found");
        return;
    }

    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify(b[targetIndex]));
})


app.put("/index/item", function (req, res) {
    var a = fs.readFileSync(dataFileName);
    var b = JSON.parse(a);
    for (let i = 0; i < b.length; i++) {
        if (b[i].id == req.body.id) {
            b[i].title = req.body.title;
            break;
        }
    }
    fs.writeFileSync("./data.json", JSON.stringify(b, null, "\t"));
    res.send("row updated.");
})

app.post("/index/add", function (req, res) {
    var a = fs.readFileSync(dataFileName);
    var b = JSON.parse(a);
    var item = {
        "id": new Date().getTime(),
        "title": req.body.title
    }
    b.push(item)
    fs.writeFileSync("./data.json", JSON.stringify(b, null, "\t"))
    res.send("row inserted.");
})
app.delete("/index/del/:id", function (req, res) {
    var a = fs.readFileSync(dataFileName)
    var b = JSON.parse(a);
    
    var dindex = -1
    for (var i = 0; i < b.length; i++) {
        if (b[i].id.toString() == req.params.id.toString()) {
            dindex = i
            break
        }

    }
    b.splice(dindex, 1)
    fs.writeFileSync("./data.json", JSON.stringify(b, null, "\t"))
    res.send("row deleted")

})

