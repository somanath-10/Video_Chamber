import { useEffect } from "react";
import { useSearchParams } from "react-router-dom"

export const Room = ()=>{
    const [searchparams,setsearchparams] = useSearchParams();
    const name = searchparams.get('name');
    useEffect(()=>{

    },[name])
    return(
        <div>
            Hi {name}
        </div>
    )
}