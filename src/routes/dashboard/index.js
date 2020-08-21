const express = require('express')
const { json } = require('body-parser')
const router = express.Router()

router.get('/',(req,res)=>{
    res.render('dashboard/index')
})

router.post('/impresora/cambios',async (req,res)=>{
    console.log(req.body)
    let lineas = []
    let msg = `<WIND id="1234"><SETMESSAGEVALUES FilePath="//messages/test.nisx">` // nombre fichero

    for(let i=1;i<=3;i++){
        if(req.body[`linea${i}`].trim() != ''){
            lineas.push(req.body[`linea${i}`].trim())
            msg +=`<UI_FIELD Name="linea-${i}" Value="${lineas[i-1]}"/>`
        }
    }

    if(lineas.length > 0){
        msg += `</SETMESSAGEVALUES></WIND>`
        const net = require('net');
        const {PromiseSocket} = require('promise-socket');

        const socket = new net.Socket();
        const promiseSocket = new PromiseSocket(socket)
        try{
            promiseSocket.setTimeout(2000)
            await promiseSocket.connect({port: 1337, host: 'localhost'})
            await promiseSocket.write(msg)
            await promiseSocket.end()
            res.json({mensaje: 'Mensaje enviado'})
        }catch(error){
            console.error(error)
            res.sendStatus(500)
        }
    }
    else{
        res.json({mensaje: 'Mensaje vacío, no se envió nada'})
    }
})

module.exports = router