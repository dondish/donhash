# Dondish's HashMap
Hashmap and hashing implementation in JavaScript.

## Installation
NPM:
```
npm i donhash
```
Yarn:
```
yarn add donhash
```

## HashMap Implementation
Open-Addressing with linear probing and Robin Hood Bucket Stealing.

## Memory Usage
The hashmap capacity is the smallest power of two larger than the amount of elements.

The hashmap does not shrink if element count goes down.

## Benchmarks
### Benchmarking: Insertion
```
Amount of insertions: 1000000
Min Insertion time: 0.0007999999943422154ms
Max Insertion time: 281.561099999999ms
Average Insertion time: 0.033581183399999555ms
Average Insertion time of the first 5000: 0.005359440000000012ms
Average Insertion time of the last 5000: 0.02661639999997569ms
```
### Benchmarking: Insertion with no reallocation
```
Amount of insertions: 1000000
Min Insertion time: 0.0007999999943422154ms
Max Insertion time: 30.169999999998254ms
Average Insertion time: 0.002772173899998139ms
Average Insertion time of the first 5000: 0.000953620000022056ms
Average Insertion time of the last 5000: 0.03078976000006951ms
```
### Benchmarking: Successful Lookup
```
Amount of lookups: 50000
Amount of elements: 1000000
Min Retrieval time: 0.000999999996565748ms
Max Retrieval time: 0.5910000000003492ms
Average Retrieval time: 0.002046426000012434ms
Average Retrieval time of the first 5000: 0.0029222600000459354ms
Average Retrieval time of the last 5000: 0.001903740000007383ms
```
### Benchmarking: Failed Lookup
```
Amount of lookups: 50000
Amount of elements: 1000000
Min Retrieval time: 0.0007999999943422154ms
Max Retrieval time: 7.737300000000687ms
Average Retrieval time: 0.001981702000022051ms
Average Retrieval time of the first 5000: 0.0019545200000226034ms
Average Retrieval time of the last 5000: 0.0033657400000025517ms
```
### Benchmarking: Removal
```
Amount of removes: 50000
Amount of elements: 1000000
Min Removal time: 0.000999999996565748ms
Max Removal time: 0.7252999999982421ms
Average Removal time: 0.005207931999969587ms
Average Removal time of the first 5000: 0.010110580000017945ms
Average Removal time of the last 5000: 0.0034685599999240368ms
```