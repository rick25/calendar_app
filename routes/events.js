/*
    Rutas de Events /api/events
*/
const { Router } = require('express')
const { check } = require('express-validator')
const router = Router()
const { validarCampos } = require('../middlewares/validar-campos')
const { validarJWT } = require('../middlewares/validar-jwt')
const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require('../controllers/events')
const { isDate } = require('../helpers/isDate')

// A partir de aqui todas las rutas tienen que pasar por la validacion del JWT
router.use( validarJWT )

router.post(
    '/',
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'La fecha de inicio es obligatoria').custom( isDate ),
        check('end', 'La fecha de finalización es obligatoria').custom( isDate ),
        validarCampos
    ],
    crearEvento
)

router.get(
    '/',
    getEventos
)

router.put(
    '/:id',
    actualizarEvento
)

router.delete(
    '/:id',
    eliminarEvento
)

module.exports = router