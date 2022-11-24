const { response } = require('express')
const bcrypt = require('bcryptjs')
const User = require('../models/User')

const crearUsuario = async (req, res = response) => {
    const { email, password } = req.body

    try {
        let user = await User.findOne({ email })

        if ( user ) {
            return res.status(400).json({
                ok: false,
                msg: 'Un usuario ya existe con ese correo'
            })
        }
        user = new User(req.body)
        
        // Encriptar contraseña
        const salt = bcrypt.genSaltSync()
        user.password = bcrypt.hashSync(password, salt)

        await user.save()
    
        return res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name
        })
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        })
    }
}

const loginUsuario = (req, res = response) => {
    const { email, password } = req.body

    return res.status(200).json({
        ok: true,
        email,
        password,
    })
}

const revalidarToken = (req, res = response) => {
    return res.json({
        ok: true,
        msg: 'renew',
    })
}

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken,
}