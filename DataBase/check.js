var mongoose = require("mongoose")
var Schema = mongoose.Schema
mongoose.connect("mongodb+srv://usuario1:usuario1@cluster0.bdg80.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", { // mongodb+srv://usuario1:usuario1@cluster0.bdg80.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(function () {
    console.log('\x1b[32m[ BANCO DE DADOS ] \x1b[0mBanco de dados foi ligado "CHECK"');
}).catch(function () {
    console.log('\x1b[31m[ BANCO DE DADOS ] \x1b[0mBanco de dados desligado por erro "CHECK"');
});


var CHECK = new Schema({
    _id: { type: Number, default: 0 },
    check: { type: String, default: "❌" },
    nome: { type: String, default: 0 },
})

var CHECKs = mongoose.model("CHECK", CHECK);
exports.CHECKs = CHECKs
