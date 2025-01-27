const timeConverter = (time) => {
  time = Number(time); 

  let ss = time % 60; 
  if (ss < 10) ss = `0${ss}`;

  let min = Math.floor(time / 60) % 60; 
  if (min < 10) min = `0${min}`; 

  let hh = Math.floor(time / 3600); 
  if (hh < 10) hh = `0${hh}`; 


  
  if (hh === 0) {
    return `${min}:${ss}`; 
  }

  return `${hh}:${min}:${ss}`; 
}

export default timeConverter;


