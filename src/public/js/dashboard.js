let saldos = 0
let cadenaLectura = ''
let leyendoCodigo = false
let comunicandoImpresora = false
let timerTextosMarcajes = null
let utillajeTalla = null
let labelName = null

const inputs = Array.from(document.getElementsByTagName('INPUT')).filter(x => x.id.includes('linea'))
const elementoSaldos = document.getElementById('saldos')
const checkEstado = document.getElementById('checkEstado')
const elementoInfoCliente = document.getElementById('info-cliente')
const elementoInfoModelo = document.getElementById('info-modelo')
const elementoInfoPedido = document.getElementById('info-pedido')
const elementoInfoUtillaje = document.getElementById('info-utillaje')
const elementoInfoTalla = document.getElementById('info-talla')
const btnReset = document.getElementById('btn-reset-campos')
const elementosInfo = [elementoInfoCliente, elementoInfoModelo, elementoInfoPedido, elementoInfoUtillaje, elementoInfoTalla]

function desseleccionar() {
    var tmp = document.createElement("input");
    document.body.appendChild(tmp);
    tmp.focus();
    document.body.removeChild(tmp);
}
function limpiarCodigo() {
    for (const input of inputs) {
        if (input.value.includes(cadenaLectura)) {
            input.value = String(input.value).replace(cadenaLectura, '')
            input.value = input.value
        }
    }
}
function enviarTextoImpresora(actualizar = true) {
    if (timerTextosMarcajes != null) {
        clearTimeout(timerTextosMarcajes)
    }

    timerTextosMarcajes = setTimeout(() => {
        $.ajax({
            method: 'POST',
            timeout: 3000,
            url: `/dashboard/impresora/cambios`,
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(
                {
                    linea1: document.getElementById('input-linea-1').value,
                    linea2: document.getElementById('input-linea-2').value,
                    linea3: document.getElementById('input-linea-3').value
                }),
            success: (mensaje) => {
                if (mensaje.labelName) {
                    labelName = mensaje.labelName
                }
            },
            error: (err) => {
                console.log(err)
            }
        })

        if (utillajeTalla != null && actualizar) {
            $.ajax({
                method: 'POST',
                timeout: 3000,
                url: `/dashboard/utillajes/guardarMarcajes`,
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify(
                    {
                        codigoUtillaje: utillajeTalla.codigoUtillaje,
                        talla: utillajeTalla.talla,
                        marcaje1: document.getElementById('input-linea-1').value,
                        marcaje2: document.getElementById('input-linea-2').value,
                        marcaje3: document.getElementById('input-linea-3').value,
                        ficheroMarcaje: labelName
                    }),
                success: () => {
                },
                error: (err) => {
                    console.log(err)
                }
            })
        }

    }, 3000)
}
function restarSaldos() {
    let saldosActuales = Number(elementoSaldos.innerHTML)
    if (saldosActuales > 0) {
        elementoSaldos.innerHTML = String(saldosActuales - 1)
    }
}
function sumarSaldos() {
    let saldosActuales = Number(elementoSaldos.innerHTML)
    elementoSaldos.innerHTML = String(saldosActuales + 1)
}
function cambiarEstadoImpresora(e) {

    //e.preventDefault()
    let timerInterval
    Swal.fire({
        title: 'Comunicación',
        html: 'Enviando orden a la impresora...',
        onBeforeOpen: () => {
            Swal.showLoading()
            let encendida = String(checkEstado.checked)
            let cmd = (encendida == 'true') ? 'on' : 'off'
            $.ajax({
                method: 'POST',
                timeout: 3000,
                url: `/dashboard/impresora/${cmd}`,
                dataType: 'json',
                success: () => {
                    checkEstado.checked = (cmd == 'on') ? true : false
                    swal.close()
                    const Toast = Swal.mixin({
                        toast: true,
                        position: 'bottom-end',
                        showConfirmButton: false,
                    })

                    Toast.fire({
                        type: 'success',
                        title: 'Comunicación exitosa'
                    })
                },
                error: (err) => {
                    checkEstado.checked = (cmd == 'on') ? false : true
                    console.log(err)
                    swal.close()
                    const Toast = Swal.mixin({
                        toast: true,
                        position: 'bottom-end',
                        showConfirmButton: false,
                    })

                    Toast.fire({
                        type: 'error',
                        title: 'Fallo en la comunicación'
                    })
                }
            })
        },
        onClose: () => {

        }
    }).then((result) => {
        /* Read more about handling dismissals below */
    })


}
function buscarPrepaquete(codigoPrepaquete) {
    $.ajax({
        method: 'POST',
        timeout: 3000,
        url: `/dashboard/prepaquete`,
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(
            {
                codigoPrepaquete: codigoPrepaquete
            }),
        success: (data) => {
            if (data != null && data.length == 1) {
                console.log(data[0])
                let prepaquete = data[0]
                elementoInfoCliente.innerHTML = prepaquete.NOMBRECLI
                elementoInfoModelo.innerHTML = prepaquete.DESCRIPCIONARTICULO
                elementoInfoPedido.innerHTML = prepaquete.PedidoLinea
                elementoInfoUtillaje.innerHTML = prepaquete.CodUtillaje
                elementoInfoTalla.innerHTML = prepaquete.Talla

                $.ajax({
                    method: 'POST',
                    timeout: 3000,
                    url: `/dashboard/utillajes/buscarMarcajes`,
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify(
                        {
                            codigoUtillaje: prepaquete.CodUtillaje,
                            talla: prepaquete.Talla
                        }),
                    success: (utillaje) => {
                        console.log(utillaje)
                        if (utillaje != null) {
                            inputs[0].value = utillaje.ImpresionMarcaje1
                            inputs[1].value = utillaje.ImpresionMarcaje2
                            inputs[2].value = utillaje.ImpresionMarcaje3

                            utillajeTalla = { codigoUtillaje: utillaje.CodUtillaje, talla: utillaje.TallaUtillaje }
                            enviarTextoImpresora(actualizar = false)
                        }
                        else {
                            utillajeTalla = null
                            labelName = null
                        }
                    },
                    error: (err) => {
                        console.log(err)
                    }
                })
            }
        },
        error: (err) => {
            console.log(err)
        }
    })
}
function keyUpPrefijoEntero(e) {
    var elementoFocus = document.activeElement;

    var code = String(e.code)

    if (leyendoCodigo) {
        cadenaLectura += code[code.length - 1]
        if (cadenaLectura.length === 13) {
            buscarPrepaquete(cadenaLectura)
            limpiarCodigo()
            cadenaLectura = ''
            leyendoCodigo = false
            desseleccionar()
        }
    }
    else {
        if (code === 'Numpad0' || code === 'Digit0') {
            if (cadenaLectura === '') {
                cadenaLectura = '0'
            }
        }
        else if (code === 'Numpad4' || code === 'Digit4') {
            if (cadenaLectura === '0') {
                cadenaLectura += '4'
                leyendoCodigo = true
                setTimeout(function () {
                    if (cadenaLectura === '04') {
                        cadenaLectura = ''
                        leyendoCodigo = false
                    }
                }, 1000);

            }
        }
        else {
            cadenaLectura = ''
            leyendoCodigo = false
        }
    }
}
function keyUp(e) {
    var elementoFocus = document.activeElement;

    var code = String(e.code)

    if (leyendoCodigo) {
        cadenaLectura += code[code.length - 1]
        if (cadenaLectura.length === 12) {
            cadenaLectura = '0' + cadenaLectura
            buscarPrepaquete(cadenaLectura)
            limpiarCodigo()
            cadenaLectura = ''
            leyendoCodigo = false
            desseleccionar()
        }
    }
    else {
        if (code === 'Numpad4' || code === 'Digit4') {
            if (cadenaLectura === '') {
                cadenaLectura = '4'
                leyendoCodigo = true
                setTimeout(function () {
                    if (cadenaLectura === '4') {
                        cadenaLectura = ''
                        leyendoCodigo = false
                    }
                }, 1000);
            }
        }
        else {
            cadenaLectura = ''
            leyendoCodigo = false
        }
    }
}
function resetearCampos() {
    utillajeTalla = null
    labelName = null
    for (const elemento of elementosInfo) {
        elemento.innerHTML = '...'
    }
    for (const input of inputs) {
        input.value = ''
    }
    enviarTextoImpresora(actualizar = false)
}

// ¡¡ add event listeners
Keyboard.init()
document.addEventListener("keyup", keyUp, false);
Keyboard.eventHandlers.onchange = enviarTextoImpresora
for (const input of inputs) {
    input.addEventListener('keyup', enviarTextoImpresora, false)
}
document.getElementById('btn-restar-saldos').addEventListener('click', restarSaldos, false)
document.getElementById('btn-sumar-saldos').addEventListener('click', sumarSaldos, false)
checkEstado.addEventListener('click', cambiarEstadoImpresora, false)
btnReset.addEventListener('click', resetearCampos, false)
// add event listeners !!

