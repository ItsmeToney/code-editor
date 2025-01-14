// /* eslint-disable react/prop-types */
// import  { useEffect, useState } from "react";

// const Timer = ({ duration, onTimeUp }) => {
//   const [hr, setHr] = useState(duration);
//   const [min, setMin] = useState(()=>{
//     Math.round(hr/60)
//   });
//   const [sec, setSec] = useState(()=>{
//     Math.round(min/60)
//   });
//   useEffect(() => {
//     if (sec === 0 && min === 0 && hr === 0) {
//       onTimeUp();
//       return;
//     }

//     const Sectimer = setTimeout(() => setSec(sec - 1), 1000);
//     if(sec == 0 && min !== 0)  setMin(min - 1)
//     if(min == 0 && hr !== 0)  setHr(hr - 1)
//     return () => clearTimeout(Sectimer);
//   }, [hr, onTimeUp, min, sec]);
  
//   const formatTime = () => {
//     return `${hr < 10 ? `0${hr}` : hr}:${min < 10 ? `0${min}` : min}:${sec < 10 ? `0${sec}` : sec}`;
//   };

//   return  <h1 className="font-medium text-xl">
//             Time reamining:<span className="text-red-500"> {formatTime()} </span>
//           </h1>
 
// };

// export default Timer;
