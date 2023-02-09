
const taskController = {};


taskController.createTask = async (req, res) => {
    await decodeResponse(req.body)
        .then(response => res.send({ response }))
        .catch(error => {console.log(error); res.send({ error })})
    // const decodeResponse = new Task(req.body)

}


const decodeResponse = async (responseEncode) => {
    const response = {}
    return new Promise(async (resolve, reject) => {
        try {
            if (responseEncode['0'] == '171') {
                switch (responseEncode['4']) {
                    case 145:
                        resolve({"Battery" : responseEncode['7']})
                        break
                    case 146:
                        resolve({"firmware" : responseEncode['6'] + responseEncode['7'] / 100})
                        break
                    case 81:
                        switch (responseEncode['5']) {
                            case 17:
                                //STAND-ALONE MEASUREMENT OF HEART RATE DATA
                                resolve(await getDiviceSingleTimeMeasurement(responseEncode))
                                break
                            case 18:
                                //STAND-ALONE OXYGEN DATA
                                resolve(await getDiviceSingleTimeMeasurement(responseEncode))
                                break
                            case 20:
                                //STAND-ALONE BLOOD PRESSURE DATA
                                resolve(await getDiviceSingleTimeMeasurement(responseEncode))
                                break
                            case 8:
                                //CURRENT DATA
                                response.push(await getSleepRecord(responseEncode))
                                response.push(await getActivityRecord(responseEncode))
                                resolve(response)
                                break
                            case 32:
                                //HOURLY DATA
                                resolve(await collectHourlyMeasurement(responseEncode))
                                break
                            case 33:
                                //BODY TEMPERATURE AND IMMUNITY DATA (TEMPERATURE T1)
                                break
                            case 19:
                                //STAND-ALONE BODY TEMPERATURE MASUREMENT
                                resolve(await collectTemperatureMeasurement(responseEncode))
                                break
                            case 24:
                                //STAND-ALONE IMMUNITY MEASUREMENT
                                break
                        }
                        break
                    case 82:
                        //SLEEP DATA
                        break
                    case 49:
                        //SINGLE MEASUREMENT, REAL TIME MEASUREMENT
                        switch (responseEncode['5']) {
                            case 9:
                                //HEART RATE (SINGLE)
                                resolve(await getSingconstimeIndividualMeasurement(responseEncode))
                                break
                            case 17:
                                //BLOOD OXYGEN (SINGLE)
                                resolve(await getSingconstimeIndividualMeasurement(responseEncode))
                                break
                            case 33:
                                //BLOOD PRESSURE (SINGLE)
                                resolve(await getSingconstimeIndividualMeasurement(responseEncode))
                                break
                            case 10:
                                //HEART RATE (REAL-TIME).
                                resolve(await getRealTimeIndividualMeasurement(responseEncode))
                                break
                            case 18:
                                //BLOOD OXYGEN (REAL-TIME)
                                resolve(await getRealTimeIndividualMeasurement(responseEncode))
                                break
                            case 34:
                                //BLOOD PRESSURE (REAL-TIME)
                                resolve(await getRealTimeIndividualMeasurement(responseEncode))
                                break
                            case 129:
                                //SINGLE TEMPERATURE MEASUREMENT
                                resolve(await getDiviceSingleTimeMeasurement(responseEncode))
                                break
                        }
                        break
                    case 50:
                        //ONE BUTTON MEASUREMENT
                        resolve(await validateOneButtonMeasurement(responseEncode))
                    break
                }
            }
        } catch (error) {
            reject(error)
        }
    })


}

// Colect individual measurement

const getDiviceSingleTimeMeasurement = (datas) => {

    // mediciones realizadas con el dispositivo
    return new Promise((resolve, reject) => {
        try {
            const year = datas['6']
            const month = datas['7']
            const day = datas['8']
            const hour = datas['9']
            const minute = datas['10']
            const date = new Date()
            date.setFullYear(year + 2000, month - 1, day)
            date.setHours(hour + 1)
            date.setMinutes(minute)
            date.setSeconds(0)
            date.setMilliseconds(0)
            fechaMillis = date.getTime()
            switch (datas['5']) {
                case 0x12:
                    const oximetria = datas['6']
                    //console.log(`Blood Oxygen: ${oximetria} SP02 at ${fechaMillis}`)
                     const data_oximetria = {oximetria, date}
                    resolve({ message:"Medición exitosa", data_oximetria})
                    break;
                case 0x11:
                    const ritmoCardiaco = datas['6']
                    //console.log(`Heart Rate: ${ritmoCardiaco} ppm at ${fechaMillis}`)
                    const data_ritmoCardiaco = {Temperature, date}
                    resolve({ message:"Medición exitosa", data_ritmoCardiaco})
                    break;
                case 0x21:
                    const presionSistolica = datas['6']
                    const presionDiastolica = datas['7']
                    //console.log(`Blood Pressure: ${presionSistolica} / ${presionDiastolica} mmHg at ${fechaMillis}`)
                    const data = {presionSistolica, presionDiastolica, date}
                    resolve({ message:"Medición exitosa", data})
                    break;
            }
        } catch (error) {
            reject(error)
        }
    })
}

const getSingconstimeIndividualMeasurement = (datas) => {
    return new Promise((resolve, reject) => {
        try {
            switch (datas['5']) {
                case 0x11:
                    const oximetria = datas['6']
                    //console.log(`Blood oxygen: ${oximetria} SP02`)
                     const data_oximetria = {oximetria, date}
                    resolve({ message:"Medición exitosa", data_oximetria})
                    break;
                case 0x09:
                    const ritmoCardiaco = datas['6']
                    //console.log(`Heart rate: ${ritmoCardiaco} ppm`)
                    const data_ritmoCardiaco = {Temperature, date}
                    resolve({ message:"Medición exitosa", data_ritmoCardiaco})
                    break;
                case 0x21:
                    const presionSistolica = datas['6']
                    const presionDiastolica = datas['7']
                    //console.log(`Blood pressure: ${presionSistolica} / ${presionDiastolica} mmHg`)
                    const data = {presionSistolica, presionDiastolica, date}
                    resolve({ message:"Medición exitosa", data})
                    break;
            }
        } catch (error) {
            reject(error)
        }
    })
}

const getRealTimeIndividualMeasurement = (datas) => {
    return new Promise((resolve, reject) => {
        try {
            switch (datas['5']) {
                case 0x12:
                    const oximetria = datas['6']
                    //console.log(`Real time blood oxygen: ${oximetria} SP02`)
                    const data_oximetria = {oximetria, date}
                    resolve({ message:"Medición exitosa", data_oximetria})
                    break;
                case 0x0A:
                    const ritmoCardiaco = datas['6']
                    //console.log(`Real time heart rate: ${ritmoCardiaco} ppm`)
                    const data_ritmoCardiaco = {Temperature, date}
                    resolve({ message:"Medición exitosa", data_ritmoCardiaco})
                    break;
                case 0x22:
                    const presionSistolica = datas['6']
                    const presionDiastolica = datas['7']
                    //console.log(`Real time blood pressure: ${presionSistolica} / ${presionDiastolica} mmHg`)
                    const data = {presionSistolica, presionDiastolica, date}
                    resolve({ message:"Medición exitosa", data})
                    break;
            }
        } catch (error) {
            reject(error)
        }
    })
}

const collectTemperatureMeasurement = (datas) => {
    return new Promise((resolve, reject) => {
        try {
            let year = datas['6']
            let month = datas['7']
            let day = datas['8']
            let hour = datas['9']
            let minute = datas['10']

            const date = new Date()
            date.setFullYear(year + 2000, month - 1, day)
            date.setHours(hour)
            date.setMinutes(minute)
            date.setSeconds(0)
            date.setMilliseconds(0)

            const Temperature = datas['11'] + datas['12'] * 0.1

            //console.log(`Temperature: ${Temperature} °C at ${date}`)
            const data = {Temperature, date}
            resolve({ message:"Medición exitosa", data})
        } catch (error) {
            reject(error)
        }
    })
}

// Collect activity measurement 

const getSleepRecord = (datas) => {
    return new Promise((resolve, reject) => {
        try {
            const date = new Date()
            const year = datas['6']
            const month = datas['7'] + 1
            const day = datas['8']
            const hour = datas['9']
            date.setFullYear(year + 2000, month - 1, day)
            date.setHours(hour + 1)
            date.setMinutes(0)
            date.setSeconds(0)
            date.setMilliseconds(0)
            const shallowSleep = datas['12'] * 60 + datas['13']
            const deepSleep = datas['14'] * 60 + datas['15']
            const wakeUpTimes = datas['16']
            //console.log(`sleep information : shallowSleep  ${shallowSleep}, deepSleep ${deepSleep}, wakeUpTimes ${wakeUpTimes}`)
            const data = {shallowSleep ,deepSleep, wakeUpTimes, date}
            resolve({ message:"Medición exitosa", data})
        } catch (error) {
            reject(error)
        }
    })
}

const getActivityRecord = (datas) => {
    return new Promise((resolve, reject) => {
        try {
            const date = new Date()
            const year = datas['6']
            const month = datas['7'] + 1
            const day = datas['8']
            const hour = datas['9']
            date.setFullYear(year + 2000, month - 1, day)
            date.setHours(hour + 1)
            date.setMinutes(0)
            date.setSeconds(0)
            date.setMilliseconds(0)

            steps = (datas[6] << 16) + (datas[7] << 8) + datas[8];
            calory = (datas['9'] << 16) + (datas['10'] << 8) + datas['11'];
            //console.log(`steps information : calory  ${calory} KCal at ${date}`)
            //console.log(`calory information : calory  ${calory} KCal at ${date}`)
            const data = {steps ,calory, date}
            resolve({ message:"Medición exitosa", data})
        } catch (error) {
            reject(error)
        }
    })
}

const collectHourlyMeasurement = (datas) => {
    return new Promise((resolve, reject) => {
        try {
            const date = new Date()
            const year = datas['6']
            const month = datas['7'] + 1
            const day = datas['8']
            const hour = datas['9']
            date.setFullYear(year + 2000, month - 1, day)
            date.setHours(hour + 1)
            date.setMinutes(0)
            date.setSeconds(0)
            date.setMilliseconds(0)

            const steps = (datas['10'] << 16) + (datas['11'] << 8) + datas['12']
            const calory = (datas['13'] << 16) + (datas['14'] << 8) + datas['15']
            const heartRate = datas['16']
            const bloodOxygen = datas['17']
            const bloodPressure_high = datas['18']
            const bloodPressure_low = datas['19']

            //console.log(`Hourly measurement at ${date}`)
            //console.log(` Calory  ${calory} KCal`)
            //console.log(` Steps  ${steps} Steps`)
            //console.log(` Heart rate  ${heartRate} ppm`)
            //console.log(` Blood oxygen  ${bloodOxygen} SPO2`)
            //console.log(` Blood pressure: ${bloodPressure_low} / ${bloodPressure_high} mmHg`)
            const data = {heartRate, bloodOxygen, bloodPressure_low, bloodPressure_high, steps ,calory, date }
            resolve({ message:"Medición exitosa", data})
        } catch (error) {
            reject(error)
        }
    })

}

const validateOneButtonMeasurement = (datas) => {
    //console.log('datas', datas)
    return new Promise((resolve, reject) => {
        try {
            if (datas['6'] == 0 || datas['7'] == 0 || datas['8'] == 0 || datas['9'] == 0 || datas['7'] < 91) {
                resolve({ message:"Es necesario realizar una nueva medicion"})
            }
            else {
                const heartRate = datas[10]
                const bloodOxygen = datas[7]
                const bloodPressure_low = datas[8]
                const bloodPressure_high = datas[9]
                const temperature = datas[11] + (datas[12] * 0.1)
                const date = new Date()
                const data = {heartRate, bloodOxygen, bloodPressure_low, bloodPressure_high, temperature, date}
                //console.log(`Hourly measurement at ${date}`)
                //console.log(` Heart rate  ${heartRate} ppm`)
                //console.log(` Blood oxygen  ${bloodOxygen} SPO2`)
                //console.log(` Blood pressure: ${bloodPressure_low} / ${bloodPressure_high} mmHg`)
                //console.log(` Temperature  ${temperature} °C`)
                resolve({ message:"Medición exitosa", data})
            }
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = taskController;