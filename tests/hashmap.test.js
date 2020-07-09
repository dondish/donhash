const {HashMap} = require('../index');

describe('HashMap Tests', function () {
    it('should insert to the hashmap', function () {
        const map = new HashMap()
        expect(map.loadFactor).toBe(0);
        expect(map._nextLoadFactor()).toBe(1 / 16);
        expect(map.get('Test')).toBe(null);
        map.insert('Test', 'Value')
        expect(map.get('Test')).toBe('Value')
        expect(map._capacity).toBe(16)
        expect(map._size).toBe(1)
        map.insert('Test', 'Value2')
        expect(map.get('Test')).toBe('Value2')
        expect(map._capacity).toBe(16)
        expect(map._size).toBe(1)
        map.insert('Test2', 'Value3')
        expect(map.get('Test')).toBe('Value2')
        expect(map.get('Test2')).toBe('Value3')
        expect(map._size).toBe(2)
        for (let i = 0; i < 14; i++) {
            map.insert(i, i.toString());
        }
        expect(map.get('Test')).toBe('Value2')
        expect(map.get('Test2')).toBe('Value3')
        expect(map._capacity).toBe(32)
    })
});