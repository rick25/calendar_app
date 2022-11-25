const { response } = require('express')
const Event = require('../models/Event')

const crearEvento = async (req, res = response) => {
    const event = new Event(req.body)

    try {
        event.user = req.uid

        const eventGuardado = await event.save()

        return res.status(201).json({
            ok: true,
            evento: eventGuardado,
            uid: event.id,
            title: event.title
        })
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        })
    }
}

const getEventos = async (req, res = response) => {
    const events = await Event.find().populate('user', 'name')

    return res.status(200).json({
        ok: true,
        events
    })
}

const actualizarEvento = async (req, res = response) => {
    const event_id = req.params.id
    const uid = req.uid

    try {
        const event = await Event.findById(event_id)

        if ( !event ) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe por ese id'
            })
        }
        
        if (event.user.toString() !== uid) {
            // cuando se intenta actualizar un evento creado por otro usuario
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegios para editar este evento'
            })
        }
        const newEvent = {
            ...req.body,
            user: uid
        }

        const eventoActualizado = await Event.findByIdAndUpdate(event_id, newEvent, { new: true })

        return res.json({
            ok: true,
            evento: eventoActualizado
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        })
    }
}

const eliminarEvento = async (req, res = response) => {
    const event_id = req.params.id
    const uid = req.uid

    try {
        const event = await Event.findById(event_id)

        if ( !event ) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe por ese id'
            })
        }
        
        if (event.user.toString() !== uid) {
            // cuando se intenta actualizar un evento creado por otro usuario
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegios para eliminar este evento'
            })
        }

        await Event.findByIdAndDelete(event_id)

        return res.json({
            ok: true
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        })
    }
}

module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento,
}