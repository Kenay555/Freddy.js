import {
  Mate2,
  Biblioteca,
  Neu,
  Capa,
  Freddy,
} from './Freddy.js' //v1.2

let sumador = new Freddy([3, 4, 5, 3, 2], ['sigm', 'sigm', 'sigm', 'sigm']);
let suma = Biblioteca.suma;

for (let i = 1; i < 10; i++) 
      sumador.entrenar(suma, 1500); //Entrenamiento

let err = 0
for (let {entradas, salidas} of suma) { //Por cada suma posible
  let res = sumador.activar(entradas); //Pregúntale a Freddy
  res = res[0] * 2 + res[1] //Esta es su respuesta
  let cuántos = salidas[0] * 2 + salidas[1]; //Esto es lo que queríamos
  console.log(`  ${entradas.join(' + ')} = ${cuántos}`) //Rpta.:
  console.log(`${res.toFixed(5)}, casi ${Math.round(res)}`)
  err += Math.pow(res - cuántos, 2) //Error al cuadrado
}
err /= 8
console.log(`Error: ${err}`) //Muestra el error
console.log(JSON.stringify(sumador.aJSON))
