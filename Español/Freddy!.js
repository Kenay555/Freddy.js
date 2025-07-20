/**
 * Freddy™ es una IA básica y simple que puede aprender y corregirse
 * Yo [Kenay, creador de esto] te guiaré neurona por neurona, capa por capa, y Freddy por Freddy. ™.
 */

/**
 * 17 de Junio del 2025 es cunado Freddy.js v1.0 fue terminado.
 * 13 de Julio es cuando Freddy.js v1.1 estuvo listo
 * Hoy, 20 de Julio, es cuando tradusco este archivo al español, y la versión v1.2 estuvo lista
 *
 * Ni crean que me copié esto de algún gringo, todo ha sido escrito por mí,
 * mi única excusa es que sólo leía articulos en ingles, y se me pegó...
 * No es que no halla documentos sobre IAs en español, sólo prefiero los angloparlantes.
 */

/*
 * Varias cosas cambio no sólo para diferenciarla de la otra versión,
 * también para adecuarlo a este lenguaje.
 *
 * Number => Número, Racional
 * String => Cadena, Frase
 * Array => Tupla
 * Boolean => Binario
 *
 * Y una cosita más: Este no es idéntico a su contraparte ingles,
 * que ese la escribí en la madrugada, y este lo escribo durante el día.
 * Asi que con mis ojos más despiertos que nunca, me pongo a traducir.
 */

/**
 * La clase Mate2 es como... El antebrazo de Freddy,
 * o sea, no piensas mucho de su existencia hasta que lo pierdes.
 */
const Mate2 = {
  /**
   * Funciones: 'sigm', 'tanh', 'relu', 'lineal', 'corta' (las dos últimas son horribles)
   *
   * Las derivadas se calculan directamente, no como en el ingles que primero la normalita
   *
   * NO OLVIDES: Si personalizas esta caja con una función 'fulano()', recuerda añadir 'fulanoDx()'
   * Si no lo haces (o lo haces mal) todo se va al río :(
   */
  funciones: ['sigm', 'tanh', 'relu', 'lineal', 'corta'],
  sigm: x => {
    //Sigmoide
    return 1 / (1 + Math.exp(-x));
  },
  sigmDx: x => {
    let s = Mate2.sigm(x);
    return s * (1 - s);
  },
  tanh: x => {
    //TANgente Hiperbólica
    return Math.tanh(x);
  },
  tanhDx: x => {
    let t = Math.tanh(x);
    return 1 - t * t;
  },
  relu: x => {
    //REctified Linear Unit
    return Math.max(0, x);
  },
  reluDx: x => {
    return x > 0 ? 1 : 0;
  },
  lineal: x => {
    //Una lineal de toda la vida
    return x;
  },
  linealDx: x => {
    return 1;
  },
  corta: x => {
    //La básica y clásica corta(x)
    return x > 0 ? 1 : 0;
  },
  /**
   * Si sabes derivar [x > 0 ? 1 : 0], DIMELO QUE SUFRO.
   */
  cortaDx: x => {
    return 0.5 * x; //Mientras tanto, este valor :/
  },

  /**
   * Mate2.normaliza() normaliza una tupla
   * @param datos  La tupla de racionales a normalizar
   * @param min    El valor mínimo (opcional)
   * @param max    El valor máximo (opcional)
   * @return       La tupla normalizada
   */
  normaliza: function (datos, min = null, max = null) {
    if (min === undefined) min = Math.min(...datos);
    if (max === undefined) max = Math.max(...datos);
    let rad = max - min;
    // Normalize to [0, 1]
    return [...datos].map(value => (value - min) / rad);
  },
  /**
   * Mate2.oneHot() hará una one-hot tupla (puros ceros y un uno)
   * @param indice    Donde estará el uno.
   * @param longitud  La longitud de la tupla.
   * @return          La one-hot tupla.
   */
  oneHot: function (indice, longitud) {
    let tupla = new Array(longitud).fill(0);
    // Trucaso
    tupla[indice] = 1;
    return tupla;
  },
  /**
   * Mate2.rellena() llenará todos los vacíos de una tupla
   * @param datos     La tupla a rellenar.
   * @param relleno   El valor para rellenar.
   * @param longitud  La longitud mínima como racional.
   * @return          La tupla rellenita.
   */
  rellena: function (datos, relleno, longitud) {
    const tupla = [...datos].map((v, i) =>
      datos.hasOwnProperty(i) ? v : v === null ? v : relleno
    ); //Si está vacío, rellena
    if (longitud !== undefined) {
      while (tupla.length < longitud)
        //Si está chiquito,
        tupla.push(relleno); //rellena.
    }
    return tupla;
  },
  /**
   * Mate2.repesar() llenará todos los vacíos de una tupla, pero al azar
   * @param datos     La tupla a rellenar.
   * @param longitud  La longitud mínima como racional.
   * @return          La tupla rellenita.
   * Nota que acá usamos Math.random() como relleno
   */
  repesar: function (datos, longitud) {
    //Lo mismo, pero con Math.random()
    const tupla = [...datos].map((v, i) =>
      data.hasOwnProperty(i) ? v : v === null ? v : Math.random()
    );
    if (longitud !== undefined) {
      while (tupla.length < longitud) tupla.push(Math.random());
    }
    return tupla;
  },
  /**
   * Mate2.dados() llenará una tupla de números al azar
   * @param longitud  La longitud mínima como racional.
   * @param clase     El tipo de valor.
   * (clase == true) --> entre -1 y 1
   * (clase == false) --> entre 0 y 1
   * @return          La tupla rellenita.
   * Nota que acá usamos Math.random() como relleno
   */
  dados: function (longitud, clase = true) {
    // Mirá esos dados
    let pesos = [];
    if (clase) {
      for (let i = 0; i < longitud; i++) {
        pesos.push(Math.random() * 2 - 1); // Entre -1 y 1
      }
    } else {
      for (let i = 0; i < longitud; i++) {
        pesos.push(Math.random()); // Entre 0 y 1
      }
    }
    return pesos;
  },
  /**
   * Mate2.tipode() obtendrá el tipo de un objeto en español
   * @param datos     La tupla a rellenar.
   * @param longitud  La longitud mínima como racional.
   * @return          La tupla rellenita.
   * Nota que acá usamos Math.random() como relleno
   */
  tipode: function (dato, palabra = typeof dato) {
    switch (palabra) {
      case 'string':
        return [true, 'cadena'];
      case 'number':
        return [false, 'racional'];
      case 'boolean':
        return [false, 'binario'];
      case 'object':
        return Array.isArray(dato)
          ? [true, 'tupla']
          : dato === null
          ? [false, 'nulo']
          : [false, 'objeto'];
      case 'bigint':
        return [false, 'entero'];
      case 'undefined':
        return [false, 'indefinido'];
      case 'function':
        return [true, 'función'];
      case 'symbol':
        return [false, 'símbolo'];
    }
  },
};
const inesperar = x => {
  return isFinite(x) && !isNaN(x) && x == undefined;
};
const siNoEsTupla_lánzate = (x, n) => {
  if (Array.isArray(x)) return;
  let tipo = Mate2.tipode(x);
  let a = tipo[0] ? 'a' : '';
  console.error(`Esperábamos una tupla (${n})`, x, tipo[1]);
  throw Error(
    `Un${tipo[0] ? 'a' : ''} ${tipo[1]} inesperad${tipo[0] ? 'a' : 'o'}`,
    { cause: `Esperábamos una tupla` }
  );
  throw Error(`Esperábamos una tupla`, {
    cause: `Recibimos un${tipo[0] ? 'a' : ''} ${tipo[1]}`,
  });
};

const Biblioteca = {
  /**
   * Ejemplitos :3
   */
  xor: [
    { entradas: [0, 0], salidas: [0] },
    { entradas: [0, 1], salidas: [1] },
    { entradas: [1, 0], salidas: [1] },
    { entradas: [1, 1], salidas: [0] },
  ],
  and: [
    { entradas: [0, 0], salidas: [0] },
    { entradas: [0, 1], salidas: [0] },
    { entradas: [1, 0], salidas: [0] },
    { entradas: [1, 1], salidas: [1] },
  ],
  or: [
    { entradas: [0, 0], salidas: [0] },
    { entradas: [0, 1], salidas: [1] },
    { entradas: [1, 0], salidas: [1] },
    { entradas: [1, 1], salidas: [1] },
  ],
  nand: [
    { entradas: [0, 0], salidas: [1] },
    { entradas: [0, 1], salidas: [1] },
    { entradas: [1, 0], salidas: [1] },
    { entradas: [1, 1], salidas: [0] },
  ],
  sum: [
    { entradas: [0, 0, 0], salidas: [0, 0] },
    { entradas: [0, 0, 1], salidas: [0, 1] },
    { entradas: [0, 1, 0], salidas: [0, 1] },
    { entradas: [1, 0, 0], salidas: [0, 1] },
    { entradas: [0, 1, 1], salidas: [1, 0] },
    { entradas: [1, 0, 1], salidas: [1, 0] },
    { entradas: [1, 1, 0], salidas: [1, 0] },
    { entradas: [1, 1, 1], salidas: [1, 1] },
  ],
};

/**
 * Cada nueva Neu es una neurona. Complejas a montón, compleja solita.
 * ¡Espera pesos y deltas re-locos!
 */
class Neu {
  umbral = Math.random() * 2 - 1; // Entre -1 y 1
  suma = 0;
  salida = 0;
  delta = 0;
  entradas = [];
  /**
   * El constructor de Neus hará una neuronita.
   * Los valores y funciónes se obtienen con el Mate2 de antes
   * Pero no podemos hacer neuronas de la nada, ¿o sí?
   * @param num_ent  El número de entradas que espera la neurona.
   * @param función  La cadena del nombre de la función que usará.
   * @param pesos    (defecto = []) La tupla de pesos.
   * @param umbral   (defecto = random) El número umbral.
   * @return         La neuronita lista para conectar
   */
  constructor(num_ent, función = 'sigm') {
    if (typeof num_ent != 'number') num_ent = Number(num_ent);
    if (num_ent < 0) throw `Constante inesperada`;
    this.pesos = Mate2.dados(num_ent);
    this.función = Mate2.funciones.includes(función) ? función : 'sigm';
  }

  /**
   * neuron.activar() activará la neurona, devolviendo su nuevo valor
   * @param entradas  La tupla de números como entrada
   * @return          El número de salida
   */
  activar(entradas) {
    siNoEsTupla_lánzate(entradas, 'Neu.activar');
    let pesos = this.pesos;
    this.entradas = entradas;
    // Primero, suma
    let suma = this.umbral;
    for (let i = 0; i < entradas.length; i++) {
      suma += entradas[i] * pesos[i];
    }
    this.suma = suma;
    if (inesperar(suma)) {
      console.error(`¡Algo fue terrible! Te paso los errores`);
      console.log(this.umbral, this.entradas, this.pesos);
      for (let i = 0; i < entradas.length; i++) {
        console.log(
          `${entradas[i]} * ${this.pesos[i]} = ${entradas[i] * pesos[i]}`
        );
      }
      throw Error(`NaN inesperado`, { cause: `Neu.activar, suma` });
    }
    // Luego la función
    this.salida = Mate2[this.función](suma);
    if (inesperar(this.salida))
      throw Error(`NaN inesperado`, { cause: `Neu.activar, función` });
    return this.salida;
  }

  /**
   * neuron.derivada devolverá la derivada de la función
   * Esto se usa para obtener el delta
   * @return  Un numerito para ti
   */
  get derivada() {
    return Mate2[this.función + 'Dx'](this.suma);
  }

  /**
   * neuron.aprender usará el delta para cambiar un poquito sus pesos
   * @param ritmo  El ritmo de aprndizaje
   * @param delta  El tmaaño del error
   */
  aprender(ritmo, delta = this.delta) {
    // Cambia los pesos
    for (let i = 0; i < this.pesos.length; i++) {
      this.pesos[i] += ritmo * delta * this.entradas[i];
    }
    // Cambia el umbral
    this.umbral += ritmo * this.delta;
  }
}

/**
 * Si una neurona no bastaba, pues imagina una columna entera de ellas.
 * Eso es una capa. Actúan como un conjunto, jugando con tuplas.
 */
class Capa {
  neuronas = [];
  salidas = [];
  /**
   * El constructor de Capas hará una capita.
   * Reglas similares:
   * @param tamaño   El número de tamaño de la capa
   * @param num_ent  El número de entradas que espera cada neurona.
   * @param función  La cadena del nombre de la función que usará.
   * @return         La capa lista para conectar
   */
  constructor(tamaño, num_ent, función = 'sigm') {
    for (let i = 0; i < tamaño; i++) {
      this.neuronas.push(new Neu(num_ent, función));
    }
    this.tamaño = tamaño;
  }

  /**
   * capa.activar() comienza el cálculo con las entradas
   * Reglas similares:
   * @param entradas  La tupla de números como entrada
   * @return          La tupla de números de salida
   */
  activar(entradas) {
    const salidas = [];
    for (const neurona of this.neuronas) {
      salidas.push(neurona.activar(entradas));
    }
    if (salidas.some(x => inesperar(x)))
      throw Error(`NaN inesperado`, { cause: `Capa.activar, función` });
    this.salidas = salidas;
    return salidas;
  }
  /**
   * capa.al_final() editará los deltas de las neuronas 'pa que aprendan.
   * @param esperado  La tupla de racionales esperados
   */
  al_final(esperado, a) {
    for (let i = 0; i < this.neuronas.length; i++) {
      //Chapa una neurona
      const neurona = this.neuronas[i];
      neurona.delta = (esperado[i] - neurona.salida) * neurona.derivada; //sácale su delta
    }
  }
  /**
   * capa.intermedia() editará los deltas de las neuronas 'pa que aprendan. Otra vez.
   * @param sigCapa  Literalmente la siguiente capa
   */
  intermedia(sigCapa, a) {
    for (let i in this.neuronas) {
      let error = 0;
      // Suma los errores anteriores
      for (let n of sigCapa.neuronas) {
        error += n.delta * n.pesos[i];
      }
      this.neuronas[i].delta = error * this.neuronas[i].derivada;
    }
  }
  /**
   * capa.aprender usará el delta para cambiar un poquito sus neuronas
   * Reglas similares:
   * @param ritmo  El ritmo de aprndizaje
   */
  aprender(ritmo) {
    for (let neurona of this.neuronas) {
      neurona.aprender(ritmo);
    }
  }
  /**
   * capa.getOutputs will return an array of the capa's salidas
   * capa.salida obtendrá las salidas de la capa
   * @return  La tupla llena de racionales
   */
  get salida() {
    return this.neuronas.map(neurona => neurona.output);
  }
}

/**
 * Al final, está el propio Freddy.
 * Freddy nace sin conocer el mundo, pues tu trabajo es enseñarle.
 */
class Freddy {
  historial = {
    épocas: [],
    errores: [],
  };
  salidas = [];
  ritmo = 0.1;
  /**
   * El constructor de Freddys hará un nuevo Freddy™ IA.
   * Reglas similares:
   * @param arquitectura  La tupla de tamaños de cada capa
   * @param funciones     La tupla de cadenas de las funciones que usará.
   * @param ritmo         El número que marca el ritmo de aprendizaje.
   * @return              El Freddy listo para usar
   */
  constructor(arquitectura, funciones, ritmo = 0.1) {
    this.ritmo = ritmo;
    this.armaRed(arquitectura, funciones);
  }

  /**
   * fred.armaRed() arma la red con la que trabajaremos.
   * @param arquitectura  La tupla de tamaños de cada capa
   * @param funciones     La tupla de cadenas de las funciones que usará.
   * Dato curioso: durante las pruebas de exportación, habían miles de errores.
   * Esta fue mi solución.
   */
  armaRed(arquitectura, funciones = null) {
    siNoEsTupla_lánzate(arquitectura, 'Freddy.armaRed');
    let longitud = arquitectura.length;
    if (longitud <= 1) {
      console.error('Capa inesperada (Freddy.armaRed)', arquitectura, longitud);
      throw Error(`Capa inesperada`, { cause: `Esperábamos más capas` });
    }
    funciones = Mate2.rellena(funciones, 'sigm', longitud); //mirá quien es!
    this.capas = [];
    for (let i = 1; i < longitud; i++)
      this.capas.push(
        new Capa(arquitectura[i], arquitectura[i - 1], funciones[i - 1])
      );
    this.arquitectura = arquitectura;
    this.funciones = funciones;
  }

  /**
   * fred.acctivar() starts the calculation with the entradas
   * Reglas similares:
   * @param entradas  La tupla de números como entrada
   * @return          La tupla de números de salida
   * Creo que cada una es solo la anterior, pero más grande
   */
  activar(entradas) {
    let salidas = entradas;
    // Hacia adelante
    for (let capa of this.capas) {
      salidas = capa.activar(salidas);
    }
    this.salidas = salidas;
    return salidas;
  }

  /**
   * fred.entrenar() starts the training process
   * @param ejemplos  Una tupla de objetos tipo {entradas: [tupla], salidas: [tupla]}
   * @param épocas    Cuántas veces deberá repasar
   * @param verboso   Ponlo en true si quieres escuchar todito
   * [ahí viene]
   */
  entrenar(ejemplos, épocas = 1000, verboso = false) {
    siNoEsTupla_lánzate(ejemplos, 'Freddy.entrenar');
    for (let e = 0; e < épocas; e++) {
      let error_total = 0;
      // Entrena por ccada ejemplo
      for (let { entradas, salidas } of ejemplos) {
        // Hacia adelante
        const predicción = this.activar(entradas);
        // Saca el error
        let error = 0;
        for (let i = 0; i < salidas.length; i++) {
          error += Math.pow(salidas[i] - predicción[i], 2);
        }
        error_total += error / 2;
        // Hacia atrás
        this.aprender(salidas);
      }
      // Si x00 o a punto de finalizar, regístralo
      if (e % 100 === 0 || e === épocas) {
        this.historial.épocas.push(e);
        this.historial.errores.push(error_total / ejemplos.length);
        if (verboso)
          console.log(
            `Época ${e}: Error Promedio = ${error_total / ejemplos.length}`
          );
      }
    } //y otra vez
  }

  /**
   * fred.aprender() es el verdadero entrenador
   * @param salidas  Las salidas esperadas
   * [AL FIN lo divertido]
   */
  aprender(salidas) {
    // Suma los deltas
    this.capas[this.capas.length - 1].al_final(salidas);
    // Suma más deltas
    for (let i = this.capas.length - 2; i >= 0; i--) {
      this.capas[i].intermedia(this.capas[i + 1]);
    }
    let r = this.ritmo;
    // ¡Y a aprender!
    for (let capa of this.capas) {
      capa.aprender(r);
    }
  }

  /**
   * fred.exactitudAprox() aproxima la exactitud del Freddy
   * @param ejemplos  Una tupla de objetos tipo {entradas: [tupla], salidas: [tupla]}
   * @return          Un racional indicando la exactitud
   * Si quieres que sólo una neurona brille, esta es la opción correcta
   */
  exactitudAprox(ejemplos, verboso = false) {
    let aciertos = 0;
    for (let { entradas, salidas } of ejemplos) {
      const predicción = this.activar(entradas);
      const predecido = predicción.indexOf(Math.max(...predicción)); //La predicción más alta?
      const esperado = salidas.indexOf(Math.max(...salidas)); //La salida más alta?
      if (predecido == esperado) aciertos++; //Si coincides, pues 'ta bien
      if (verboso)
        console.log(`Calculando exactitud:`, salidas, predicción, aciertos);
    }
    return aciertos / ejemplos.length;
  }

  /**
   * fred.exportaPesos() exporta los pesos
   * @return  Una tupla de tuplas de pesos y umbrales
   */
  exportaPesos() {
    const pesos = [];
    for (let capa of this.capas) {
      const capaWeights = [];
      for (let neurona of capa.neuronas) {
        capaWeights.push({
          pesos: [...neurona.pesos],
          umbral: neurona.umbral,
        }); //Empaca los pesos
      }
      pesos.push(capaWeights); //Y cierra la caja
    }
    return pesos;
  }

  /**
   * fred.importaPesos() importa los pesos
   * @param pesos  Una tupla de tuplas de pesos y umbrales
   * [sí, por eso exportaPesos() está aquí]
   */
  importaPesos(pesos) {
    for (let i = 0; i < pesos.length; i++) {
      const capaWeights = pesos[i]; //Abre la caja
      for (let j = 0; j < capaWeights.length; j++) {
        this.capas[i].neuronas[j].pesos = [...capaWeights[j].pesos];
        this.capas[i].neuronas[j].umbral = capaWeights[j].umbral;
      } //Y desempaca los pesos
    }
  }

  /**
   * fred.aJSON() exporta el Freddy™
   * @return  Una SUPER OBJETO DUPER RARA ENTREGA. ™.
   * Su paquete SOBRE™ incluye:
   * - La arquitectura del Freddy™.
   * - El .ritmo de aprendizaje del Freddy™
   * - Una tupla de .pesos
   * - Su .historial
   * - Cada nombre de las .funciones para usar
   * Modo de uso:
   * - Abre el objeto y chequea sus propiedades.
   * - En otro Freddy, use el método .deJSON para subir los datos.
   * Peligro: Hay chance que no se vinculen, entrenar a uno tal vez no entrene al otro.
   */
  aJSON() {
    return {
      arquitectura: this.arquitectura,
      ritmo: this.ritmo,
      pesos: this.exportaPesos(),
      historal: this.historial,
      funciones: this.funciones,
    }; //Claro que queremos exportarlo
  }

  /**
   * fred.deJSON() importa el Freddy™
   * @param config  El SOBRE™ del método .aJSON()
   */
  deJSON(config) {
    this.ritmo = config.ritmo;
    this.historial = config.historial;
    this.buildNet(config.arquitectura, config.funciones);
    this.importaPesos(config.pesos);
  } //Y también importarlo
}

/**
 * Esta fue la familia Freddy™: Mate2, Neu, Capa y Freddy.
 * Sólo hay una cosa por hacer: criar a un Freddy.
 */
export {
  Mate2,
  Biblioteca,
  Neu,
  Capa,
  Freddy,
}

