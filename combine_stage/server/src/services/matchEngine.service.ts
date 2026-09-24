import type { FoodDonation, ShelterRequest, SmartMatchOption, DietaryType } from '../types.js';
const rad=(d:number)=>d*Math.PI/180;
export function haversineKm(a:{lat:number;lng:number},b:{lat:number;lng:number}):number {const dLat=rad(b.lat-a.lat),dLng=rad(b.lng-a.lng),h=Math.sin(dLat/2)**2+Math.cos(rad(a.lat))*Math.cos(rad(b.lat))*Math.sin(dLng/2)**2;return 6371*2*Math.atan2(Math.sqrt(h),Math.sqrt(1-h));}
function dietCompatible(food:DietaryType,shelter:DietaryType):boolean {
  if (shelter === 'Non-Vegetarian') return true;
  if (shelter === 'Jain') return food === 'Jain';
  if (shelter === 'Vegan') return food === 'Vegan';
  return food === 'Vegetarian' || food === 'Vegan' || food === 'Jain';
}
function dietPoints(food:DietaryType,shelter:DietaryType):number {return dietCompatible(food,shelter)?(food===shelter?15:12):0;}
function urgencyPoints(shelter:ShelterRequest,now:number):number {const base={Critical:25,High:22,Medium:18,Low:15}[shelter.urgency];const deadline=new Date(shelter.deadlineTime).getTime();if(!Number.isFinite(deadline))return base;const minutes=(deadline-now)/60000;return Math.max(0,Math.min(25,base+(minutes<=0?-10:minutes<=60?3:minutes<=180?1:0)));}
export function rankShelters(donation:FoodDonation,shelters:ShelterRequest[],now=new Date()):SmartMatchOption[]{return shelters.filter(s=>['Open','Partially Fulfilled'].includes(s.status)&&s.requiredMeals>s.receivedMeals+(s.reservedMeals||0)&&dietCompatible(donation.dietary,s.dietaryPreference)).map(s=>{
  const distanceKm=Number(haversineKm(donation.location,s.location).toFixed(1));
  const proximity=Math.max(5,Math.round(35-distanceKm*3.2));
  const deficit=s.requiredMeals-s.receivedMeals-(s.reservedMeals||0),ratio=Math.min(donation.quantityMeals,deficit)/Math.max(donation.quantityMeals,deficit,1);
  const quantityFit=Math.round(ratio*25), quantityMatchPercentage=Math.round(ratio*100), timeUrgency=urgencyPoints(s,now.getTime()), dietarySafety=dietPoints(donation.dietary,s.dietaryPreference);
  const matchScore=Math.min(98,proximity+quantityFit+timeUrgency+dietarySafety),etaMinutes=Math.round(distanceKm*2.8+6);
  return {shelter:s,matchScore,distanceKm,etaMinutes,urgencyBonus:timeUrgency,quantityMatchPercentage,scoreBreakdown:{proximity,quantityFit,timeUrgency,dietarySafety},reasoning:`${distanceKm} km from ${donation.location.area}; covers ${Math.min(donation.quantityMeals,deficit)} of ${deficit} meals; ${s.urgency.toLowerCase()} need with ${Math.max(0,Math.round((new Date(s.deadlineTime).getTime()-now.getTime())/60000))} min to deadline.`};
}).sort((a,b)=>b.matchScore-a.matchScore).slice(0,3);}
