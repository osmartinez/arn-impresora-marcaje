let saldos = 0
let cadenaLectura = ''
let leyendoCodigo = false
let comunicandoImpresora = false

const inputs = document.getElementsByTagName('INPUT')
const elementoSaldos = document.getElementById('saldos')
const checkEstado = document.getElementById('checkEstado')

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
function enviarTextoImpresora() {
    if (!comunicandoImpresora) {
        comunicandoImpresora = true
        setTimeout(() => {
            $.ajax({
                method: 'POST',
                timeout: 3000,
                url: `/dashboard/impresora/cambios`,
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify(
                    {
                        'linea1': document.getElementById('input-linea-1').value,
                        'linea2': document.getElementById('input-linea-2').value,
                        'linea3': document.getElementById('input-linea-3').value
                    }),
                success: () => {
                    comunicandoImpresora = false
                },
                error: (err) => {
                    comunicandoImpresora = false
                    console.log(err)
                }
            })
        }, 5000)
    }

}
function restarSaldos(){
    let saldosActuales = Number(elementoSaldos.innerHTML)
    if (saldosActuales > 0) {
        elementoSaldos.innerHTML = String(saldosActuales - 1)
    }
}
function sumarSaldos(){
    let saldosActuales = Number(elementoSaldos.innerHTML)
    elementoSaldos.innerHTML = String(saldosActuales + 1)
}
function cambiarEstadoImpresora(e){

    e.preventDefault()
    let encendida = String(checkEstado.checked)
    let cmd = (encendida=='true')? 'on':'off'
    $.ajax({
        method: 'POST',
        timeout: 3000,
        url: `/dashboard/impresora/${cmd}`,
        dataType: 'json',
        success: () => {
            checkEstado.checked = !checkEstado.checked
        },
        error: (err) => {
            console.log(err)
        }
    })
}
function keyUp(e) {
    var elementoFocus = document.activeElement;

    var code = String(e.code)

    if (leyendoCodigo) {
        cadenaLectura += code[code.length - 1]
        if (cadenaLectura.length === 13) {
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

// ¡¡ event listeners
Keyboard.init()
document.addEventListener("keyup", keyUp, false);
Keyboard.eventHandlers.onchange = enviarTextoImpresora
for (const input of inputs) {
    input.addEventListener('keyup', enviarTextoImpresora, false)
}
document.getElementById('btn-restar-saldos').addEventListener('click', restarSaldos, false)
document.getElementById('btn-sumar-saldos').addEventListener('click', sumarSaldos, false)
checkEstado.addEventListener('click',cambiarEstadoImpresora,false)
// event listeners !!

