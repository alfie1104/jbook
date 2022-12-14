import { useTypedSelector } from "./use-typed-selector";

export const useCumulativeCode = (cellId: string) => {
  return useTypedSelector((state) => {
    const { data, order } = state.cells;
    const orderedCells = order.map((id) => data[id]);

    const showFunc = `
        import _React from "react";
        import _ReactDOM from "react-dom"
    
        var show = (value) => {
         const root = document.querySelector('#root');
    
         if(typeof value === 'object'){
           if(value.$$typeof && value.props){
             _ReactDOM.render(value, root);
           }else{
             root.innerHTML = JSON.stringify(value);
           }
         }else{
           root.innerHTML = value;
         }
        };
       `;

    const showFuncNoop = "var show = () => {}";
    const cumulativeCode = [];

    for (let c of orderedCells) {
      //Accumulate codes from previous cell to current cell
      if (c.type === "code") {
        //previous cells
        if (c.id === cellId) {
          cumulativeCode.push(showFunc);
        } else {
          cumulativeCode.push(showFuncNoop);
        }
        cumulativeCode.push(c.content);
      }

      if (c.id === cellId) {
        //current cell
        break;
      }
    }
    return cumulativeCode;
  }).join("\n");
};
