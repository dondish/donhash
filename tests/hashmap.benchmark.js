const {performance} = require('perf_hooks')
const {MersenneTwister19937} = require('random-js');
const {HashMap, stringHash} = require('../index');

const rng = MersenneTwister19937.seed(314315252);

function log_header(type) {
    console.log("###################")
    console.log(`Benchmarking: ${type}`)
}

function min(x) {
    let z = Number.MAX_VALUE;
    for (const r of x) {
        z = Math.min(z, r);
    }
    return z;
}

function max(x) {
    let z = Number.MIN_VALUE;
    for (const r of x) {
        z = Math.max(z, r);
    }
    return z;
}

function sum(x) {
    return x.reduce((p, x) => p + x, 0)
}

function avg(x) {
    return sum(x) / x.length
}

function benchmark_insert(amount, firstAmount, lastAmount) {
    log_header("Insertion");
    console.log(`Amount of insertions: ${amount}`);
    let operations = [];
    const map = new HashMap({hashingFunc: stringHash});
    for (let i = 0; i < amount; i++) {
        const key = rng.next().toString();
        const value = rng.next().toString();
        const timeBefore = performance.now();
        map.insert(key, value);
        operations.push(performance.now() - timeBefore);
    }
    console.log(`Min Insertion time: ${min(operations)}ms`);
    console.log(`Max Insertion time: ${max(operations)}ms`);
    console.log(`Average Insertion time: ${avg(operations)}ms`);
    console.log(`Average Insertion time of the first ${firstAmount}: ${avg(operations.slice(0, firstAmount))}ms`)
    console.log(`Average Insertion time of the last ${lastAmount}: ${avg(operations.slice(operations.length - lastAmount))}ms`)
}

function benchmark_insert_norealloc(amount, firstAmount, lastAmount) {
    log_header("Insertion with no reallocation");
    console.log(`Amount of insertions: ${amount}`);
    let operations = [];
    const map = new HashMap({hashingFunc: stringHash, initialTableSize: amount});
    for (let i = 0; i < amount; i++) {
        const key = rng.next().toString();
        const value = rng.next().toString();
        const timeBefore = performance.now();
        map.insert(key, value);
        operations.push(performance.now() - timeBefore);
    }
    console.log(`Min Insertion time: ${min(operations)}ms`);
    console.log(`Max Insertion time: ${max(operations)}ms`);
    console.log(`Average Insertion time: ${avg(operations)}ms`);
    console.log(`Average Insertion time of the first ${firstAmount}: ${avg(operations.slice(0, firstAmount))}ms`)
    console.log(`Average Insertion time of the last ${lastAmount}: ${avg(operations.slice(operations.length - lastAmount))}ms`)
}

function benchmark_successful_lookup(elementAmount, lookupAmount, firstAmount, lastAmount) {
    log_header("Successful Lookup");
    console.log(`Amount of lookups: ${lookupAmount}`);
    console.log(`Amount of elements: ${elementAmount}`)
    let keys = [];
    let operations = [];
    const map = new HashMap({hashingFunc: stringHash, initialTableSize: elementAmount});
    for (let i = 0; i < elementAmount; i++) {
        const key = rng.next().toString();
        keys.push(key);
        const value = rng.next().toString();
        map.insert(key, value);
    }
    for (let i = 0; i < lookupAmount; i++) {
        const key = keys[Math.abs(rng.next()) % keys.length];
        const timeBefore = performance.now();
        map.get(key);
        operations.push(performance.now() - timeBefore);
    }
    console.log(`Min Retrieval time: ${min(operations)}ms`);
    console.log(`Max Retrieval time: ${max(operations)}ms`);
    console.log(`Average Retrieval time: ${avg(operations)}ms`);
    console.log(`Average Retrieval time of the first ${firstAmount}: ${avg(operations.slice(0, firstAmount))}ms`)
    console.log(`Average Retrieval time of the last ${lastAmount}: ${avg(operations.slice(operations.length - lastAmount))}ms`)
}

function benchmark_failed_lookup(elementAmount, lookupAmount, firstAmount, lastAmount) {
    log_header("Failed Lookup");
    console.log(`Amount of lookups: ${lookupAmount}`);
    console.log(`Amount of elements: ${elementAmount}`)
    let keys = {};
    let operations = [];
    const map = new HashMap({hashingFunc: stringHash, initialTableSize: elementAmount});
    for (let i = 0; i < elementAmount; i++) {
        const key = rng.next().toString();
        keys[key] = true;
        const value = rng.next().toString();
        map.insert(key, value);
    }
    for (let i = 0; i < lookupAmount; i++) {
        let key = rng.next().toString();
        while (keys[key]) {
            key = rng.next().toString();
        }
        const timeBefore = performance.now();
        map.get(key);
        operations.push(performance.now() - timeBefore);
    }
    console.log(`Min Retrieval time: ${min(operations)}ms`);
    console.log(`Max Retrieval time: ${max(operations)}ms`);
    console.log(`Average Retrieval time: ${avg(operations)}ms`);
    console.log(`Average Retrieval time of the first ${firstAmount}: ${avg(operations.slice(0, firstAmount))}ms`)
    console.log(`Average Retrieval time of the last ${lastAmount}: ${avg(operations.slice(operations.length - lastAmount))}ms`)
}

function benchmark_remove(elementAmount, removeAmount, firstAmount, lastAmount) {
    log_header("Removal");
    console.log(`Amount of removes: ${removeAmount}`);
    console.log(`Amount of elements: ${elementAmount}`)
    let keys = [];
    let operations = [];
    const map = new HashMap({hashingFunc: stringHash, initialTableSize: elementAmount});
    for (let i = 0; i < elementAmount; i++) {
        const key = rng.next().toString();
        keys.push(key);
        const value = rng.next().toString();
        map.insert(key, value);
    }
    for (let i = 0; i < removeAmount; i++) {
        const key = keys[Math.abs(rng.next()) % keys.length];
        const timeBefore = performance.now();
        map.remove(key);
        operations.push(performance.now() - timeBefore);
    }
    console.log(`Min Removal time: ${min(operations)}ms`);
    console.log(`Max Removal time: ${max(operations)}ms`);
    console.log(`Average Removal time: ${avg(operations)}ms`);
    console.log(`Average Removal time of the first ${firstAmount}: ${avg(operations.slice(0, firstAmount))}ms`)
    console.log(`Average Removal time of the last ${lastAmount}: ${avg(operations.slice(operations.length - lastAmount))}ms`)
}

benchmark_insert(1000000, 5000, 5000);
benchmark_insert_norealloc(1000000, 5000, 5000);
benchmark_successful_lookup(1000000, 50000, 5000, 5000);
benchmark_failed_lookup(1000000, 50000, 5000, 5000);
benchmark_remove(1000000, 50000, 5000, 5000);