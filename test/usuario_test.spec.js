const mongoose = require('mongoose')
const { isReadStream } = require('request/lib/helpers')
const Bicicleta = require('../models/bicicleta')
const Usuario = require('../models/usuario')
const Reserva = require('../models/reserva')
var assert = require('assert');

describe('Testing usuarios', function(){
    beforeEach(function(done){
        var mongoDB = 'mongodb://127.0.0.1:27017/red_bicicletas?retryWrites=true&w=majority'
        mongoose.connect(mongoDB, {useNewUrlParser: true})

        const db = mongoose.connection
        db.on('error', console.error.bind(console, 'connection error'))
        db.once('open', function(){
            //console.log('Connected to the test database')
            done()
        })
    })

    afterEach(function(done){
        Reserva.deleteMany({}, function(err, success){
            if(err) console.log(err)
            Usuario.deleteMany({}, function(err, success){
                if(err) console.log(err)
                Bicicleta.deleteMany({}, function(err, success){
                    if(err) console.log(err)
                    const db = mongoose.connection
                    db.close()
                    done()
                })
            })
        })
    })

    //Tests...
    //Reservar una bici
    describe('Un usuario reserva una bici', ()=>{
        it('debe existir la reserva', (done)=>{
            let usuario = new Usuario({nombre: 'Luis', password: 'miSuperPass1287word', email: 'luis@yo.com'})
            usuario.save()
            let bicicleta = new Bicicleta({code: 1, color: 'verde', modelo: 'urbana'})
            bicicleta.save()
            let hoy = new Date()
            let mañana = new Date()
            mañana.setDate(hoy.getDate()+1)

            usuario.reservar(bicicleta.id, hoy, mañana, function(err, reserva){
                Reserva.find({}).populate('bicicleta').populate('usuario').exec(function(err, reservas){
                    //console.log(reservas[0])
                    assert.equal(reservas.length, 1)
                    assert.equal(reservas[0].diasDeReserva(), 2)
                    assert.equal(reservas[0].bicicleta.code, 1)
                    assert.equal(reservas[0].usuario.nombre, usuario.nombre)
                    done()
                })
            })
        })
    }); 
})