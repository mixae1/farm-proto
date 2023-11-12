import {reqs, cards} from '../api/cards'

function Note({data, dcPair}){
    const [dc, setDc] = dcPair
    function dragStartHandler(e){
        //e.preventDefault()
        setDc(data)
    }
    
    return (
        <div 
            className='note graben' 
            onDragStart={dragStartHandler} 
            draggable={true}>{cards.seeds[data.id].name}: {reqs[data.req]}</div>
    )
}

function Notes({knPair, scPair, dcPair}){
    const [kn, setKn] = knPair
    const [sc, setSc] = scPair
    return (
        <div className="notes betwV border">
            <h1>Записи</h1>
            {
                Object.keys(kn).map((plantId) => {
                    return kn[plantId].map((req) => {
                        if(!sc[plantId].includes(req)){
                            return <Note 
                                        data={{type: 'note', id: plantId, req: req}}
                                        dcPair={dcPair}/>
                        }
                    })
                })
            }
        </div>
    );
}

export {Notes}