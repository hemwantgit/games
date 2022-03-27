import { COLOR_PALLET } from "./constants";

export const getWheelData =(entries) =>{
    if(!entries || !entries.length){
        return [];
    }
    let colorCount = COLOR_PALLET.length;
    return entries.map((entry, index) => {
        return{ option: entry, style: { backgroundColor: COLOR_PALLET[ index % colorCount], textColor: 'black' }}
    });
}