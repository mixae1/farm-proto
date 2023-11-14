import {React, useEffect, useState} from "react";
import {CardStack, randSeed, randBenefit} from './cardStack'
import {Card, ShopCard} from './card'

function Shop({step, coinsPair, handPair, kn, dcPair}){

    const [shopCards, setShopCards] = useState([randBenefit(), randSeed()])

    const [coins, setCoins] = coinsPair;

    useEffect(() => {
        if(step % 2 == 0    ){
            setShopCards([randBenefit(), randSeed()])
            setAvailable(true);
        }     
    }, [step])

    const [available, setAvailable] = useState(true);

    function updateShop(){
        setCoins(p => p - 1);
        setShopCards([randBenefit(), randSeed()]);
        setAvailable(false);
    }

    function dropHandler(e){
        const [dc, setDc] = dcPair
        const [hand, setHand] = handPair
        const [coins, setCoins] = coinsPair

        if(dc.type == undefined || !Object.keys(hand).includes(dc.type + 's')){
            setDc(undefined)
            return;
        }

        setHand({
            ...hand,
            [dc.type+'s']: hand[dc.type+'s'].filter((item) => {
                return item !== dc
            })
        })
        setCoins(prev => prev + 1)
    }

    return (
        <div className="border betwV"
            onDragOver={e => e.preventDefault()}
            onDrop={e => dropHandler(e)}>
            <h1>Магазин</h1>
            <div className="a1">
                <ShopCard 
                    data={shopCards[0]}
                    title={"Бенефит"}
                    coinsPair={coinsPair} 
                    handPair={handPair}
                    step={step}/>
                <ShopCard 
                    data={shopCards[1]}
                    title={"Семя"}
                    coinsPair={coinsPair} 
                    handPair={handPair}
                    kn={kn}
                    step={step}/>
            </div>
            <button onClick={updateShop} disabled={coins < 1 || !available}>Обновить (1)</button>
        </div>
    );
}

export {Shop}