const express = require('express')
const router = express.Router()
const msgMaker = require('../../lib/msg-maker')
const printerSettings = require('../../lib/printer-settings')
const {buscarPrepaquete, buscarImpresionMarcajePorUtillajeTalla, guardarImpresionMarcajePorUtillajeTalla} = require('../../lib/fetch')

router.get('/',(req,res)=>{
    res.render('dashboard/index')
})

async function cambiarEstadoImpresora(encendida,res){
    const net = require('net');
    const {PromiseSocket} = require('promise-socket');
    let connected = false
    const socket = new net.Socket();
    const promiseSocket = new PromiseSocket(socket)
    try{
        let settings = printerSettings.getSettings()
        promiseSocket.setTimeout(3000)
        await promiseSocket.connect({port:settings.port , host: settings.ip})
        connected = true
        msg = encendida? msgMaker.start():msgMaker.stop()
        await promiseSocket.write(msg)
        await promiseSocket.end()
        res.json({mensaje: 'Mensaje enviado'})
    }catch(error){
        console.error(error)
        if(connected){
            await promiseSocket.end()
        }
        res.sendStatus(500)
    }
}

router.post('/prepaquete',async (req,res)=>{
    try{
        let codigoPrepaquete = req.body.codigoPrepaquete
        let prepaquete = await buscarPrepaquete(codigoPrepaquete,'520')
        res.json(prepaquete) 
    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }
})

router.post('/utillajes/buscarMarcajes',async (req,res)=>{
    try{
        const {codigoUtillaje,talla} = req.body
        let utillaje = await buscarImpresionMarcajePorUtillajeTalla(codigoUtillaje,talla)
        res.json(utillaje) 
    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }
})

router.post('/utillajes/guardarMarcajes',async (req,res)=>{
    try{
        const {codigoUtillaje,talla, marcaje1, marcaje2, marcaje3} = req.body
        let utillaje = await guardarImpresionMarcajePorUtillajeTalla(codigoUtillaje,talla,marcaje1,marcaje2,marcaje3)
        res.json(utillaje) 
    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }
})


router.post('/impresora/on',async (req,res)=>{
   await cambiarEstadoImpresora(encendida=true, res)
})

router.post('/impresora/off',async (req,res)=>{
    await cambiarEstadoImpresora(encendida=false, res)
})

router.post('/impresora/cambios',async (req,res)=>{
    let labelName = ''
    let items = [] 
    let msg = ''
    for(let i=1;i<=3;i++){
        if(req.body[`linea${i}`].trim() != ''){
            items.push({name: `linea-${i}`, value:req.body[`linea${i}`].trim() })
        }
    }

    labelName = `${items.length}lineas`

    if(items.length > 0){
        const net = require('net');
        const {PromiseSocket} = require('promise-socket');
        let connected = false
        const socket = new net.Socket();
        const promiseSocket = new PromiseSocket(socket)
        try{
            let settings = printerSettings.getSettings()
            promiseSocket.setTimeout(2000)
            await promiseSocket.connect({port:settings.port , host: settings.ip})
            connected = true
            msg = msgMaker.loadLabel(labelName)
            await promiseSocket.write(msg)
            msg  =msgMaker.changeValues(labelName, items)
            await promiseSocket.write(msg)
            await promiseSocket.end()
            res.json({mensaje: 'Mensaje enviado'})
        }catch(error){
            console.error(error)
            if(connected){
                await promiseSocket.end()
            }
            res.sendStatus(500)
        }
    }
    else{
        res.json({mensaje: 'Mensaje vacío, no se envió nada'})
    }
})

module.exports = router
