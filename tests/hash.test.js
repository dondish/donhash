const {hash, deepHash} = require('../index')

function ascii(s) {
    return s.charCodeAt(0)
}

describe('Hash Tests', function () {
    it('should hash numbers correctly', function () {
        expect(hash(1)).toBe(1);
        expect(hash(23523525)).toBe(23523525);
        expect(hash(201326612)).toBe(1);
    });

    it('should hash strings correctly', function () {
        expect(hash('A')).toBe(ascii('A'));
        expect(hash('AbCdE')).toBe(ascii('A') + ascii('b') * 31 + ascii('C') * 31 * 31 + ascii('d') * 31 * 31 * 31 + ascii('E') * 31 * 31 * 31 * 31);
    });

    it('should hash objects correctly', function () {
        expect(hash({"Yee": "Joop"})).toBe(hash("Joop"));
        expect(hash({"Yee": "Joop", "Zip": "Doup"})).toBe(hash("Joop") + hash("Doup") * 31);
        expect(hash({"Yee": "Joop", "Zip": "Doup"})).toBe(hash({"Zip": "Doup", "Yee": "Joop"}));
        expect(hash({"Yee": {}})).toBe(hash("Yee"))
        // Object equality regardless of memory address
        expect(hash({"Yee": "Joop"})).toBe(hash({"Yee": "Joop"}));
    });

    it('should deep hash correctly', function () {
        expect(deepHash({"Yee": {"Yee": "Joop"}})).toBe(hash("Joop"));
        expect(deepHash({"Yee": "Joop", "Leap": {"Zip": "Doup"}})).toBe(deepHash({
            "Leap": {"Zip": "Doup"},
            "Yee": "Joop"
        }));
    });
});