const TelegramBot = require('node-telegram-bot-api')
const token = '6893463228:AAFKRyX60Ipg6s44yjYXeAQ2PxAHNeBC8g8'
const bot = new TelegramBot(token, { polling: true})
const fs = require('fs')

const admin = 5726497810;

const file = './requests/requests.json';

const data = fs.readFileSync(file, {encoding : 'utf8'})
let requests = JSON.parse(data);

function Save() {
    fs.writeFileSync(file, JSON.stringify(requests, null, 2), {encoding : 'utf8', flag: 'w'});
}

bot.on("polling_error", console.log)

console.log('Start...')

const start = {
    reply_markup: {               
        inline_keyboard: [
            [{
                text: 'Продолжить',
                callback_data: 'start'
            }]
        ]
    }
}

const option = {
    reply_markup: {               
        inline_keyboard: [
            [{
                text: 'Залог',
                callback_data: 'option1'
            },
            {
                text: 'Наработка залога',
                callback_data: 'option2'
            }]
        ]
    }
}

const experience = {
    reply_markup: {               
        inline_keyboard: [
            [{
                text: 'Да',
                callback_data: 'experience1'
            },
            {
                text: 'Нет',
                callback_data: 'experience2'
            }]
        ]
    }
}

const telephone = {   
    reply_markup: {
        inline_keyboard: [
            [{
                text: 'Да',
                callback_data: 'telephone1'
            },
            {
                text: 'Нет',
                callback_data: 'telephone2'
            }]
        ]  
    }          
}

const license = {
    reply_markup: {
        inline_keyboard: [
            [{
                text: 'Да',
                callback_data: 'license1'
            },
            {
                text: 'Нет',
                callback_data: 'license2'
            }]
        ]
    }
}

const use = {
    reply_markup: {
        inline_keyboard: [
            [{
                text: 'Да',
                callback_data: 'use1'
            },
            {
                text: 'Нет',
                callback_data: 'use2'
            }]
        ]
    }
}

const move = {
    reply_markup: {
        inline_keyboard: [
            [{
                text: 'Да',
                callback_data: 'move1'
            },
            {
                text: 'Нет',
                callback_data: 'move2'
            }]
        ]
    }
}

const final = {
    reply_markup: {               
        inline_keyboard: [
            [{
                text: 'Отправить заявку',
                callback_data: 'final'
            }]
        ]
    }
}

bot.on("text", msg => {
    const chatid = msg.chat.id;
    const text = msg.text;
    console.log(chatid + ": " + text)
    if(chatid == admin && (text.replace(/ .*/,'') == "/send" || text.replace(/ .*/,'') == "/alarm")) {
        if(text.replace(/ .*/,'') == "/send") {
            bot.sendMessage(text.substring(text.indexOf(' ') + 1, text.indexOf(' ', 7)), text.substring(text.indexOf(' ', 7) + 1, text.length))
        } else if(text.replace(/ .*/,'') == "/alarm") {
            const txt = text.substring(text.indexOf(' ') + 1, text.length)
            for(let id in requests) {
                bot.sendMessage(id, txt);
            }
        }
    } else if(text == "/start") {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const yyyy = today.getFullYear();
        const date = dd + '.' + mm + '.' + yyyy;
        requests[chatid] = {status: 0, option: '', age: '', city: '', experience: '', telephone: '', license: '', use: '', move: '', username: '', date: date};
        requests[chatid]["status"] = 0;
        if (msg.from.username) 
            requests[chatid]["username"] = msg.from.username;
        bot.sendPhoto(chatid, "start.jpg", start)
        Save()
    } else if(requests[chatid]["status"] == 2) {
        if(Number(text) && Number.isInteger(Number(text)) && Number(text) > 0) {
            requests[chatid]["age"] = text;
            requests[chatid]["status"] = 3;
            bot.sendMessage(chatid, "Укажите свой город:");
            Save()
        } else {
            bot.sendMessage(chatid, "Введите свой возраст (целое число):");
        }
    } else if(requests[chatid]["status"] == 3) {
        requests[chatid]["city"] = text;
        requests[chatid]["status"] = 4;
        bot.sendMessage(chatid, "Был опыт работы в данной сфере?", experience);
        Save()
    }
})

bot.on('callback_query', (query) =>{
    const chatid = query.message.chat.id;
    const messageid = query.message.message_id;
    if(query.data == "start") {
        requests[chatid]["status"] = 1;
        bot.editMessageReplyMarkup({reply_markup: JSON.stringify({keyboard: []})}, {chat_id: chatid, message_id: messageid});
        bot.sendMessage(chatid, "У нас возможно 2 варианта трудойстройства: \n1. Залог (от 3к) \n2. Наработка залога (Необходимо сделать 30 простых граффити) \n\nКакой вариант вам подходит?", option)
        Save()
    } else if (query.data == "option1" || query.data == "option2") {
        requests[chatid]["status"] = 2;
        bot.sendMessage(chatid, "Укажите свой возраст:");
        bot.editMessageReplyMarkup({reply_markup: JSON.stringify({keyboard: []})}, {chat_id: chatid, message_id: messageid});
        if(query.data == "option1") {
            requests[chatid]["option"] = "Залог";
        } else {
            requests[chatid]["option"] = "Наработка залога";
        
        }
        Save()
    } else if (query.data == "experience1" || query.data == "experience2") {
        requests[chatid]["status"] = 5;
        bot.editMessageReplyMarkup({reply_markup: JSON.stringify({keyboard: []})}, {chat_id: chatid, message_id: messageid});
        bot.sendMessage(chatid, "Имеется исправный телефон?", telephone)
        if(query.data == "experience1") {
            requests[chatid]["experience"] = "Да";
        } else {
            requests[chatid]["experience"] = "Нет";
        }
        Save()
    } else if (query.data == "telephone1" || query.data == "telephone2") {
        requests[chatid]["status"] = 6;
        bot.editMessageReplyMarkup({reply_markup: JSON.stringify({keyboard: []})}, {chat_id: chatid, message_id: messageid});
        bot.sendMessage(chatid, "Есть ли у вас водительское удостоверение?", license)
        if(query.data == "telephone1") {
            requests[chatid]["telephone"] = "Да";
        } else {
            requests[chatid]["telephone"] = "Нет";
        }
        Save()
    } else if (query.data == "license1" || query.data == "license2") {
        requests[chatid]["status"] = 7;
        bot.editMessageReplyMarkup({reply_markup: JSON.stringify({keyboard: []})}, {chat_id: chatid, message_id: messageid});
        bot.sendMessage(chatid, "Употребляете?", use)
        if(query.data == "license1") {
            requests[chatid]["license"] = "Да";
        } else {
            requests[chatid]["license"] = "Нет";
        }
        Save()
    } else if (query.data == "use1" || query.data == "use2") {
        requests[chatid]["status"] = 8;
        bot.editMessageReplyMarkup({reply_markup: JSON.stringify({keyboard: []})}, {chat_id: chatid, message_id: messageid});
        bot.sendMessage(chatid, "Готовы по возможности переехать в другой город?", move)
        if(query.data == "use1") {
            requests[chatid]["use"] = "Да";
        } else {
            requests[chatid]["use"] = "Нет";
        }
        Save()
    } else if (query.data == "move1" || query.data == "move2") {
        requests[chatid]["status"] = 9;
        bot.sendMessage(chatid, "Отлично! Остался последний шаг.", final)
        bot.editMessageReplyMarkup({reply_markup: JSON.stringify({keyboard: []})}, {chat_id: chatid, message_id: messageid});
        if(query.data == "move1") {
            requests[chatid]["move"] = "Да";
        } else {
            requests[chatid]["move"] = "Нет";
        }
        Save()
    } else if (query.data == "final") {
        if (query.from.username) {
            requests[chatid]["status"] = 10;
            requests[chatid]["username"] = query.from.username;
            bot.sendMessage(chatid, "Завяка отправлена, в ближайшее время с вами свяжутся.")
            bot.editMessageReplyMarkup({reply_markup: JSON.stringify({keyboard: []})}, {chat_id: chatid, message_id: messageid});
            bot.sendMessage(admin, `username:  @${requests[chatid]["username"]} \n1. ${ requests[chatid]["age"]}\n2. ${requests[chatid]["city"]}\n3. ${requests[chatid]["option"]}\n4. ${requests[chatid]["experience"]}\n5. ${requests[chatid]["telephone"]}\n6. ${requests[chatid]["license"]}\n7. ${requests[chatid]["use"]}\n8. ${requests[chatid]["move"]}`);
            Save()
        } else {
            bot.sendMessage(chatid, "У вас не установлен username (Имя пользователя)! \nСделать это можно в настройках профиля. \nПосле того, как установите username, нажмите 'Отправить заявку'")
        }
    }
})
