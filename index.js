/**
 * The prime used as the power in the hashing functions
 * @type {number}
 */
const PowerPrime = 31

/**
 * The prime used as the modulo in the hashing functions
 * @type {number}
 */
const ModuloPrime = 201326611

/**
 * Generates a hash for a string
 * @param {string} str the string to hash
 * @returns {number} the hash
 */
function stringHash(str) {
    let h = 0
    let power = 1
    const m = ModuloPrime
    for (let c = 0; c < str.length; c++) {
        h = (h + str.charCodeAt(c) * power) % m
        power = (power * PowerPrime) % m
    }
    return h
}

/**
 * Generates a hash for an object of any type
 * @param {any} object the object to hash
 * @returns {number} the hash
 */
function hash(object) {
    switch (typeof object) {
        case "boolean":
            return object ? 1 : 0
        case "number":
        case "bigint":
            return object % ModuloPrime
        case "symbol":
        case "string":
            return stringHash(object)
        case "undefined":
            return 0
        case "object":
            let h = 0
            let power = 1
            const m = ModuloPrime
            for (let key of Object.keys(object).sort()) {
                switch (typeof object[key]) {
                    case "boolean":
                    case "number":
                    case "bigint":
                    case "symbol":
                    case "string":
                    case "undefined":
                        h = (h + hash(object[key]) * power) % m
                        break
                    default:
                        h = (h + stringHash(key) * power) % m
                }
                power = (power * PowerPrime) % m
            }
            return h
        case "function":
            return stringHash(object.toString())
    }
}

/**
 * Generates a hash for an object of any type, goes deeper if needed.
 * @param object the object to hash
 * @returns {number} the hash
 */
function deepHash(object) {
    if (typeof object == 'object') {
        let h = 0
        let power = 1
        const m = ModuloPrime
        for (let value of Object.values(object).sort()) {
            h = (h + deepHash(value) * power) % m
            power = (power * PowerPrime) % m
        }
        return h
    }
    return hash(object)
}

/**
 * A HashMap.
 *
 * @description
 * The hashmap accepts any key and value, and uses the given hashing function or the default hash function to compare keys.
 * The hashmap uses open-addressing with linear probing and bucket stealing.
 */
class HashMap {
    /**
     * The hash table
     * @type {({key: {any}, value: {any}} | null)[]}
     * @private
     */
    _table = Array(16);

    /**
     * The number of keys stored in the map
     * @type {number}
     * @private
     */
    _size = 0;

    /**
     * The hashing function
     * @type {function}
     * @private
     */
    _hashingFunc = hash

    /**
     * The primary constructor
     * @param hashingFunc the hashing function to use, defaults to hash
     */
    constructor(hashingFunc) {
        this._hashingFunc = hashingFunc ? hashingFunc : hash
    }

    /**
     * The number of keys stored in the map
     * @returns {number}
     */
    get length() {
        return this._size;
    }

    /**
     * The size of the table
     * @returns {number}
     */
    get capacity() {
        return this._table.length;
    };

    /**
     * The load factor (length / capacity)
     * @returns {number}
     */
    get loadFactor() {
        return this._size / this.capacity;
    }

    /**
     * Internal hash to table entry function
     * @param x the hash
     * @returns {number} the table entry
     * @private
     */
    _h(x) {
        return Math.floor(Math.abs(this._hashingFunc(x))) & (this.capacity - 1);
    }

    /**
     * Returns the next load factor on insertion
     * @returns {number}
     * @private
     */
    _nextLoadFactor() {
        return (this._size + 1) / this.capacity;
    }

    /**
     * Creates a bigger table and inserts the previous keys into it
     * @private
     */
    _rehash() {
        let old = this._table

        this._size = 0;
        this._table = Array(this._table.length * 2);
        for (const v of old) {
            if (v) {
                this.insert(v.key, v.value);
            }
        }
    }

    /**
     * Looks up the key and returns the index if found else index to an empty entry
     * @param key the key
     * @returns {number} the index in the table
     * @private
     */
    _lookup(key) {
        const hash = this._h(key);
        let x = 1;
        let index = hash;

        while (this._table[index] && this._hashingFunc(this._table[index].key) !== this._hashingFunc(key)) {
            index = (hash + x) % this.capacity;
            x++;
        }
        return index;
    }

    /**
     * Inserts the key and value pair into the map
     * @param key the key
     * @param value the value
     */
    insert(key, value) {
        if (this._nextLoadFactor() >= 1) {
            this._rehash()
        }
        const hash = this._h(key);
        let x = 1;
        let index = hash;

        while (this._table[index] && this._hashingFunc(this._table[index].key) !== this._hashingFunc(key)) {
            if (this._h(this._table[index].key) < this._h(key)) {
                const temp = this._table[index];
                this._table[index] = {key, value};
                key = temp.key
                value = temp.value
            }
            index = (hash + x) % this.capacity;
            x++;
        }

        if (!this._table[index]) {
            this._size++;
        }
        this._table[index] = {key, value};
    }

    /**
     * Retrieves a value from the map
     * @param key the key
     * @returns {*} the value if found, else null
     */
    get(key) {
        const index = this._lookup(key);

        return this._table[index] ? this._table[index].value : null
    }

    /**
     * Removes a key from the map
     * @param key the key
     */
    remove(key) {
        //TODO
    }

}

module.exports.hash = hash
module.exports.deepHash = deepHash
module.exports.HashMap = HashMap