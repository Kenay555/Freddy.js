/**
 * Freddy™ is a cool, silly and basic AI that can backpropagate and learn number operations.
 * June 17th 2025 is when Freddy.js v1.0 was finished.
 * Today, July 13th 2025, is when Freddy.js v1.1 was ready.
 * Me [Kenay, creator of this] will guide you neuron by neuron, layer by layer, and Freddy by Freddy. ™.
 */

/**
 * Freddy's FredBox is like Freddy's forearm, you won't notice it's there until you lose it.
 * We access this tooolbox very frequently, and you can too!
 */
class FredBox {
  /** 
   * Functions: 'sigmoid', 'tanh', 'relu', 'linear', 'cut2fit' (don't use the last two)
   *
   * The folowing derivatives asumme you first used the og function.
   * So, use sigmoidDx(sigmoid(x)) and tanhDx(tanh(x)) to get the true values.
   *
   * NEVER FORGET: If you wanna add a function 'xyz(a)', don't forget 'xyzDx(a)' for everything to work.
   */
    static sigmoid(x) {
        return 1 / (1 + Math.exp(-x));
    }
    static sigmoidDx(x) {
        return x * (1 - x);
    }
    static tanh(x) {
        return Math.tanh(x);
    }
    static tanhDx(x) {
        return 1 - x * x;
    }
    static relu(x) {
        return Math.max(0, x);
    }
    static reluDx(x) {
        return x > 0 ? 1 : 0;
    }
    static linear(x) {
        return x;
    }
    static linearDx(x) {
        return 1;
    }
    static cut2fit(x) {
        return x > 0 ? 1 : 0;
    }
  /**
   * If you know the derivative of [x > 0 ? 1 : 0], PLEASE tell me.
   */
    static cut2fitDx(x) {
        return 0.5; //placeholder
    }

  /** 
   * Some examples for the tutorials
   * Nice, isn't it?
   */
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

  /** 
   * FredBox.normalize() will normalize an array
   * @param data  The array to normalize
   * @param min   The minimum value (optional)
   * @param max   The maximum value (optional)
   * @return      The normalized array
   */
    static normalize(data, min = null, max = null) {
        if (min === null) min = Math.min(...data);
        if (max === null) max = Math.max(...data);
        // Normalize to [0, 1]
        return data.map(value => (value - min) / (max - min));
    }
  /** 
   * FredBox.oneHot() will make a one-hot array
   * @param index     Where the hot one is.
   * @param numClass  The length of the array.
   * @return          The one-hot array.
   */
    static oneHot(index, numClass) {
        const encoded = new Array(numClass).fill(0);
        // And here's the hot one
        encoded[index] = 1;
        return encoded;
    }
  /** 
   * FredBox.refill() will complete any empty slots in the given array
   * @param data     The array to refill.
   * @param length   The minimum length.
   * @param filling  The value to fill with.
   * @return         The refilled array.
   */
    static refill(data, length, filling) { 
        const filled = [...data].map((v, i) => (data.hasOwnProperty(i) ? v : (v === null) ? v : filling)); //If empty, fill.
        while (filled.length < length) //If shorter,
            filled.push(filling); //fill.
        return filled;
    }
}

/**
 * Every new Neu is a Freddy neuron. Complex on a group, complex alone.
 * Random weights and delta thingies await!
 */
class Neu {
  static randomWs(length) {
    let ws = [];
    // Guess random weights now
    for (let i = 0; i < length; i++) {
      ws.push(Math.random() * 2 - 1); // Between -1 and 1
    }
    return ws;
  }
  /**
   * The Neu constructor will make a new neuron with random values.
   * The neuFunction is taken from the FredBox library we just passed over.
   * But we can't make neurons out of thin air, can we?
   * @param numInputs    The number of inputs the neuron is expecting.
   * @param neuFunction  The name of the function it'll use.
   * @return             The neuron ready to go.
   */
    constructor(numInputs, neuFunction = 'sigmoid', weights = [], bias) {
        this.weights = typeof weights === 'object' ? weights : Neu.randomWs(numInputs);
        this.bias = bias === undefined ? (Math.random() * 2 - 1) : bias; // Random between -1 and 1
        this.neuFunction = neuFunction;
        this.output = 0;
        this.delta = 0;
        this.inputs = [];
    }

  /**
   * neuron.activate will calculate the neuron's value using the inputs
   * @param inputs  The array of inputs to use
   * @return        The new number output
   */
    activate(inputs) {
        this.inputs = inputs;
        // First, the sum
        let sum = this.bias;
        for (let i = 0; i < inputs.length; i++) {
            sum += inputs[i] * this.weights[i];
        }
        if (isNaN(sum)) {
          console.error(`Seems something's wrong!`) 
          console.log(this.bias, this.inputs, this.weights) 
          for (let i = 0; i < inputs.length; i++) {
            console.log(inputs[i] * this.weights[i])
          }
        }
        // Then, the function
        this.output = FredBox[this.neuFunction](sum);
        if (isNaN(this.output)) throw 'NaN not expected'
        return this.output;
    }

  /**
   * neuron.derivateOutput will find the derivative of the neuron's function
   * This is used for finding the neuron's delta
   * @return  The number to enjoy
   */
    derivateOutput() {
        return FredBox[this.neuFunction + 'Dx'](this.output);
    }

  /**
   * neuron.updateWeights will use this.delta to change the neuron's information
   * @param learningRate  The size of the change
   */
    updateWeights(learningRate) {
        // Update weights based on calculated delta
        for (let i = 0; i < this.weights.length; i++) {
            this.weights[i] += learningRate * this.delta * this.inputs[i];
        }
        // Update bias
        this.bias += learningRate * this.delta;
    }
}

Neu.Nandy = new Neu(2, 'cut2fit', [-2, -2], 3);

/**
 * Now, if we lay many neurons, we'll get a layer
 * They act as a group, recieving and throwing arrays
 */
class Layer {
  /**
   * The Layer constructor will make a new layer of Neu neurons.
   * Similar rules
   * @param number       The size of the layer
   * @param numInputs    The number of each neuron's input
   * @param neuFunction  The function it'll use
   * @return             The layer ready to go
   */
    constructor(number, numInputs, neuFunction = 'sigmoid') {
        this.neurons = [];
        this.numNeurons = number;
        for (let i = 0; i < number; i++) {
            this.neurons.push(new Neu(numInputs, neuFunction));
        }
    }

  /**
   * layer.activate() starts the calculation with the inputs
   * Similar rules
   * @param inputs  The array of inputs to use
   * @return        The new array output
   */
    activate(inputs) {
        const outputs = [];
        for (let neuron of this.neurons) {
            outputs.push(neuron.activate(inputs));
        }
        return outputs;
    }
  /**
   * layer.findOutLayerDs() will edit the output layer's deltas to learn with.
   * @param expectedOutputs  The expected outputs
   */
    findOutLayerDs(expectedOutputs) { //The deltas of the output
        for (let i = 0; i < this.neurons.length; i++) {
            const neuron = this.neurons[i]; //Get a neuron
            const error = expectedOutputs[i] - neuron.output; //Get the error
            neuron.delta = error * neuron.derivateOutput(); //Calc the delta
        }
    }
  /**
   * layer.findHidLayerDs() will edit the output layer's deltas to learn with.
   * @param nextLayer  Literally the next layer
   */
    findHidLayerDs(nextLayer) {
        for (let i = 0; i < this.neurons.length; i++) {
        let error = 0;
            // Sum up errors from next layer
            for (let j = 0; j < nextLayer.neurons.length; j++) {
                error += nextLayer.neurons[j].delta * nextLayer.neurons[j].weights[i];
            }
            this.neurons[i].delta = error * this.neurons[i].derivateOutput();
        }
    }
  /**
   * layer.updateWeights() will update weights.
   * Similar rules
   * @param learningRate  The size of the change
   */
    updateWeights(learningRate) {
        for (let neuron of this.neurons) {
            neuron.updateWeights(learningRate);
        }
    }
  /**
   * layer.getOutputs will return an array of the layer's outputs
   * @return  The output array
   */
    getOutputs() {
        return this.neurons.map(neuron => neuron.output);
    }
}

/**
 * Lastly, there's the brain, Freddy himself.
 * Freddy is born without knowledge. You are now in charge of teaching him.
 */
class Freddy {
  /**
   * The Freddy constructor will make a new Freddy™ AI.
   * Similar rules
   * @param architecture   The array of sizes of each layer
   * @param layerFunction  The array of function names it'll use
   * @param learningRate   The learning rate
   * @return               The Freddy™ ready to go
   * [i'm getting bored please help me]
   */
    constructor(architecture, layerFunction = null, learningRate = 0.1) {
        this.learningRate = learningRate;
        this.trainingHistory = {
            epochs: [],
            errors: []
        };
        this.buildNet(architecture, layerFunction);
    }

  /**
   * fred.predict() starts the calculation with the inputs
   * Similar rules
   * @param inputs  The array of inputs to use
   * @return        The new array output
   * I'm starting to realize now that each one is just a bigger version of the last
   */
    predict(inputs) {
        let outputs = inputs;
        // Forward propagation I guess
        for (let layer of this.layers) {
            outputs = layer.activate(outputs);
        }
        return outputs;
    }

  /**
   * fred.train() starts the training process
   * @param trainingData  An array of objects like {inputs: [array], outputs: [array]}
   * @param epoch  The number of times it has to learn
   * @param verbose  Set to true if you want to hear it all
   * [here it comes]
   */
    train(trainingData, epochs = 1000, verbose = false) {
        for (let epoch = 0; epoch < epochs; epoch++) {
            let totalError = 0; //My mistake
            // Now, train on all examples
            for (let example of trainingData) {
                const inputs = example.inputs;
                const expectedOutputs = example.outputs;
                // Forward propagation again
                const actualOutputs = this.predict(inputs);
                // Calculate error for this specific example
                let exampleError = 0;
                for (let i = 0; i < expectedOutputs.length; i++) {
                    exampleError += Math.pow(expectedOutputs[i] - actualOutputs[i], 2);
                }
                totalError += exampleError / 2;
                // Backward propagation again
                this.backpropagate(expectedOutputs);
            }
            // Record its training if x00 and about to end
            if (epoch % 100 === 0 || epoch === epochs - 1) {
                this.trainingHistory.epochs.push(epoch);
                this.trainingHistory.errors.push(totalError / trainingData.length);
                if (verbose) {
                    console.log(`Epoch ${epoch}: Average Error = ${totalError / trainingData.length}`);
                }
            }
        } //and try again
    }

  /**
   * fred.backpropagate() is the real Freddy™ trainer
   * @param expectedOutputs  An array of expected outputs
   * [FINALLY the fun part]
   */
    backpropagate(expectedOutputs) {
        // Calculate silly deltas
        const outputLayer = this.layers[this.layers.length - 1];
        outputLayer.findOutLayerDs(expectedOutputs);
        // Calculate more silly deltas
        for (let i = this.layers.length - 2; i >= 0; i--) {
            this.layers[i].findHidLayerDs(this.layers[i + 1]);
        }
        // Now, learn!
        for (let layer of this.layers) {
            layer.updateWeights(this.learningRate);
        }
    }

  /**
   * fred.aproxAccuracy() gives an estimate of the accuracy
   * @param  testData  An array of objects {inputs: [array], outputs: [array]}
   * @return           The aproximate accuracy
   * It's useful if you expect only one neuron lighting as the output
   */
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

  /**
   * fred.buildNet() builds the network to work with.
   * @param architecture  The array of sizes of each layer.
   * @param layerFunction  The array of function names to use.
   * Fun fact: When testing imports, bugs appeared. This is the solution.
   */
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

  /**
   * fred.exportWeights() exports the weights
   * @return  An array of arrays with weights and biases inside
   */
    exportWeights() {
        const weights = [];
        for (let layer of this.layers) {
            const layerWeights = [];
            for (let neuron of layer.neurons) {
                layerWeights.push({
                    weights: [...neuron.weights],
                    bias: neuron.bias + 0
                }); //Pack all weights
            }
            weights.push(layerWeights); //And close the box
        }
        return weights;
    }

  /**
   * fred.importWeights() imports the weights
   * @param  An array of arrays with weights and biases inside
   * [yea, that's why exportWeights() is here]
   */
    importWeights(weights) {
        for (let i = 0; i < weights.length; i++) {
            const layerWeights = weights[i]; //Open the box
            for (let j = 0; j < layerWeights.length; j++) {
                this.layers[i].neurons[j].weights = [...layerWeights[j].weights];
                this.layers[i].neurons[j].bias = layerWeights[j].bias;
            } //And unpack all weights
        }
    }

  /**
   * fred.toJSON() exports the Freddy™
   * @return  A VERY SILLY REALLY WIERD SUPER DUPER MEGA OBJECT™
   * AVSRWSDMO™ object packages include:
   * - This Freddy™'s .architecture
   * - The .learningRate of the Freddy™
   * - An array of .weights
   * - His .trainingHistory
   * - A list of .functions names to use
   * Mode of use: 
   * - Open the object and check the properties.
   * - Grab another Freddy™ and use the .fromJSON(data) method to upload the data.
   * Caution: Both Freddies won't be linked, training one won't train the other.
   */
    toJSON() {
        return {
            architecture: this.architecture,
            learningRate: this.learningRate,
            weights: this.exportWeights(),
            trainingHistory: this.trainingHistory,
            functions: this.functions
        }; //Of course we wanna export it
    }

  /**
   * fred.fromJSON() imports the Freddy™
   * @param config  The VSRWSDMO™ from the .toJSON() method
   */
    fromJSON(config) {
        this.learningRate = config.learningRate;
        this.trainingHistory = config.trainingHistory;
        this.buildNet(config.architecture, config.functions);
        this.importWeights(config.weights);
    } //And load it
}


/**
 * This was the Freddy™ family, FredBox, Neu, Layer and Freddy.
 * One thing is left to do: train a Freddy.
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        FredBox,
        Neu,
        Layer,
        Freddy,
    };
}
