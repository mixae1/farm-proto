import {React, useEffect, useState} from "react";
import {CardStack, randSeed, randOrder, randEvent} from './cardStack'
import {Card, ShopCard} from './card'
import {Player} from './player'
import {Shop} from './shop'
import {Field} from './field'
import {cards} from '../api/cards'
import {Notes} from './notes'

function App(){

    const [hand, setHand] = useState({
        seeds: [randSeed(0)],
        benefits: [],
        orders: [],
        plants: [],
    });

    const [event, setEvent] = useState(randEvent());

    const [coins, setCoins] = useState(6);

    const [step, setStep] = useState(0)

    const [draggedCard, setDraggedCard] = useState(undefined)

    const [knownNotes, setKnownNotes] = useState({
        0: [0, 3],
        1: [4],
        2: [0],
        3: [5],
        4: [1],
        5: [0, 2],

    })
    
    const [scientistNotes, setScientistNotes] = useState({
        0: [0, 3],
        1: [4],
        2: [0],
        3: [5],
        4: [1],
        5: [0, 2],

    })

    const [isLost, setIsLost] = useState(false)

    const [size, setSize] = useState(4)

    useEffect(() => {
    }, [])

    useEffect(() => {
        // logic...

        if(step % 4 == 0){
            if(hand.orders.length >= 3)
                setIsLost(true)

            setHand({
                ...hand,
                orders: [...hand.orders, randOrder(hand, scientistNotes)]
            })
        }

        setEvent(randEvent())

    }, [step])

    function stepHandler(){
        () => setStep(p => p + 1)
    }

    return(
        <main className='main'>
            <h1>Прототип фермы {isLost && "- Вы проиграли!"}</h1>
            <h2>Монет: {coins}</h2>
            <h2 title={event.details}>{step % 2 == 0 ? "День" : "Ночь"} {Math.floor(step / 2) + 1}, {step % 2 == 0 ? event.dName : event.nName}</h2>
            <div className="a1 betw">                
                <CardStack 
                    step={step} 
                    handPair={...[hand, (anew) => setHand(anew)]}/>
                <Notes 
                    knPair={...[knownNotes, (anew) => setKnownNotes(anew)]}
                    scPair={...[scientistNotes, (anew) => scientistNotes(anew)]}
                    dcPair={...[draggedCard, (anew) => setDraggedCard(anew)]}/>
                <Shop 
                    step={step} 
                    coinsPair={...[coins, (anew) => setCoins(anew)]} 
                    handPair={...[hand, (anew) => setHand(anew)]}
                    kn={knownNotes}
                    dcPair={...[draggedCard, (anew) => setDraggedCard(anew)]}/>
            </div>
            <Player 
                handPair={...[hand, (anew) => setHand(anew)]} 
                draggedCardPair={...[draggedCard, (anew) => setDraggedCard(anew)]} 
                kn={knownNotes}
                sizePair={...[size, (anew) => setSize(anew)]}
                eventPair={...[event, setEvent]}
                step={step}
                coinsPair={...[coins, (anew) => setCoins(anew)]}
                scPair={...[scientistNotes, (anew) => setScientistNotes(anew)]}/>
            <Field 
                draggedCardPair={...[draggedCard, (anew) => setDraggedCard(anew)]} 
                handPair={...[hand, (anew) => setHand(anew)]}
                knPair={...[knownNotes, (anew) => setKnownNotes(anew)]}
                timeProps={...[event, step]}
                sizePair={...[size, (anew) => setSize(anew)]}/>
            <button 
                onClick={() => setStep(p => p + 1)}
                disabled={hand.seeds.length + hand.plants.length + hand.benefits.length > 5}>Закончить ход</button>
        </main>    
    )

}

export {App};