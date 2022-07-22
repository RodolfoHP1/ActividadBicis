const mongoose = require('mongoose')
const { isReadStream } = require('request/lib/helpers')
const Bicicleta = require('../models/bicicleta')
var assert = require('assert');

describe('Testing bicicletas', function(){
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
        Bicicleta.deleteMany({}, function(err, success){
            if(err) console.log(err)
            const db = mongoose.connection
            db.close()
            done()
        })
    })

    //Tests...

    //Checar el createInstance
    describe('Bicicleta.createInstance', ()=>{
        it('crea una instancia de la bicicleta', (done)=>{
            let bici = Bicicleta.createInstance(1, 'verde', 'urbana', [-99.13,19.28 ])
            assert.equal(bici.code, 1)
            assert.equal(bici.color, 'verde')
            assert.equal(bici.modelo, 'urbana')
            assert.equal(bici.ubicacion[0], -99.13)
            assert.equal(bici.ubicacion[1], 19.28)
            done()
        })
    });

    //Checar el allBicis
    describe('Bicicleta.allBicis', ()=>{
        it('comienza vacía', (done)=>{
            Bicicleta.allBicis(function(err, bicis){
                assert.equal(bicis.length, 0)
                done()
            })
        })
    })

    //Add a bike
    describe('Bicicletas.add', ()=>{
        it('agrega una bici', (done)=>{
            let bici = new Bicicleta({code: 1, color: 'verde', modelo: 'urbana'})
            Bicicleta.add(bici, function(err, newBici){
                if(err) console.log(err)
                Bicicleta.allBicis(function(err, bicis){
                    assert.equal(bicis.length, 1)
                    assert.equal(bicis[0].code, bici.code)
                    done()
                })
            })
        })
    })

    //Find by code
    describe('Find a bike by its code', ()=>{
        it('should return bike with code 1', (done)=>{
            Bicicleta.allBicis(function(err, bicis){
                assert.equal(bicis.length, 0)

                let bici = new Bicicleta({code: 1, color: 'verde', modelo: 'urbana'})
                Bicicleta.add(bici, function(err, newBike){
                    if(err) console.log(err)

                    let bici2 = new Bicicleta({code: 2, color: 'blanca', modelo: 'montaña'})
                    Bicicleta.add(bici2, function(err, newBike){                        
                        if(err) console.log(err)

                        Bicicleta.findByCode(1, function(err, targetBici){
                            assert.equal(targetBici.code, bici.code)
                            assert.equal(targetBici.color, bici.color)
                            assert.equal(targetBici.modelo, bici.modelo)
                            done()
                        })
                    })
                })
            })
        })
    })


    //Remove by code
    describe('Remove a bike by its code', ()=>{
        it('should delete bike with code 1', (done)=>{
            Bicicleta.allBicis(function(err, bicis){
                assert.equal(bicis.length, 0)

                let bici = new Bicicleta({code: 1, color: 'verde', modelo: 'urbana'})
                Bicicleta.add(bici, function(err, newBike){
                    if(err) console.log(err)
                    Bicicleta.allBicis(function(err, bicis){
                        assert.equal(bicis.length, 1)
                        Bicicleta.removeByCode(1, function(err, cb){
                            Bicicleta.allBicis(function(err, bicis){
                                assert.equal(bicis.length, 0)
                                done()
                            })
                        })
                    })
                })
            })
        })
    })



})