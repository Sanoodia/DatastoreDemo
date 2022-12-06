import { useEffect } from "react";
import { DataStore } from "aws-amplify";
import { CatHerd } from "./models";

const ContentDiv = () => {
    let sub;
    const addSubscription = async () => {
        console.log('a');
        sub = DataStore.observeQuery(CatHerd, (c) =>
        c.classification.eq("DRIVER")
        ).subscribe(({ items }) => {
                console.log(items)
        }); 
    }
    useEffect(()=>{
        addSubscription()
        return () => {
            if(sub){
                sub.unsubscribe();
            }
        };
    },[])
    return(
        <div>Content</div>
    )
}
export default ContentDiv;