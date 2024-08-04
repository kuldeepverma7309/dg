let arr = [4,2,9,11,5,7]

// function maxmum(arr){
//     let max = arr[0];
//     for(let i=1; i<arr.length; i++){
//         if(arr[i]>max){
//             max = arr[i];
//         }
//     }
//     return max;
// }

// console.log(maxmum(arr)); // Output: 11

arr = arr.filter((ele)=>ele %2 == 0);
function maximum(arr){
    let max = arr[0];
    for(let i=1; i<arr.length; i++){
        if(arr[i]>max){
            max = arr[i];
        }
    }
    return max;
}

console.log(maximum(arr)); 