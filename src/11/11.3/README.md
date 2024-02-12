I copied this code from [this dude's solution](https://github.com/kasymbayaman/node.js-design-patterns-solutions/tree/main/11-advanced-recipes/11.3-deep-async-cancelable)

I added notes directly in the code to try to figure out how the f* (not a generator btw) does any of this work. Also, some diagrams with a basic sequence diagram.

---

### **Resources**

theory ⇒ https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/yield*

some use cases ⇒ https://dev.to/alekseiberezkin/3-use-cases-for-es6-generators-3375

---

generator functions return generator objects (that is, the body of the function is not yet executed, execution starts when next() is called, either directly or iterating in some way over the iterator, be it a for of loop or spread synthax, etc).

things get really interesting when a generator yields another generator:

 `yield * someGeneratorFunction()`  → the generator function returns a generator.

this causes the main generator to delegate to the “nested” iterator.

the `yield*` statement iterates over the operand (the nested iterator/generator) and yields each value returned (”yielded” by it).

---

my mental model for thinking about this:

`yield*` sorts of opens a communication channel between the consumer of the main generator and the nested generator/iterator. 
The consumer, in turn, does not know about this, its like he is just “pulling” values from the main generator. 
When he calls next() on the main generator, `yield *` will ‘forward’ to the inner generator (or iterator) which will yield a value and that value will be ‘forwarded’ from `yield *`  to the consumer of the main generator. 
once the nested generator is done, it will return its final result to `yield *` , which will 'forward' it to the consumer, and when next is calles, the main generator will continue until it hit a next `yield` statement.