const mongoose = require('mongoose')

const AsistenciaSchema = new mongoose.Schema({
    email: {
        type: String,
    },
    firstName: {
        type: String,
    }, 
    lastName: {
        type: String,
    },
    asistencia: {
        type: Boolean
    },
    fecha: {
        type: Date
    }
})

module.exports = mongoose.model('Asistencia', AsistenciaSchema)