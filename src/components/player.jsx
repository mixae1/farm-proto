import { useState } from "react"
import {Card} from './card'

function Player({handPair, draggedCardPair, kn, sizePair, eventPair, step, coinsPair, scPair})
{ 
    const [hand, setHand] = handPair
    return (
        <div className="border">
            <h1>Рука</h1>
            <div className="a1">
                {
                    hand.plants.map((data) => {
                        return <Card 
                                    data={data} 
                                    title={"Растение"} 
                                    draggedCardPair={draggedCardPair} 
                                    isDraggable={true}
                                    kn={kn}/>
                    })
                }
                {
                    hand.seeds.map((data) => {
                        return <Card 
                                    data={data} 
                                    title={"Семя"} 
                                    draggedCardPair={draggedCardPair} 
                                    isDraggable={true}
                                    kn={kn}/>
                    })
                }
                {
                    hand.benefits.map((data) => {
                        if(data.usage == 'use'){
                            return <Card 
                                        data={data} 
                                        title={"Бенефит"}
                                        handPair={handPair}
                                        sizePair={sizePair} 
                                        eventPair={eventPair}
                                        draggedCardPair={draggedCardPair}
                                        isDraggable={true} // for selling only
                                        step={step}/>
                        }
                        else{
                            return <Card 
                                        data={data} 
                                        title={"Бенефит"} 
                                        draggedCardPair={draggedCardPair} 
                                        isDraggable={true}
                                        step={step}/>
                        }
                    })
                }
                {
                    hand.orders.map((data) => {
                        return <Card 
                                    data={data} 
                                    title={"Заказ"}
                                    draggedCardPair={draggedCardPair}
                                    handPair={handPair}
                                    coinsPair={coinsPair}
                                    scPair={scPair} />
                    })
                }
            </div>
        </div>
    );
}

export {Player}