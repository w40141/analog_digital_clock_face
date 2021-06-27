// Add zero in front of numbers < 10
export function zeroPad(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

// export function spacePad(n, i) {
//   if (i < 100) {
//     i = " " + i;
//   }
//   return i;
// }

export function spacePad(n, i) {
  return ( '     ' + i ).slice( -n );
}