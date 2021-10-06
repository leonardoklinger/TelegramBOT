const TelegramBot = require('node-telegram-bot-api');
const config = require("./Eventos/config.json")
const check = require("./DataBase/check.js")
const moment = require("moment")
const donopermi = 1863053419
const client = new TelegramBot(config.token, { polling: true })
require('dotenv').config();
process.env.NTBA_FIX_319 = 1;


client.on('message', function (msg) {
        let farm = msg.text.toLowerCase().indexOf('/farm');
        let lista = msg.text.toLowerCase().indexOf('/lista');
        let idremover = msg.text.toLowerCase().indexOf('/idremover');
        let reset = msg.text.toLowerCase().indexOf('/reset');
        let remover = msg.text.toLowerCase().indexOf('/remover');

});

client.onText(/\/farm/, (message) => {
        chatId = message.chat.id;
        check.CHECKs.findOne({ "_id": message.from.id }, async function (err, documento) {
                if (err) {
                        client.sendMessage(chatId, 'Erro ao confirmar seu farm');
                } else {
                        if (documento) {
                                if (documento.check === '✅') {
                                        client.sendMessage(chatId, `${message.from.first_name}, você já confirmou seu farm diário.`).catch(err => console.log(err))
                                } else {
                                        client.sendMessage(chatId, `${message.from.first_name}, você acabou de confirmar seu farm diário. ✅`).catch(err => console.log(err))
                                        documento.check = '✅'
                                        documento.save()
                                }
                        } else {
                                if (message.from.last_name == undefined) {
                                        new check.CHECKs({ _id: message.from.id, nome: message.from.first_name }).save();
                                        await client.sendMessage(chatId, `${message.from.first_name}, dei uma olhada aqui no sistema e você não possui um cadastro, mas, não se preocupe acabei de cadastra-ló(a), digite novamente o comando de farm para confirmar suas tarefas diárias.`).catch(err => console.log(err))
                                } else {
                                        new check.CHECKs({ _id: message.from.id, nome: message.from.first_name + " " + message.from.last_name }).save();
                                        await client.sendMessage(chatId, `${message.from.first_name}, dei uma olhada aqui no sistema e você não possui um cadastro, mas, não se preocupe acabei de cadastra-ló(a), digite novamente o comando de farm para confirmar suas tarefas diárias.`).catch(err => console.log(err))
                                }
                        }
                }
        })
})

client.onText(/\/lista/, (message) => {
        chatId = message.chat.id;
        check.CHECKs.find({}).collation({ locale: "en_US", numericOrdering: true }).exec(function (err, documento) {
                if (err) {
                        client.sendMessage(chatId, 'Erro ao carregar a lista');
                } else {
                        const dbresult = documento.map(result => result)
                        let ver = 1
                        const nome = dbresult.map(x => `Jogador: ${x.nome}`)
                        const check = dbresult.map(x => `Farm Completo: ${x.check}`)
                        let slanome = ""
                        for (var i = 0; i < dbresult.length; i++) {
                                slanome += "\nScholar #" + (ver++) + "\n" + nome[i] + "\n" + check[i] + "\n"
                        }
                        client.sendMessage(chatId, `👑 Farm do dia 👑\n🗓 ${moment().locale('pt-br').format('L')}\n\n✅\n${slanome}`).catch(err => console.log(err))
                }
        })

})


client.onText(/\/idremover/, (message) => {
        chatId = message.chat.id;
        if (message.from.id == donopermi) {
                check.CHECKs.find({}).collation({ locale: "en_US", numericOrdering: true }).exec(function (err, documento) {
                        if (err) {
                                client.sendMessage(chatId, 'Erro ao carregar a lista de ids');
                        } else {
                                const dbresult2 = documento.map(result => result)
                                let ver = 1
                                const nome = dbresult2.map(x => `Jogador: ${x.nome}`)
                                const id = dbresult2.map(x => `ID do user: ${x.id}`)
                                let slanome = ""
                                for (var i = 0; i < dbresult2.length; i++) {
                                        slanome += "#" + (ver++) + "\n" + nome[i] + "\n" + id[i] + "\n"
                                }
                                client.sendMessage(chatId, `${slanome}`).catch(err => console.log(err))
                        }
                })
        } else {
                return client.sendMessage(chatId, `${message.from.first_name}, desculpe, você não tem permissão para utilizar este comando !`).catch(err => console.log(err))
        }
})

client.onText(/\/reset/, (message) => {
        chatId = message.chat.id;
        if (message.from.id == donopermi) {
                check.CHECKs.find({}).collation({ locale: "en_US", numericOrdering: true }).exec(function (err, documento) {
                        if (err) {
                                client.sendMessage(chatId, 'Erro ao resetar os usuários');
                        } else {
                                const dbresult3 = documento.map(result => result)
                                const id = dbresult3.map(x => `${x.id}`)
                                for (var i = 0; i < dbresult3.length; i++) {
                                        const ids = Number(id[i])
                                        check.CHECKs.findOne({ "_id": ids }, async function (erro, documento) {
                                                documento.check = '❌'
                                                documento.save()
                                        })
                                }
                                client.sendMessage(chatId, `${message.from.first_name}, você acabou de resetar todos os checks ✅`).catch(err => console.log(err))
                        }
                })
        } else {
                return client.sendMessage(chatId, `${message.from.first_name}, desculpe, você não tem permissão para utilizar este comando !`).catch(err => console.log(err))
        }
})

client.onText(/\/remover/, (message) => {
        chatId = message.chat.id;
        if (message.from.id == donopermi) {
                if (message.text.slice(8).trim() === "") {
                        return client.sendMessage(chatId, `${message.from.first_name}, informe um ID para completar a exclusão !`).catch(err => console.log(err))
                } else {
                        check.CHECKs.findOne({ "_id": message.text.slice(8).trim() }, async function (err, documento) {
                                if (err) {
                                        client.sendMessage(chatId, 'Erro ao remover um usuário');
                                } else {
                                        if (documento == null) {
                                                client.sendMessage(chatId, `${message.from.first_name}, desculpe, o ID ${message.text.slice(8).trim()} não está cadastro em nosso sistema, Infelizmente é impossivel completa a exclusão !`).catch(err => console.log(err))
                                        } else {
                                                client.sendMessage(chatId, `${message.from.first_name}, você excluiu o cadastro de ${documento.nome} com sucesso ✅`).catch(err => console.log(err))
                                                await check.CHECKs.findOneAndDelete({
                                                        _id: message.text.slice(8).trim()
                                                })
                                        }
                                }
                        })
                }
        } else {
                return client.sendMessage(chatId, `${message.from.first_name}, desculpe, você não tem permissão para utilizar este comando !`).catch(err => console.log(err))
        }
})

/* client.on('left_chat_member', (message) => {
        check.CHECKs.findOne({ "_id": message.from.id }, async function (documento) {
                try {
                        await check.CHECKs.findOneAndDelete({
                                _id: message.from.id
                        })
                } catch (error) {
                        console.error(error);
                }
        })

}) */