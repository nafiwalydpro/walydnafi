(() => {
  const grid=document.getElementById('calendarGrid'), title=document.getElementById('monthTitle'), selectedLabel=document.getElementById('selectedDate');
  const prev=document.getElementById('prevMonth'), next=document.getElementById('nextMonth');
  const now=new Date(); now.setHours(0,0,0,0); let view=new Date(now.getFullYear(),now.getMonth(),1), selected=null;
  const months=['JANVIER','FÉVRIER','MARS','AVRIL','MAI','JUIN','JUILLET','AOÛT','SEPTEMBRE','OCTOBRE','NOVEMBRE','DÉCEMBRE'];
  const days=['DIMANCHE','LUNDI','MARDI','MERCREDI','JEUDI','VENDREDI','SAMEDI'];
  const same=(a,b)=>a.getFullYear()===b.getFullYear()&&a.getMonth()===b.getMonth()&&a.getDate()===b.getDate();
  function render(){
    const y=view.getFullYear(),m=view.getMonth(); title.textContent=`${months[m]} ${y}`; grid.innerHTML='';
    const first=new Date(y,m,1), offset=(first.getDay()+6)%7, count=new Date(y,m+1,0).getDate();
    for(let i=0;i<offset;i++){const b=document.createElement('button');b.className='rdv-day other';b.disabled=true;grid.appendChild(b)}
    for(let n=1;n<=count;n++){const d=new Date(y,m,n),b=document.createElement('button');b.type='button';b.className='rdv-day';b.textContent=n;
      if(same(d,now))b.classList.add('today'); if(same(d,selected||new Date(0)))b.classList.add('selected');
      const unavailable=d<now||d.getDay()===0||d.getDay()===6;b.disabled=unavailable;
      if(!unavailable)b.addEventListener('click',()=>{selected=new Date(d);selectedLabel.textContent=`${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()].toLowerCase()} ${d.getFullYear()} — créneaux disponibles à venir`;selectedLabel.classList.add('has-date');render()});
      grid.appendChild(b);
    }
    while(grid.children.length<42){const b=document.createElement('button');b.className='rdv-day other';b.disabled=true;grid.appendChild(b)}
    prev.disabled=view<=new Date(now.getFullYear(),now.getMonth(),1);
  }
  prev.addEventListener('click',()=>{if(!prev.disabled){view=new Date(view.getFullYear(),view.getMonth()-1,1);render()}});
  next.addEventListener('click',()=>{view=new Date(view.getFullYear(),view.getMonth()+1,1);render()});
  render();
})();
