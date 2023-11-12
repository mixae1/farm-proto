import { useEffect, useState } from "react";
import {FieldCard} from './card'

function Field({draggedCardPair, handPair, knPair, timeProps, sizePair}){

    const [size, setSize] = sizePair
    const [fields, setFields] = useState([])

    function randGround(){
        return {
            cursed: Math.random() > 0.8,
            wet: Math.random() > 0.6,
            seed: undefined
        }
    }

    useEffect(() => {
        data = []
        for (let i = 0; i < size; i++) {
            data.push(randGround())
        }
        setFields(data)
    }, [])

    useEffect(() => {
        data = []
        if(fields.length < size){
            for (let i = 0; i < size - fields.length; i++) {
                data.push(randGround())
            }
            setFields([...fields, ...data])
        }
    }, [size])

    return (
        <div className="border">               
            <h1>Поле</h1>
            <div className="a1">
                {fields.map((data) => {
                    return <FieldCard 
                                data={data} 
                                draggedCardPair={draggedCardPair} 
                                handPair={handPair}
                                knPair={knPair}
                                timeProps={timeProps}/>
                })}
            </div>
        </div>
    );
}

export {Field}