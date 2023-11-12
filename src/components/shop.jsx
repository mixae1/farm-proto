import {React, useEffect, useState} from "react";
import {CardStack, randSeed, randBenefit} from './cardStack'
import {Card, ShopCard} from './card'

function Shop({step, coinsPair, handPair, kn}){

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

    return (
        <div className="border betwV">
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