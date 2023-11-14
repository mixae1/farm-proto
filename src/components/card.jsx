import {React, useEffect, useState} from "react";
import {reqs} from '../api/cards'
import { randBenefit, randEvent } from "./cardStack";
import {cards} from '../api/cards'

function randInt(max) {
    return Math.floor(Math.random() * max);
}

function valMap(key, val){
    const hidenAttr = [
        'type',
        'guid',
        'id',
        'details',
        'reward',
        'rewardBenefits',
        'reqNote',
        'reqPlant',
        'time',
        'usage',
        'reqs',
        //'currentGrowth',
        //'reqGrowth',
    ]
    
    mapping1 = {
        cursed: ["Обычная", "Проклятая"],
        wet: ["Сухая", "Влажная"],
        scarecrow: ["", "Защищена пугалом"],        
    }

    mapping2 = {
        time: "Оставшееся время: ",
        numberOfUsage: "Кол-во использований: ",
        orderSeed: "Растение: ",
    }

    if(hidenAttr.includes(key)) return;

    if(Object.keys(mapping1).includes(key))
        return <p>{mapping1[key][val]}</p>

    if(Object.keys(mapping2).includes(key))
        return <p>{mapping2[key]}{val}</p>
    
    if(key == 'name') return <b>{val}</b>
    else return <p>{val}</p>
}

function Card({data, title, draggedCardPair, isDraggable, kn, handPair, sizePair, eventPair, step, coinsPair, scPair}){

    const [isDragum, setIsDragum] = useState(isDraggable)

    function dragStartHandler(e, data){
        if(!isDragum){
            e.preventDefault()
            return
        } 

        const [draggedCard, setDraggedCard] = draggedCardPair
        //console.log("card dragStartHandler", data)
        setDraggedCard(data)
    }

    function dropHandler(e){
        if(data.type != 'order'){
            //e.preventDefault()        
            return
        }
        
        const [dc, setDc] = draggedCardPair  

        if(data.reqNote[1] > 0 && dc.type == 'note'){
            if(data.reqNote[0] == -1 || data.reqNote[0] == dc.id){
                const [hand, setHand] = handPair
                const [coins, setCoins] = coinsPair
                const [sc, setSc] = scPair
                orders = hand.orders
                benefits = hand.benefits

                if(data.reqNote[1] - 1 == 0){
                    orders = orders.filter((item) => {
                        return item !== data
                    })
    
                    // coins up
                    setCoins(p => p + data.reward)

                    // benefits up
                    for(let i = 0; i < data.rewardBenefits; i++){
                        benefits.push(randBenefit())
                    }
                }
                else{
                    orders.find((item) => {
                        return item === data
                    }).reqNote[1] -= 1
                }

                setSc({
                    ...sc,
                    [dc.id]: [...sc[dc.id], dc.req],
                })

                setHand({
                    ...hand,
                    orders: orders,
                    benefits: benefits,
                })
            }
        }
        
        if(data.reqNote[1] == 0 && dc.type == 'plant'){
            if(data.reqNote[0] == -1 || data.reqNote[0] == dc.id){

                const [hand, setHand] = handPair
                const [coins, setCoins] = coinsPair
            
                orders = hand.orders.filter((item) => {
                    return item !== data
                })
                
                // coins up
                setCoins(p => p + data.reward)
                
                // benefits up
                benefits = hand.benefits
                for(let i = 0; i < data.rewardBenefits; i++){
                    benefits.push(randBenefit())
                }
                
                plants = hand.plants.filter((item) => {
                    return item !== dc
                })

                setHand({
                    ...hand,
                    orders: orders,
                    benefits: benefits,
                    plants: plants,
                })
            }
        }
        
        setDc(undefined)
    }

    function clickHandler(){
        const [size, setSize] = sizePair
        const [hand, setHand] = handPair
        const [event, setEvent] = eventPair

        switch (data.id) {
            case 3:
                setSize(prev => prev + 1)
                break;
            case 4:
                setSize(prev => prev + 1)
                break;
            case 9:
                setEvent(randEvent(0))
                break;
            case 10:
                setEvent(randEvent(0))
                break;
            default:
                break;
        }

        if(data.numberOfUsage > 1){
            setHand({
                ...hand,
                benefits: [...hand.benefits.filter((item) => {
                    return item !== data
                }), 
                {
                    ...data,
                    numberOfUsage: data.numberOfUsage - 1
                }]
            })
        }
        else{
            setHand({
                ...hand,
                benefits: hand.benefits.filter((item) => {
                    return item !== data
                })
            })
        }
    }

    function disableHandler(){
        const [event, setEvent] = eventPair
        switch (data.id) {
            case 9:
                return step % 2 == 1 || event.id == 0
            case 10:
                return step % 2 == 0 || event.id == 0
            default:
                return false
        }
    }

    function dragHandler(){
        if(data.type != 'benefit') return true

        switch(data.id){
            case 7:
                return step % 2 == 1
            case 8:
                return step % 2 == 0
            default:
                return true
        }
    }

    useEffect(() => {
        setIsDragum(isDraggable && dragHandler())
    }, [step])

    function orderExtraInfo(){
        if(data.reqNote == undefined) return;
        if(data.reqNote[0] > -1){
            return <b>Растение: {cards.seeds[data.reqNote[0]].name}</b>
        }
        if(data.reqNote[1] > 0){
            return <b>Осталось записей: {data.reqNote[1]}</b>
        }
    }

    return (
        <div className={"card" + (isDragum ? " graben" : "") + (data.type == 'plant' ? " green" : "")}
            
            draggable={isDragum} 
            onDragStart={(e) => dragStartHandler(e, data)}

            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => dropHandler(e)}

            title={data.details}>

            <h3>{title}</h3>
            {                
                Object.keys(data).map((key) => {
                    if(key == 'reqs'){ // seed\plant
                        return data[key].map((i) => {
                            if(kn[`${data.id}`].includes(i))
                                return <p>{reqs[`${i}`]}</p>
                        })
                    }
                    return valMap(key, data[key])
                })
            }
            {
                data.type == 'order' &&
                orderExtraInfo()
            }
            {
                data.usage == 'use' &&
                <button onClick={clickHandler} disabled={disableHandler()}>Использовать</button>
            }
        </div>
    );
}

function ShopCard({data, title, coinsPair, handPair, kn, step}){

    const [coins, setCoins] = coinsPair;

    function buyCard(){
        setCoins(prev => prev - 2);
        setAvailable(false);

        const [hand, setHand] = handPair;
        if(data.type == "seed"){
            setHand({
                ...hand,
                seeds: [...hand.seeds, data]
            })
        }
        if(data.type == "benefit"){
            setHand({
                ...hand,
                benefits: [...hand.benefits, data]
            })
        }
    }

    const [available, setAvailable] = useState(true);

    useEffect(() => {
        setAvailable(true);
    }, [data]);

    return (      
            <div className="card betwV" title={data.details}>
                <div>
                    <h3>{title}</h3>
                    {           
                        (available ?  
                            Object.keys(data).map((key) => {
                                if(key == 'reqs'){
                                    return data[key].map((i) => {
                                        if(kn[`${data.id}`].includes(i))
                                            return <p>{reqs[`${i}`]}</p>
                                    })
                                }
                                return valMap(key, data[key])
                        })
                        :
                        <p>Куплено</p>
                        )
                    }
                </div>
                <button onClick={buyCard} disabled={coins < 2 || !available || step % 2 == 1}>Купить (2)</button>
            </div>
 
    );
}

function FieldCard({data, draggedCardPair, handPair, knPair, timeProps}){
    const [draggedCard, setDraggedCard] = draggedCardPair
    const [hand, setHand] = handPair
    const [datum, setDatum] = useState(data)
    const [kn, setKN] = knPair
    const [event, step] = timeProps

    useEffect(() => {
        delta = 0
        switch (event.id) {
            case 0:
                if(datum.seed != undefined){
                    delta += datum.seed.reqs.includes(5) && step % 2 == 0
                    delta += datum.seed.reqs.includes(4) && step % 2 == 1

                    if(delta != 0){
                        setKN({
                            ...kn,
                            [datum.seed.id]: [...kn[datum.seed.id], (datum.seed.reqs.includes(5) ? 5 : 4)],
                        })
                    }

                    setDatum({
                        ...datum,
                        seed: {
                            ...datum.seed,
                            currentGrowth: datum.seed.currentGrowth + delta
                        }
                    })
                }
                break;
            case 1:
                break;
            case 2:
                isDry = Math.random() > 0.5
                if(datum.seed == undefined){
                    setDatum({
                        ...datum,
                        wet: !isDry && datum.wet,
                    })  
                    break
                }

                if(isDry){

                    delta += datum.seed.reqs.includes(1)
                    delta -= datum.seed.reqs.includes(0)

                    setDatum({
                        ...datum,
                        wet: !isDry && datum.wet,
                        seed: {
                            ...datum.seed,
                            currentGrowth: datum.seed.currentGrowth + delta
                        }
                    })   
                }
                    
                break;
            case 3:
                isCursed = Math.random() > 0.5
                if(datum.seed == undefined){
                    setDatum({
                        ...datum,
                        cursed: isCursed || datum.cursed,
                    })  
                    break
                }

                if(isCursed){

                    delta += datum.seed.reqs.includes(2)
                    delta -= datum.seed.reqs.includes(3)
                    
                    setDatum({
                        ...datum,
                        cursed: isCursed || datum.curse,
                        seed: {
                            ...datum.seed,
                            currentGrowth: datum.seed.currentGrowth + delta
                        }
                    }) 
                }
                    
                break;
            case 4:
                isWet = Math.random() > 0.5
                if(datum.seed == undefined){
                    setDatum({
                        ...datum,
                        wet: isWet || datum.wet,
                    })  
                    break
                }

                if(isWet){

                    delta += datum.seed.reqs.includes(0)
                    delta -= datum.seed.reqs.includes(1)
                    
                    setDatum({
                        ...datum,
                        wet: isWet || datum.wet,
                        seed: {
                            ...datum.seed,
                            currentGrowth: datum.seed.currentGrowth + delta
                        }
                    })
                }
                break;
            case 5:
                if(datum.seed == undefined){
                    break
                }
                
                setDatum({
                    ...datum,
                    seed: {
                        ...datum.seed,
                        currentGrowth: datum.seed.currentGrowth + 1
                    }
                })
                break;
            case 6:
                if(datum.seed == undefined || datum.scarecrow){ 
                    break
                }

                if(datum.seed.reqs.includes(6)) delta = 1
                else delta = -1

                setDatum({
                    ...datum,
                    seed: {
                        ...datum.seed,
                        currentGrowth: datum.seed.currentGrowth + delta
                    }
                })
                break;
            default:
                break;
        }
    }, [event])

    useEffect(() => {
        if(datum.seed){
            delta = 0
            if(!(datum.seed.reqs.includes(4) || datum.seed.reqs.includes(5))) delta = 0.5
            if(datum.seed.reqs.includes(4) && step % 2 == 0 && event.id != 0) delta = 1
            if(datum.seed.reqs.includes(5) && (step % 2 == 1 || event.id == 0)) delta = 1
            setDatum({
                ...datum,
                seed: {
                    ...datum.seed,
                    currentGrowth: datum.seed.currentGrowth + delta
                }
            })
        }
    }, [step])

    useEffect(() => {
        if(datum.seed != undefined && datum.seed.currentGrowth >= datum.seed.reqGrowth){
            setHand({
                ...hand,                
                plants: [...hand.plants, {
                    type: 'plant',
                    id: datum.seed.id,
                    name: datum.seed.name,
                    reqs: datum.seed.reqs,
                }],
            })
            setDatum({
                ...datum,
                seed: undefined,
            })
        }
    }, [datum])

    function seedDropHandler(e){
        //e.preventDefault() 
        if(datum.seed == undefined){
            newkn = []
            delta = 0
            delta += draggedCard.reqs.includes(0) && datum.wet
            delta += draggedCard.reqs.includes(1) && !datum.wet
            delta -= (draggedCard.reqs.includes(0) && !datum.wet) ||
                    (draggedCard.reqs.includes(1) && datum.wet)

            if(draggedCard.reqs.includes(0) && !datum.wet) newkn.push(0)
            if(draggedCard.reqs.includes(1) && datum.wet) newkn.push(1)

            delta += draggedCard.reqs.includes(2) && datum.cursed
            delta += draggedCard.reqs.includes(3) && !datum.cursed
            delta -= (draggedCard.reqs.includes(2) && !datum.cursed) ||
                    (draggedCard.reqs.includes(3) && datum.cursed)
                    
            if(draggedCard.reqs.includes(2) && !datum.cursed) newkn.push(2)
            if(draggedCard.reqs.includes(3) && datum.cursed) newkn.push(3)

            delta += draggedCard.reqs.includes(4) && step % 2 == 0 && event.id != 0
            delta += draggedCard.reqs.includes(5) && (step % 2 == 1 || event.id == 0)
            if(!(draggedCard.reqs.includes(4) || draggedCard.reqs.includes(5))) delta += 0.5

            setDatum({
                ...datum,
                seed: {
                    ...draggedCard,
                    currentGrowth: delta,
                }
            })
            setHand({
                ...hand,
                seeds: hand.seeds.filter((item) => {
                    return item !== draggedCard
                })
            })
            setKN({
                ...kn,
                [draggedCard.id]: [...kn[draggedCard.id], ...newkn]
            })
        }
    }

    function benefitDropHandler(e){ 
        if(draggedCard.usage == 'use') return;       
        if(draggedCard.usage != 'field' && draggedCard.usage == 'plant' && !datum.seed) return;

        delta = 0
        switch (draggedCard.id) {
            case 0:
                delta += datum.seed.reqs.includes(0)
                delta -= datum.seed.reqs.includes(1)

                setDatum({
                    ...datum,
                    wet: true,
                    seed: {
                        ...datum.seed,
                        currentGrowth: datum.seed.currentGrowth + delta
                    }
                })
                if(delta != 0){
                    id = `${datum.seed.id}`
                    if(!(kn[id].includes(0) || kn[id].includes(1))){
                        setKN({
                            ...kn,
                            [id]: [...kn[id], (delta > 0 ? 0 : 1)]
                        })
                    }
                }
                break;
            case 1:
                setDatum({
                    ...datum,
                    scarecrow: true
                })
                break;
            case 2:
                setDatum({
                    ...datum,
                    seed: {
                        ...datum.seed,
                        currentGrowth: datum.seed.currentGrowth + 1
                    }
                })
                break;
            case 5: //зарядить его эссенцией
                delta += datum.seed.reqs.includes(7)
                delta -= datum.seed.reqs.includes(8)

                setDatum({
                    ...datum,
                    seed: {
                        ...datum.seed,
                        currentGrowth: datum.seed.currentGrowth + delta
                    }
                })
                if(delta != 0){
                    id = `${datum.seed.id}`
                    if(!(kn[id].includes(7) || kn[id].includes(8))){
                        setKN({
                            ...kn,
                            [id]: [...kn[id], (delta > 0 ? 7 : 8)]
                        })
                    }
                }
                break;
            case 6:
                delta += datum.seed.reqs.includes(6)

                setDatum({
                    ...datum,
                    seed: {
                        ...datum.seed,
                        currentGrowth: datum.seed.currentGrowth + delta
                    }
                })
                if(delta > 0){
                    id = `${datum.seed.id}`
                    if(!kn[id].includes(6)){
                        setKN({
                            ...kn,
                            [id]: [...kn[id], 6]
                        })
                    }
                }
                break;
            case 7:
                delta += datum.seed.reqs.includes(4)
                delta -= datum.seed.reqs.includes(5)

                setDatum({
                    ...datum,
                    seed: {
                        ...datum.seed,
                        currentGrowth: datum.seed.currentGrowth + delta
                    }
                })
                if(delta != 0){
                    id = `${datum.seed.id}`
                    if(!(kn[id].includes(4) || kn[id].includes(5))){
                        setKN({
                            ...kn,
                            [id]: [...kn[id], (delta > 0 ? 4 : 5)]
                        })
                    }
                }
                break;
            case 8:
                delta += datum.seed.reqs.includes(5)
                delta -= datum.seed.reqs.includes(4)

                setDatum({
                    ...datum,
                    seed: {
                        ...datum.seed,
                        currentGrowth: datum.seed.currentGrowth + delta
                    }
                })
                if(delta != 0){
                    id = `${datum.seed.id}`
                    if(!(kn[id].includes(4) || kn[id].includes(5))){
                        setKN({
                            ...kn,
                            [id]: [...kn[id], (delta > 0 ? 5 : 4)]
                        })
                    }
                }
                break; 
            case 11:
                // Записки ученого
                id = `${datum.seed.id}`
                let difference = datum.seed.reqs.filter(x => !kn[id].includes(x));
                if(difference.length > 0){
                    setKN({
                        ...kn,
                        [id]: [...kn[id], difference[randInt(difference.length)]]
                    })
                }
                break;   

            default:
                console.log("use benefit error")
                break;
        }
        
        if(draggedCard.numberOfUsage > 1){
            setHand({
                ...hand,
                benefits: [...hand.benefits.filter((item) => {
                    return item !== draggedCard
                }), 
                {
                    ...draggedCard,
                    numberOfUsage: draggedCard.numberOfUsage - 1
                }]
            })
            setDraggedCard({
                ...draggedCard,
                numberOfUsage: draggedCard.numberOfUsage - 1
            })
        }
        else{
            setHand({
                ...hand,
                benefits: hand.benefits.filter((item) => {
                    return item !== draggedCard
                })
            })
        }
        
    }

    function dropHandler(e){
        if(draggedCard.type == 'seed')
            seedDropHandler(e)
        
        if(draggedCard.type == 'benefit')
            benefitDropHandler(e)

        setDraggedCard(undefined)
    }

    return (
        <div className="card" 
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => dropHandler(e)}>
            <h3>Клетка грядки</h3>
            {Object.keys(datum).map((key) => {
                if(key != 'seed')
                    return valMap(key, datum[key] ? 1 : 0)
                if(datum[key] != undefined)
                    return <Card 
                                data={datum[key]} 
                                title={"Семя"} 
                                kn={kn}/>
            })}
        </div>
    );
}

export {Card, ShopCard, FieldCard}