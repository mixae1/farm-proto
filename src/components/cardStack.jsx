import {React, useState, useEffect} from 'react'
import {cards, names} from '../api/cards'

function randInt(max) {
    return Math.floor(Math.random() * max);
}

function randSeed(i1){
    if(i1 == undefined)
        i1 = randInt(cards.seeds.length)    
    seed = cards.seeds[i1]
    return {
        type: 'seed',
        ...seed, 
        guid: Math.random(),
        currentGrowth: 0,
        reqGrowth: seed.reqs.length * 2 + 1,
        aboutDie: false,
    }
}

function randEvent(i1){
    if(i1 == undefined) i1 = randInt(cards.events.length) 
    return {
        type: 'event',
        ...cards.events[i1],
    }
}

function randOrder(hand, sc){
    if(hand.orders.length >= cards.orders.length) 
    return {
        type: 'order',
        id: -1,
        text: 'Ты бесполезен, убирайся к чертовой матери!',
        details: "Вы проиграли.",
    }

    order = cards.orders[randInt(cards.orders.length)]
    while(hand.orders.find(item => item.id == order.id) != undefined) 
        order = cards.orders[randInt(cards.orders.length)]

    genPlant = order.reqNote[0]
    if(genPlant == undefined) {
        genPlant = randInt(cards.seeds.length)
        while(cards.seeds[genPlant].reqs.length - sc[genPlant].length == 0) genPlant = randInt(cards.seeds.length)
    }

    return {
        type: "order",
        ...order,
        reqNote: [genPlant, order.reqNote[1]],
    }
}

function randBenefit(){
    benefit = cards.benefits[randInt(cards.benefits.length)]
    return { 
        type: "benefit",
        ...benefit,
        numberOfUsage: benefit.numberOfUsage[randInt(benefit.numberOfUsage.length)]
    }
}

export {randSeed, randEvent, randOrder, randBenefit}