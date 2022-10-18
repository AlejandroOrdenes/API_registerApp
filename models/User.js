const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Porfavor Ingrese un correo']
    },
    firstName: {
        type: String,
        required: [true, 'Porfavor ingrese un nombre']
    }, 
    lastName: {
        type: String,
        required: [true, 'Porfavor ingrese apellido']
    },
    password: {
        type: String,
        required: [true, 'Porvafor ingrese constraseña']
    },
    rol: {
        type: String,
        required: [true, 'Porfavor ingrese su rol']
    },
    imagen: {
        type: String,
        required: [true, 'Porfavor ingrese una imagen de perfil']
    },
})

module.exports = mongoose.model('User', UserSchema)