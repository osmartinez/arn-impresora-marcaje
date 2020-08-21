let id = 1000

module.exports = {
    start(){
        id++
        return `
        <WIND id="${id}">
            <SETCONFIGURATION>
                <BOARDS>
                    <BOARD id="0">
                        <ENABLED>True</ENABLED>
                    </BOARD>
                </BOARDS>
            </SETCONFIGURATION>
        </WIND>`
    },

    stop (){
        id++
        return `
        <WIND id="${id}">
            <SETCONFIGURATION>
                <BOARDS>
                    <BOARD id="0">
                        <ENABLED>False</ENABLED>
                    </BOARD>
                </BOARDS>
            </SETCONFIGURATION>
        </WIND>`
         
    },

    loadLabel(labelName){
        id++
        return `
        <WIND id="${id}">
            <SETCURRENTMESSAGE BoardId="0" FilePath="./${labelName}.nisx"/>
        </WIND> `
    },

    getFileList(){
        id++
        return `
        <WIND id="${id}">
            <GETFILESLIST type=".nisx"/>
        </WIND> `
    },

    changeValues(labelName, items){
        id++
        let strItems = ''
        for(const item of items){
            strItems += `<UI_FIELD Name="${item.name}" Value="${item.value}"/>`
        }

        return `
        <WIND id="${id}">
            <SETMESSAGEVALUES FilePath="//messages/${labelName}.nisx">
                ${strItems}
            </SETMESSAGEVALUES>
        </WIND>
`
    }
}