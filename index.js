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
    return Math.floor(Math.abs(h))
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
            return Math.floor(Math.abs(object)) % ModuloPrime
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
            return Math.floor(Math.abs(h))
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
        return Math.floor(Math.abs(h))
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
     * @type {(any[] | null)[]}
     * @private
     */
    _table;

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
     * @param {{hashingFunc((): number)?, initialTableSize: number? }?} options the options to pass
     */
    constructor(options) {
        this._hashingFunc = options ? (options.hashingFunc || hash) : hash
        this._table = Array(options ? (this._roundToNearestPowerOfTwo(options.initialTableSize || 16)) : 16)
    }

    /**
     * Rounds the given number to the nearest power of two larger than the number.
     * @param x the number
     * @returns {number} the smallest power of two larger or equal to the number
     * @private
     */
    _roundToNearestPowerOfTwo(x) {
        let i;
        for (i = 1; i < x; i <<= 1) {
        }
        return i;
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
        return this._hashingFunc(x) & (this.capacity - 1);
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
                this.insert(v[0], v[1]);
            }
        }
    }

    /**
     * Looks up the key using linear probing and returns the index if found. Else, an index to an empty entry.
     * @param key the key
     * @returns {number} the index in the table
     * @private
     */
    _lookup(key) {
        const hash = this._h(key);
        const keyHash = this._hashingFunc(key);
        let x = 1;
        let index = hash;

        while (this._table[index] && this._table[index][2] !== keyHash) {
            if (this._dib(this._table[index][2] & (this.capacity - 1), index) < this._dib(keyHash & (this.capacity - 1), index)) {
                break;
            }
            index = (hash + x) % this.capacity;
            x++;
        }
        return index;
    }

    /**
     * The distance between the bucket where an entry is stored and its initial bucket
     * @param {number} keyHash the entry's
     * @param {number} index
     * @returns {number} the DIB
     * @private
     */
    _dib(keyHash, index) {
        if (keyHash > index) {
            index += this.capacity
        }
        return index - keyHash
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
        let keyHash = this._hashingFunc(key);
        let x = 1;
        let index = hash;

        while (this._table[index] && this._table[index][2] !== keyHash) {
            if (this._dib(this._table[index][2] & (this.capacity - 1), index) < this._dib(keyHash & (this.capacity - 1), index)) {
                const temp = this._table[index];
                this._table[index] = [key, value, keyHash];
                key = temp[0]
                value = temp[1]
                keyHash = temp[2]
            }
            index = (hash + x) % this.capacity;
            x++;
        }

        if (!this._table[index]) {
            this._size++;
        }
        this._table[index] = [key, value, keyHash];
    }

    /**
     * Retrieves a value from the map
     * @param key the key
     * @returns {*} the value if found, else null
     */
    get(key) {
        const index = this._lookup(key);

        return (this._table[index] && this._table[index][2] === this._hashingFunc(key)) ? this._table[index][1] : null
    }

    /**
     * Removes a key from the map
     * @param key the key
     */
    remove(key) {
        let index = this._lookup(key);
        if (!this._table[index] || this._table[index][2] !== this._hashingFunc(key)) {
            return;
        }
        index = (index + 1) % this.capacity;
        let entry = this._table[index];

        while (entry && this._dib(entry[2] & (this.capacity - 1), index)) {
            this._table[index ? (index - 1) : (this.capacity - 1)] = entry;
            index = (index + 1) % this.capacity;
            entry = this._table[index];
        }
        this._table[index ? (index - 1) : (this.capacity - 1)] = entry;
    }

    /**
     * Creates a new iterator
     * @returns {{next(): ({value: *, done: boolean}), i: number, table: (*[]|null)[]}} the iterator
     */
    [Symbol.iterator]() {
        return {
            i: 0,
            table: this._table,
            next() {
                while (!this.table[this.i] && this.i < this.table.length) {
                    this.i++;
                }
                if (this.i === this.table.length) {
                    return {
                        value: undefined,
                        done: true
                    }
                }
                let entry = this.table[this.i++]
                return {
                    value: entry.slice(0, 2),
                    done: false
                }
            }
        }
    }

}

module.exports.stringHash = stringHash
module.exports.hash = hash
module.exports.deepHash = deepHash
module.exports.HashMap = HashMap