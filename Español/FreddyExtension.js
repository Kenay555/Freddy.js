(function (Scratch) {

  if (!Scratch.extensions.unsandboxed) throw new Error("Freddy! must run UNSANDBOXED");

  /**                        Este es el núcleo de Freddy. Hecho por mí! Versión 1.0.1 en 19/6/25            **/
  /**                        This is Freddy's core. Made by me! Version 1.0.1 on 19/6/25            **/

  /** 
   * @todo Actualizar el código
   */
class FredBox {
    static sigmoid(x) { return 1 / (1 + Math.exp(-x)) }
    static sigmoidDx(x) { return x * (1 - x) }
    static tanh(x) { return Math.tanh(x) }
    static tanhDx(x) { return 1 - x * x; }
    static relu(x) { return Math.max(0, x) }
    static reluDx(x) { return x > 0 ? 1 : 0 }
    static linear(x) { return x }
    static linearDx(x) { return 1 }
    static cut2fit(x) { return x > 0 ? 1 : 0;
    }
  /*
   * If you know the derivative of [x > 0 ? 1 : 0], PLEASE tell me.
   */
    static cut2fitDx(x) { return 0.5 } //placeholder
    static xor() {
        return [
            { inputs: [0, 0], outputs: [0] },
            { inputs: [0, 1], outputs: [1] },
            { inputs: [1, 0], outputs: [1] },
            { inputs: [1, 1], outputs: [0] }
        ];
    }
    static and() {
        return [
            { inputs: [0, 0], outputs: [0] },
            { inputs: [0, 1], outputs: [0] },
            { inputs: [1, 0], outputs: [0] },
            { inputs: [1, 1], outputs: [1] }
        ];
    }
    static or() {
        return [
            { inputs: [0, 0], outputs: [0] },
            { inputs: [0, 1], outputs: [1] },
            { inputs: [1, 0], outputs: [1] },
            { inputs: [1, 1], outputs: [1] }
        ];
    }
    static nand() {
        return [
            { inputs: [0, 0], outputs: [1] },
            { inputs: [0, 1], outputs: [1] },
            { inputs: [1, 0], outputs: [1] },
            { inputs: [1, 1], outputs: [0] }
        ];
    }
    static sum() {
        return [
            { inputs: [0, 0, 0], outputs: [0, 0] },
            { inputs: [0, 0, 1], outputs: [0, 1] },
            { inputs: [0, 1, 0], outputs: [0, 1] },
            { inputs: [1, 0, 0], outputs: [0, 1] },
            { inputs: [0, 1, 1], outputs: [1, 0] },
            { inputs: [1, 0, 1], outputs: [1, 0] },
            { inputs: [1, 1, 0], outputs: [1, 0] },
            { inputs: [1, 1, 1], outputs: [1, 1] }
        ];
    }
    static normalize(data, min = null, max = null) {
        if (min === null) min = Math.min(...data);
        if (max === null) max = Math.max(...data);
        return data.map(value => (value - min) / (max - min)); // Normalize to [0, 1]
    }
    static oneHot(index, numClass) {
        const encoded = new Array(numClass).fill(0);
        encoded[index] = 1; // And here's the hot one
        return encoded;
    }
    static refill(data, length, filling) { 
        const filled = [...data].map((v, i) => ((data.hasOwnProperty(i) && (v != '')) ? v : filling)); //If empty, fill.
        while (filled.length < length) //If shorter,
            filled.push(filling); //fill.
        return filled;
    }
}
class Neu {
    static randomWs(length) {
        let ws = [];
        for (let i = 0; i < length; i++) { // Guess random weights now
            ws.push(Math.random() * 2 - 1); // Between -1 and 1
        }
        return ws;
    }
    constructor(numInputs, neuFunction = 'sigmoid', weights = 'none', bias) {
        this.weights = Array.isArray(weights) ? weights : Neu.randomWs(numInputs);
        this.bias = bias === undefined ? (Math.random() * 2 - 1) : bias; // Random between -1 and 1
        this.neuFunction = neuFunction;
        this.output = 0;
        this.delta = 0;
        this.inputs = [];
    }
    activate(inputs) {
        this.inputs = inputs;
        let sum = this.bias; // First, the sum
        for (let i = 0; i < inputs.length; i++) {
          sum += inputs[i] * (this.weights[i] || 0);
        }
        if (isNaN(sum)) {
          console.error(`Seems something's wrong!`);
          console.log(this);
          for (let i = 0; i < inputs.length; i++) {
            console.log(`${inputs[i]} * ${this.weights[i]} = ${inputs[i] * this.weights[i]}`);
          }
        }
        this.output = FredBox[this.neuFunction](sum); // Then, the function
        if (isNaN(this.output)) throw 'NaN not expected';
        return this.output;
    }
    derivateOutput() {
        return FredBox[this.neuFunction + 'Dx'](this.output);
    }
    updateWeights(learningRate) { // Update weights based on calculated delta
        for (let i = 0; i < this.weights.length; i++) {
            this.weights[i] += learningRate * this.delta * this.inputs[i];
        }
        this.bias += learningRate * this.delta; // Update bias
    }
}
Neu.Nandy = new Neu(2, 'cut2fit', [-2, -2], 3);
class Layer {
    constructor(number, numInputs, neuFunction = 'sigmoid') {
        this.neurons = [];
        this.numNeurons = number;
        for (let i = 0; i < number; i++) {
            this.neurons.push(new Neu(numInputs, neuFunction));
        }
    }
    activate(inputs) {
        const outputs = [];
        for (let neuron of this.neurons) {
            outputs.push(neuron.activate(inputs));
        }
        return outputs;
    }
    findOutLayerDs(expectedOutputs) { //The deltas of the output
        for (let i = 0; i < this.neurons.length; i++) {
            const neuron = this.neurons[i]; //Get a neuron
            const error = expectedOutputs[i] - neuron.output; //Get the error
            neuron.delta = error * neuron.derivateOutput(); //Calc the delta
        }
    }
    findHidLayerDs(nextLayer) { //The deltas of the middle
        for (let i = 0; i < this.neurons.length; i++) {
            let error = 0; // Sum up errors from next layer
            for (let j = 0; j < nextLayer.neurons.length; j++) {
                error += nextLayer.neurons[j].delta * nextLayer.neurons[j].weights[i];
            }
            this.neurons[i].delta = error * this.neurons[i].derivateOutput();
        }
    }
    updateWeights(learningRate) {
        for (let neuron of this.neurons) {
            neuron.updateWeights(learningRate);
        }
    }
    getOutputs() {
        return this.neurons.map(neuron => neuron.output);
    }
}
class Freddy {
    constructor(architecture, layerFunction = [], learningRate = 0.1) {
        this.learningRate = learningRate;
        this.trainingHistory = {
            epochs: [],
            errors: []
        };
        this.output = [];
        this.buildNet(architecture, layerFunction);
    }
    predict(inputs) {
        let outputs = inputs;
        for (let layer of this.layers) {
            outputs = layer.activate(outputs);
        } // Forward propagation I guess
        this.output = outputs;
        return outputs;
    }
    train(trainingData, epochs = 1000, verbose = false, superverboise = false) {
        for (let epoch = 0; epoch < epochs; epoch++) {
            let totalError = 0; //My mistake
            for (let example of trainingData) { // Now, train on all examples
                const inputs = example.inputs;
                const expectedOutputs = example.outputs;
                
                const actualOutputs = this.predict(inputs); // Forward propagation again
                // Calculate error for this specific example
                let exampleError = 0;
                for (let i = 0; i < expectedOutputs.length; i++) {
                    exampleError += Math.pow(expectedOutputs[i] - actualOutputs[i], 2);
                }
                totalError += exampleError / 2;
                this.backpropagate(expectedOutputs); // Backward propagation again
            }
            if (epoch % 100 === 0 || epoch === epochs - 1) { // Record its training if x00 or about to end
                this.trainingHistory.epochs.push(epoch);
                this.trainingHistory.errors.push(totalError / trainingData.length);
                if (verbose) {
                    console.log(`Epoch ${epoch}: Average Error = ${totalError / trainingData.length}`);
                }
            } else {
                if (superverboise) console.log(`Epoch ${epoch}: Average Error = ${totalError / trainingData.length}`);
            }
        } //and try again
    }
    backpropagate(expectedOutputs) {
        const outputLayer = this.layers[this.layers.length - 1];
        outputLayer.findOutLayerDs(expectedOutputs); // Calculate silly deltas
        for (let i = this.layers.length - 2; i >= 0; i--) {
            this.layers[i].findHidLayerDs(this.layers[i + 1]); // Calculate more silly deltas
        }
        for (let layer of this.layers) {
            layer.updateWeights(this.learningRate); // Now, learn!
        }
    }
    aproxAccuracy(testData) {
        let correct = 0;
        for (let example of testData) {
            const prediction = this.predict(example.inputs);
            const predictedClass = prediction.indexOf(Math.max(...prediction)); //Where's the highest output?
            const actualClass = example.outputs.indexOf(Math.max(...example.outputs)); //Where's the highest expected?
            if (predictedClass === actualClass) {
                correct++; //Whenever they match, ok i guess
            }
        }
        return correct / testData.length;
    }
    buildNet(architecture, layerFunction) {
        this.architecture = architecture
        let totalLength = architecture.length
        layerFunction = FredBox.refill(layerFunction, totalLength, 'sigmoid'); //look! its FredBox.refill()!
        this.layers = []
        for (let i = 1; i < totalLength; i++) {
            const numInputs = architecture[i - 1];
            const numNeurons = architecture[i];
            const neuFunction = layerFunction[i - 1] || 'sigmoid';
            this.layers.push(new Layer(numNeurons, numInputs, neuFunction));
        }
        this.functions = layerFunction
    }
    exportWeights() {
        const weights = [];
        for (let layer of this.layers) {
            const layerWeights = [];
            for (let neuron of layer.neurons) {
                layerWeights.push({
                    weights: [...neuron.weights],
                    bias: neuron.bias
                }); //Pack all weights
            }
            weights.push(layerWeights); //And close the box
        }
        return weights;
    }
    importWeights(weights) {
        for (let i = 0; i < weights.length; i++) {
            const layerWeights = weights[i]; //Open the box
            for (let j = 0; j < layerWeights.length; j++) {
                this.layers[i].neurons[j].weights = [...layerWeights[j].weights];
                this.layers[i].neurons[j].bias = layerWeights[j].bias;
            } //And unpack all weights
        }
    }
    toJSON() {
        return {
            architecture: this.architecture,
            learningRate: this.learningRate,
            weights: this.exportWeights(),
            trainingHistory: this.trainingHistory,
            functions: this.functions
        }; //Of course we wanna export it
    }
    fromJSON(config) {
        this.learningRate = config.learningRate;
        this.trainingHistory = config.trainingHistory;
        this.buildNet(config.architecture, config.functions);
        this.importWeights(config.weights);
    } //And load it
}









                        /**                       PLEASE BE CAREFUL                         */
                        /**                     ACTUAL EXTENSION AHEAD                      */
                        /**                        PLEASE BE CAREFUL                        */

  const Cast = Scratch.Cast;
  const emptybook = [{inputs: [], outputs: []}];
  const BookStringify = (book) => {
    let exp = []
    for (const page of book) {
      exp.push(`{inputs: [${page.inputs}], outputs: [${page.outputs}]}`)
    }
    return `[${exp}]`
  }
  const fbx_contents = ['xor', 'and', 'or', 'nand']
  function array (a, b = false)  {
    switch (typeof a) { 
      case 'string': 
        a = a.trim();
        if (a.startsWith('[') && a.endsWith(']')) {
          a = eval(a)
        } else if (a == 'null') {
          return b ? [] : null
        } else {
          throw "wha- that's not array-like enough!"
        } break;
      case 'bigint': case 'boolean': a = Number(a);
      case 'number': a = [a]; break;
      case 'object': if (!Array.isArray(a)) throw 'my man that object is NOT an array'; break;
    }
    return a;
  }
  class FreddyExtension {
    constructor() { 
      this.freds = {Nexus: new Freddy([2, 3, 1], [], 2)}
      this.library = {xor: FredBox.xor(), and: FredBox.and(), or: FredBox.or(), nand: FredBox.nand(), sum: FredBox.sum()}
      this.blank = '(ninguno)'
      this.fredmenu = ['Nexus']
      this.bookmenu = ['xor', 'and', 'or', 'nand', 'sum']
    }
    getInfo() {
      return {
        id: "FreddyExtension",
        name: "Freddy",
        color1: "#a08050",
        blocks: [
          {
            blockType: Scratch.BlockType.LABEL,
            text: 'Freddy!',
          },
          {
            opcode: "FreddyConstruct",
            blockType: Scratch.BlockType.COMMAND,
            text: "defina freddy [NAM] con arq [ARQ], capas [LYR], y ritmo [LRT]",
            arguments: {
              NAM: { type: Scratch.ArgumentType.STRING, defaultValue: 'Nexus' },
              ARQ: { type: Scratch.ArgumentType.STRING, defaultValue: '[2, 3, 1]' },
              LYR: { type: Scratch.ArgumentType.STRING, defaultValue: 'null' },
              LRT: { type: Scratch.ArgumentType.NUMBER, defaultValue: 3 },
            },
          },
          {
            opcode: "FreddyExistAlready",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "¿existe un freddy llamado [NAM]?",
            arguments: {
              NAM: { type: Scratch.ArgumentType.STRING, defaultValue: 'Nexus' },
            },
          },
          {
            opcode: "FreddyErase",
            blockType: Scratch.BlockType.COMMAND,
            text: "Elimina a freddy [NAM]",
            arguments: {
              NAM: { type: Scratch.ArgumentType.STRING, menu: "fredmenu" },
            },
          },
          {
            opcode: "FreddyClear",
            blockType: Scratch.BlockType.COMMAND,
            text: "Borra todos los Freddys",
          },
          '---',
          {
            blockType: Scratch.BlockType.LABEL,
            text: 'Entradas y Salidas',
          },
          {
            opcode: "FreddyPredict",
            blockType: Scratch.BlockType.COMMAND,
            text: "Que freddy [NAM] prediga respecto a [ARR]",
            arguments: {
              NAM: { type: Scratch.ArgumentType.STRING, menu: "fredmenu" },
              ARR: { type: Scratch.ArgumentType.STRING, defaultValue: '[2, 3, 1]' },
            },
          },
          {
            opcode: "FreddyOutput",
            blockType: Scratch.BlockType.REPORTER,
            text: "salida de [NAM]",
            arguments: {
              NAM: { type: Scratch.ArgumentType.STRING, menu: "fredmenu" },
            },
          },
          {
            opcode: "FreddyBackpropagate",
            blockType: Scratch.BlockType.COMMAND,
            text: "Corrige a [NAM] respecto a [ARR]",
            arguments: {
              NAM: { type: Scratch.ArgumentType.STRING, menu: "fredmenu" },
              ARR: { type: Scratch.ArgumentType.STRING, defaultValue: '[2, 3, 1]' },
            },
          },
          {
            opcode: "FreddyTrain",
            blockType: Scratch.BlockType.COMMAND,
            text: "Entrena a [NAM] respecto a [ARR], [EPCH] veces",
            arguments: {
              NAM: { type: Scratch.ArgumentType.STRING, menu: "fredmenu" },
              ARR: { type: Scratch.ArgumentType.STRING, defaultValue: '[{inputs: [0, 1], outputs: [2, 3]}]' },
              EPCH: { type: Scratch.ArgumentType.NUMBER, defaultValue: 2500 },
            },
          },
          {
            opcode: "FreddyBook",
            blockType: Scratch.BlockType.COMMAND,
            text: "Entrena a [NAM] con el libro [ARR], [EPCH] veces",
            arguments: {
              NAM: { type: Scratch.ArgumentType.STRING, menu: "fredmenu" },
              ARR: { type: Scratch.ArgumentType.STRING, menu: "bookmenu" },
              EPCH: { type: Scratch.ArgumentType.NUMBER, defaultValue: 2500 },
            },
          },
          '---',
          {
            blockType: Scratch.BlockType.LABEL,
            text: 'Libros',
          },
          {
            opcode: "BookNew",
            blockType: Scratch.BlockType.COMMAND,
            text: "Que [NAM] sea un libro en blanco",
            arguments: {
              NAM: { type: Scratch.ArgumentType.STRING, defaultValue: 'new' },
            },
          },
          {
            opcode: "BookAdd",
            blockType: Scratch.BlockType.COMMAND,
            text: "Añade [INS] => [OUT] al libro [NAM]",
            arguments: {
              INS: { type: Scratch.ArgumentType.STRING, defaultValue: '[2, 0]' },
              OUT: { type: Scratch.ArgumentType.STRING, defaultValue: '[1, 3]' },
              NAM: { type: Scratch.ArgumentType.STRING, menu: "bookmenu" },
            },
          },
          {
            opcode: "BookExistAlready",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "¿existe el libro llamado [NAM]?",
            arguments: {
              NAM: { type: Scratch.ArgumentType.STRING, defaultValue: 'new' },
            },
          },
          {
            opcode: "BookGet",
            blockType: Scratch.BlockType.REPORTER,
            text: "contenidos de [NAM]",
            arguments: {
              NAM: { type: Scratch.ArgumentType.STRING, menu: "bookmenu" },
            },
          },
          {
            opcode: "BookClear",
            blockType: Scratch.BlockType.COMMAND,
            text: "Borra todos los libros",
          },
          '---',
          {
            blockType: Scratch.BlockType.LABEL,
            text: 'Otras herramientas',
          },
          {
            opcode: "printfreds",
            blockType: Scratch.BlockType.COMMAND,
            text: "log(this)",
          },
          {
            opcode: "is_ext_loaded",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "fue [ARRAY] cargado?",
            arguments: {
              ARRAY: { type: Scratch.ArgumentType.STRING, defaultValue: 'pen' },
            },
          },
          {
            opcode: "FreddyExport",
            blockType: Scratch.BlockType.REPORTER,
            text: "exporta [NAM]",
            arguments: {
              NAM: { type: Scratch.ArgumentType.STRING, menu: "fredmenu" },
            },
          },
          {
            opcode: "FreddyImport",
            blockType: Scratch.BlockType.COMMAND,
            text: "importe [NAM] según [ARR]",
            arguments: {
              NAM: { type: Scratch.ArgumentType.STRING, menu: "fredmenu" },
              ARR: { type: Scratch.ArgumentType.STRING, defaultValue: '' },
            },
          },
          {
            opcode: "BookImport",
            blockType: Scratch.BlockType.COMMAND,
            text: "Que [NAM] sea el libro que contenga [ARR]",
            arguments: {
              NAM: { type: Scratch.ArgumentType.STRING, defaultValue: 'new' },
              ARR: { type: Scratch.ArgumentType.STRING, defaultValue: '' },
            },
          },
          '---',
          {
            opcode: "onehotarray",
            blockType: Scratch.BlockType.REPORTER,
            text: "one hot [INDEX] de [LENGTH]",
            arguments: {
              INDEX: { type: Scratch.ArgumentType.NUMBER, defaultValue: 4 },
              LENGTH: { type: Scratch.ArgumentType.NUMBER, defaultValue: 6 },
            },
          },
          {
            opcode: "normalizearray",
            blockType: Scratch.BlockType.REPORTER,
            text: "normaliza [ARRAY]",
            arguments: {
              ARRAY: { type: Scratch.ArgumentType.STRING, defaultValue: '[3,4,6]' },
            },
          },
          {
            opcode: "refillarray",
            blockType: Scratch.BlockType.REPORTER,
            text: "rellena [ARRAY] a longitud [LNG] y con relleno [FILL]",
            arguments: {
              ARRAY: { type: Scratch.ArgumentType.STRING, defaultValue: '["sigmoid", "sigmoid", "", "sigmoid"]' },
              LNG: { type: Scratch.ArgumentType.NUMBER, defaultValue: 7 },
              FILL: { type: Scratch.ArgumentType.STRING, defaultValue: 'tanh' },
            },
          },
          {
            opcode: "getFuncBooks",
            blockType: Scratch.BlockType.REPORTER,
            text: "obtén FredBox [NAM]",
            arguments: {
              NAM: { type: Scratch.ArgumentType.STRING, menu: "fredbox" },
            },
          },
        ],
        menus: {
          fredmenu: {
            acceptReporters: true,
            items: () => {
              return this.fredmenu.length > 0
                ? this.fredmenu.map(name => [name, name])
                : [['(no disponible)', this.blank]];
            }
          },
          bookmenu: {
            acceptReporters: true,
            items: () => {
              return this.bookmenu.length > 0
                ? this.bookmenu.map(name => [name, name])
                : [['(no disponible)', this.blank]];;
            }
          },
          booleans: {
            acceptReporters: true,
            items: ['sí', 'no']
          },
          fredbox: {
            acceptReporters: true,
            items: fbx_contents,
          },
        },
      };
    }

    //Funciones de apoyo

    ifEmptyNone (a, e) {
      a = array(a);
      e = a.length > 0
        ? a.map(x => [x, x])
        : [[e, this.blank]];
      return () => {return e}
    }
    printfreds() { //vm.extensionManager.refreshBlocks()
      console.log(this)
    }

    //Funciones usadas
    onehotarray({ INDEX, LENGTH }) {
      let str = "[";
      for (let i = 0; i < LENGTH; i++) {
        str += (i == INDEX) ? '1' : 0;
        if (i != LENGTH - 1) str += ', ';
      }
      str += "]";
      return str;
    }
    normalizearray({ ARRAY }) {
      return JSON.stringify(FredBox.normalize(array(ARRAY)))
    }
    refillarray({ ARRAY, LNG, FILL }) {
      return JSON.stringify(FredBox.refill(array(ARRAY), LNG, FILL))
    }
    is_ext_loaded({ ARRAY }) {
      return Scratch.vm.extensionManager.isExtensionLoaded(Cast.toString(ARRAY));
    }
    getFuncBooks({ NAM }) {
      if (fbx_contents.includes(NAM)) {
        return BookStringify(FredBox[NAM])
      }
    }

    //Freddy
    FreddyConstruct({ NAM, ARQ, LYR, LRT }) {
      NAM = Cast.toString(NAM);
      this.freds[NAM] = new Freddy(array(ARQ, true), array(LYR, true), Number(LRT));
      if (!this.fredmenu.includes(NAM)) {
        this.fredmenu.push(NAM); 
        vm.extensionManager.refreshBlocks();
      }
    }
    FreddyExistAlready({ NAM }) {
      return (NAM != this.blank) && (this.freds?.[NAM] != undefined)
    }
    FreddyErase({ NAM }) {
      if (this.FreddyExistAlready({ NAM })) {
        this.freds[NAM] = undefined;
        this.fredmenu = this.fredmenu.filter(item => item !== NAM);
        vm.extensionManager.refreshBlocks();
      }
    }
    FreddyClear() {
      this.freds = Object(null);
      this.fredmenu = Array(0);
      vm.extensionManager.refreshBlocks();
    }

    FreddyPredict({ NAM, ARR }) {
      if (this.FreddyExistAlready({ NAM })) 
      this.freds[NAM].predict(array(ARR, true));
    }
    FreddyOutput({ NAM }) {
      console.log(1, this.freds)
      console.log(2, this.freds[NAM])
      console.log(3, this.freds[NAM]?.output)
      return `[${this.freds?.[NAM]?.output}]`
    }
    FreddyBackpropagate({ NAM, ARR }) {
      if (this.FreddyExistAlready({ NAM })) 
      this.freds[NAM].backpropagate(array(ARR, true));
    }
    FreddyTrain({ NAM, ARR, EPCH }) {
      if (this.FreddyExistAlready({ NAM })) 
      this.freds[NAM].train(array(ARR), ECPH);
    }
    FreddyBook({ NAM, ARR, EPCH }) {
      if (this.FreddyExistAlready({ NAM })) 
      this.freds[NAM].train(this.library[ARR], EPCH);
    }

    FreddyExport({ NAM }) {
      if (this.FreddyExistAlready({ NAM })) 
      return JSON.stringify(this.freds[NAM].toJSON())
    }
    FreddyImport({ NAM, ARR }) {
      if (this.FreddyExistAlready({ NAM })) 
      this.freds[NAM].fromJSON(eval(ARR))
    }




    //Libros
    BookNew({ NAM }) {
      NAM = Cast.toString(NAM);
      this.library[NAM] = Array(0);
      if (!this.bookmenu.includes(NAM)) {
        this.bookmenu.push(NAM); 
        vm.extensionManager.refreshBlocks();
      }
    }
    BookAdd({ NAM, INS, OUT }) {
      const book = this.library[NAM]; const a = array(INS)
      const newpage = {inputs: a, outputs: array(OUT)}
      let found = false; let index = 0
      for (const page of book) {
        if (found) {continue;}
        const b = page.inputs;
        if (a.length !== b.length) {index++; continue;}
        if (a.every((val, i) => val === b[i])) {found = true;}
        else {index++;}
      }
      if (found) this.library[NAM][index] = newpage;
      else this.library[NAM].push(newpage);
    }
    BookErase({ NAM }) {
      if (this.BookExistAlready({ NAM })) {
        this.library[NAM] = undefined;
        this.bookmenu = this.bookmenu.filter(item => item !== NAM);
        vm.extensionManager.refreshBlocks();
      }
    }
    BookExistAlready({ NAM }) {
      return (NAM != this.blank) && (this.library?.[NAM] != undefined)
    }
    BookGet({ NAM }) {
      const book = this.BookExistAlready({ NAM }) ? this.library[NAM] : emptybook;
      return BookStringify(book);
    }
    BookClear() {
      this.library = Object(null)
      this.bookmenu = Array(0);
      vm.extensionManager.refreshBlocks();
    }
    BookImport({ NAM, ARR }) {
      this.library[NAM] = array(ARR);
      if (!this.bookmenu.includes(NAM)) {
        this.bookmenu.push(NAM); 
        vm.extensionManager.refreshBlocks();
      }
    }
  }

  Scratch.extensions.register(new FreddyExtension());
})(Scratch);
