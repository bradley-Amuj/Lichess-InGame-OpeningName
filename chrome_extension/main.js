const observe = (node,handler) =>{
  const observer = new MutationObserver(handler);
  observer.observe(node,{
      attributes:false,
      childList: true,
      subtree: true
  });
}
const display_opening_name=(node,opening_name)=>
{
document.querySelector(node).innerHTML = opening_name;
}


const get_data=(moves_list)=>{
const xhttp = new XMLHttpRequest();
xhttp.onload = ()=>{
    const data = JSON.parse(xhttp.responseText);
    if(data['query']['pages'][0]['missing']==true)return; //Opening is Invalid
    const openings_data = data['query']['pages'][0]['extract'];
    const htmlObject = document.createElement('div');
    htmlObject.innerHTML = openings_data;
    let opening_name =  htmlObject.querySelectorAll('span')[0].innerHTML;

    if(opening_name=="")opening_name = htmlObject.querySelectorAll('span')[1].innerHTML;

    //console.log(opening_name);
    display_opening_name('.material',opening_name);
}
//console.log(moves_list);
xhttp.open('GET',`https://en.wikibooks.org/w/api.php?titles=Chess_Opening_Theory/${moves_list}&redirects=&origin=*&action=query&prop=extracts&formatversion=2&format=json&exchars=200`);
xhttp.send();
}

const readMoves = (node)=>{
  const handler = ()=>{
      const moves = node.querySelectorAll("kwdb");
      let moves_list = ""
      let move_number  = 1;
      let pattern = 1;

      for(let j = 0;j<moves.length;j++)
      {
        if(pattern==1){
          moves_list +=move_number+"._"+moves[j].innerText+",";
          pattern = 0;
        }else{
          moves_list+=move_number+"..."+moves[j].innerText+",";
          pattern = 1;
        }
        if(j%2!=0)move_number++;
      }

    get_data(input_modification(moves_list.slice(0,-1)));

  }
  observe(node, handler);

}

/**Replace all commas with /
 * ie input:1._e4,1...e5,2._Nf3,2...Nf6,3._a3,3...a5
 * output: 1._e4/1...e5/2._Nf3/2...Nf6/3._a3/3...a5
 * That is the required data format to pass to the WikipediaAPI
 */
const input_modification = (moves) =>{
   return moves.replace(/,/g,"/");

}

console.log("What's the Opening Exension is Running");
const node = document.querySelector('rm6');
readMoves(node);
