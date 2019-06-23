const db = require('../db');


let insert = (values) => {
    return new Promise((resolve, reject) => {
        db.get().query('INSERT INTO userdata(id_telegram, first_name, last_name, username) values(?,?,?,?)', [values.id, values.first_name, values.last_name, values.username], (err, result) => {
            if (err) {
                console.log(err)
                reject(err)
            } else {
                console.log(result)
                resolve(result)
            }
        })
    })
}



let comprobar = (value) => {
    return new Promise((resolve, reject) => {
        db.get().query('SELECT * FROM userdata WHERE id_telegram=? LIMIT 1', [value], (err, rows) => {
            if (err) {
                console.log(err)
                reject(err)
            } else {
                resolve(rows)
            }
        })
    })
}



let allUsers = () => {
    return new Promise((resolve, reject) => {
        db.get().query('SELECT id_telegram FROM userdata', (err, rows) => {
            if (err) {
                console.log(err)
                reject(err)
            } else {
                resolve(rows)
            }
        })
    })
}


let randomUser = () => {
    return new Promise((resolve, reject) => {
        db.get().query('SELECT id_telegram FROM userdata ORDER BY RAND() LIMIT 1', (err, rows) => {
            if (err) {
                console.log(err)
                reject(err)
            } else {
                resolve(rows)
            }
        })
    })
}




module.exports = {
    insert: insert,
    comprobar: comprobar,
    allUsers: allUsers,
    randomUser: randomUser
}