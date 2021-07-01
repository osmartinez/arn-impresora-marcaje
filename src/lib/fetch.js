const fetch = require('node-fetch');
const config = require('../../config');
const env = process.env.NODE_ENV || 'production';
const port = config[env].server.port
const host = config[env].server.host
const url = `http://${host}:${port}/api`

module.exports = {
    async buscarMaquina(codigoMaquina) {
        try {
            var response = await fetch(`${url}/maquinas/${codigoMaquina}`)
            var maquina = await response.json()
            return maquina
        } catch (err) {
            console.error(err)
            return null
        }
    },
    async buscarOperario(id) {
        try {
            if (!isNaN(id)) {
                id = 'B00' + id
            }
            var response = await fetch(`${url}/operarios/${id}`)
            var user = await response.json()
            return user
        } catch (err) {
            console.error(err)
            return null
        }
    },

    async entradaOperarioPuesto(idOperario, idPuesto) {
        try {
            if (!isNaN(idOperario)) {
                idOperario = 'B00' + idOperario
            }
            var response = await fetch(`${url}/operarios/entrada`,
                {
                    method: 'post',
                    body: JSON.stringify({ codigoOperario: idOperario, idMaquina: idPuesto }),
                    headers: { 'Content-Type': 'application/json' }
                })
            var user = await response.json()
            return user
        } catch (err) {
            console.error(err)
            return null
        }
    },

    async salidaOperarioPuesto(idOperario, idPuesto) {
        try {
            if (!isNaN(idOperario)) {
                idOperario = 'B00' + idOperario
            }
            var response = await fetch(`${url}/operarios/salida`,
                {
                    method: 'post',
                    body: JSON.stringify({ codigoOperario: idOperario, idMaquina: idPuesto }),
                    headers: { 'Content-Type': 'application/json' }
                })
            var user = await response.json()
            return user
        } catch (err) {
            console.error(err)
            return null
        }
    },

    async buscarOrden(id) {
        try {
            var response = await (fetch(`${url}/ordenesFabricacion/${id}`))
            var orden = await response.json()
            return orden
        } catch (err) {
            console.error(err)
            return null
        }
    },

    async buscarOperacion(id, codSeccion) {
        try {
            var response = await fetch(`${url}/ordenesFabricacion/buscarOperacion/${id}/${codSeccion}`)
            var operaciones = await response.json()
            return operaciones
        } catch (err) {
            console.error(err)
            return null
        }
    },

    async buscarTodasSecciones() {
        try {
            var response = await fetch(`${url}/secciones`)
            var secciones = await response.json()
            return secciones
        }
        catch (err) {
            console.error(err)
            return null
        }
    },

    async buscarMaquinasEnSeccion(codSeccion) {
        try {
            var response = await fetch(`${url}/maquinas/enSeccion/${codSeccion}`)
            var maquinas = await response.json()
            return maquinas
        } catch (err) {
            console.error(err)
            return null
        }
    },

    async buscarPrepaquete(codigoPrepaquete, codigoSeccion) {
        try {
            var response = await fetch(`${url}/barquillas/buscarInformacionEnSeccion/${codigoPrepaquete}/${codigoSeccion}`)
            var prepaquetes = await response.json()
            return prepaquetes
        } catch (err) {
            console.error(err)
            return null
        }
    },

    async buscarImpresionMarcajePorUtillajeTalla(codigoUtillaje, talla) {
        try {
            var response = await fetch(`${url}/utillajes/buscarImpresionMarcajePorUtillajeTalla/${codigoUtillaje}/${talla}`)
            var utillaje = await response.json()
            return utillaje
        } catch (err) {
            console.error(err)
            return null
        }
    },

    async guardarImpresionMarcajePorUtillajeTalla(codigoUtillaje, talla, marcaje1, marcaje2, marcaje3,ficheroMarcaje) {
        try {

            var response = await fetch(`${url}/utillajes/guardarImpresionMarcajePorUtillajeTalla`,
                {
                    method: 'post',
                    body: JSON.stringify(
                        {
                            codigoUtillaje:codigoUtillaje,
                            talla: talla,
                            impresionMarcaje1: marcaje1.trim(),
                            impresionMarcaje2: marcaje2.trim(),
                            impresionMarcaje3: marcaje3.trim(),
                            ficheroMarcaje: ficheroMarcaje,
                        }
                    ),
                    headers: { 'Content-Type': 'application/json' }
                })
            var utillaje = await response.json()
            return utillaje
        } catch (err) {
            console.error(err)
            return null
        }
    },
}