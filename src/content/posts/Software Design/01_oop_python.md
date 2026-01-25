---
title: 'Object-Oriented Programming in Python'
pubDate: '2025-01-25'
---

Object-oriented programming organizes code around **objects**—bundles of data (attributes) and behavior (methods). Python's OOP is flexible: everything is an object, classes are objects, and you can mix paradigms freely.

---

## Classes and Objects

A **class** is a blueprint. An **object** (instance) is a concrete realization.

```python
class Dog:
    species = "Canis familiaris"  # class attribute (shared)

    def __init__(self, name, age):
        self.name = name  # instance attribute (unique)
        self.age = age

    def bark(self):
        return f"{self.name} says woof!"

# Create instances
buddy = Dog("Buddy", 3)
lucy = Dog("Lucy", 5)

print(buddy.name)        # "Buddy"
print(buddy.species)     # "Canis familiaris"
print(buddy.bark())      # "Buddy says woof!"
```

**`self`** refers to the current instance. It's explicit in Python (unlike `this` in Java/C++).

**`__init__`** is the initializer (not constructor—`__new__` is the actual constructor). Called after the object is created.

---

## The Four Pillars of OOP

### 1. Encapsulation

Bundle data and methods together. Control access to internal state.

```python
class BankAccount:
    def __init__(self, balance=0):
        self._balance = balance  # convention: "protected"

    def deposit(self, amount):
        if amount > 0:
            self._balance += amount

    def withdraw(self, amount):
        if 0 < amount <= self._balance:
            self._balance -= amount
            return amount
        raise ValueError("Insufficient funds")

    @property
    def balance(self):
        return self._balance
```

**Python's access conventions:**
- `public` — no underscore, accessible everywhere
- `_protected` — single underscore, "internal use" (convention only)
- `__private` — double underscore, name-mangled to `_ClassName__private`

```python
class Example:
    def __init__(self):
        self.public = 1
        self._protected = 2
        self.__private = 3

e = Example()
print(e.public)           # 1
print(e._protected)       # 2 (works, but discouraged)
print(e._Example__private) # 3 (name-mangled)
```

---

### 2. Inheritance

Create new classes based on existing ones. Child inherits parent's attributes and methods.

```python
class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        raise NotImplementedError("Subclass must implement")

class Dog(Animal):
    def speak(self):
        return f"{self.name} says woof!"

class Cat(Animal):
    def speak(self):
        return f"{self.name} says meow!"

animals = [Dog("Buddy"), Cat("Whiskers")]
for animal in animals:
    print(animal.speak())
```

**`super()`** calls the parent class method:

```python
class Employee:
    def __init__(self, name, salary):
        self.name = name
        self.salary = salary

class Manager(Employee):
    def __init__(self, name, salary, department):
        super().__init__(name, salary)
        self.department = department
```

---

### 3. Polymorphism

Same interface, different implementations. "Many forms."

```python
class Shape:
    def area(self):
        raise NotImplementedError

class Rectangle(Shape):
    def __init__(self, width, height):
        self.width = width
        self.height = height

    def area(self):
        return self.width * self.height

class Circle(Shape):
    def __init__(self, radius):
        self.radius = radius

    def area(self):
        return 3.14159 * self.radius ** 2

# Polymorphic function
def print_area(shape: Shape):
    print(f"Area: {shape.area()}")

print_area(Rectangle(3, 4))  # Area: 12
print_area(Circle(5))        # Area: 78.54
```

**Duck typing:** Python doesn't require inheritance for polymorphism. If it walks like a duck and quacks like a duck, it's a duck.

```python
class Duck:
    def quack(self):
        print("Quack!")

class Person:
    def quack(self):
        print("I'm pretending to be a duck!")

def make_it_quack(thing):
    thing.quack()  # Works for anything with a quack() method

make_it_quack(Duck())    # Quack!
make_it_quack(Person())  # I'm pretending to be a duck!
```

---

### 4. Abstraction

Hide complex implementation, expose simple interface. Use abstract base classes.

```python
from abc import ABC, abstractmethod

class Database(ABC):
    @abstractmethod
    def connect(self):
        pass

    @abstractmethod
    def execute(self, query):
        pass

class PostgreSQL(Database):
    def connect(self):
        print("Connecting to PostgreSQL...")

    def execute(self, query):
        print(f"Executing: {query}")

# db = Database()  # TypeError: Can't instantiate abstract class
db = PostgreSQL()
db.connect()
db.execute("SELECT * FROM users")
```

---

## Special Methods (Dunder Methods)

Double-underscore methods customize class behavior.

```python
class Vector:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __repr__(self):
        return f"Vector({self.x}, {self.y})"

    def __str__(self):
        return f"({self.x}, {self.y})"

    def __add__(self, other):
        return Vector(self.x + other.x, self.y + other.y)

    def __eq__(self, other):
        return self.x == other.x and self.y == other.y

    def __len__(self):
        return int((self.x ** 2 + self.y ** 2) ** 0.5)

    def __getitem__(self, index):
        return (self.x, self.y)[index]

v1 = Vector(3, 4)
v2 = Vector(1, 2)

print(v1)           # (3, 4)
print(repr(v1))     # Vector(3, 4)
print(v1 + v2)      # (4, 6)
print(v1 == v2)     # False
print(len(v1))      # 5
print(v1[0])        # 3
```

**Common dunder methods:**

| Method | Purpose |
|--------|---------|
| `__init__` | Initialize instance |
| `__repr__` | Developer string (unambiguous) |
| `__str__` | User string (readable) |
| `__eq__`, `__lt__`, `__gt__` | Comparisons |
| `__add__`, `__sub__`, `__mul__` | Arithmetic |
| `__len__`, `__getitem__`, `__iter__` | Container behavior |
| `__call__` | Make instance callable |
| `__enter__`, `__exit__` | Context manager |

---

## Properties and Descriptors

**Properties** provide getter/setter with attribute syntax:

```python
class Circle:
    def __init__(self, radius):
        self._radius = radius

    @property
    def radius(self):
        return self._radius

    @radius.setter
    def radius(self, value):
        if value < 0:
            raise ValueError("Radius cannot be negative")
        self._radius = value

    @property
    def area(self):
        return 3.14159 * self._radius ** 2

c = Circle(5)
print(c.radius)    # 5 (calls getter)
c.radius = 10      # calls setter
print(c.area)      # 314.159 (computed property)
```

---

## Class Methods and Static Methods

```python
class Date:
    def __init__(self, year, month, day):
        self.year = year
        self.month = month
        self.day = day

    @classmethod
    def from_string(cls, date_string):
        """Alternative constructor"""
        year, month, day = map(int, date_string.split('-'))
        return cls(year, month, day)

    @staticmethod
    def is_valid(date_string):
        """Utility function (no access to cls or self)"""
        try:
            year, month, day = map(int, date_string.split('-'))
            return 1 <= month <= 12 and 1 <= day <= 31
        except:
            return False

    def __repr__(self):
        return f"Date({self.year}, {self.month}, {self.day})"

# Regular constructor
d1 = Date(2025, 1, 25)

# Class method (alternative constructor)
d2 = Date.from_string("2025-01-25")

# Static method (utility)
print(Date.is_valid("2025-13-01"))  # False
```

**When to use:**
- `@classmethod` — alternative constructors, access to class itself
- `@staticmethod` — utility functions, no access to class or instance

---

## Multiple Inheritance and MRO

Python supports multiple inheritance. Method Resolution Order (MRO) determines which method is called.

```python
class A:
    def method(self):
        print("A")

class B(A):
    def method(self):
        print("B")
        super().method()

class C(A):
    def method(self):
        print("C")
        super().method()

class D(B, C):
    def method(self):
        print("D")
        super().method()

d = D()
d.method()
# Output: D, B, C, A

print(D.__mro__)
# (<class 'D'>, <class 'B'>, <class 'C'>, <class 'A'>, <class 'object'>)
```

**MRO uses C3 linearization:** depth-first, left-to-right, but each class appears only once.

---

## Composition Over Inheritance

Often better to **compose** objects than inherit.

```python
# Inheritance approach (tight coupling)
class FlyingCar(Car, Airplane):  # Awkward
    pass

# Composition approach (flexible)
class Car:
    def __init__(self):
        self.engine = Engine()
        self.wheels = [Wheel() for _ in range(4)]

    def drive(self):
        self.engine.start()
        for wheel in self.wheels:
            wheel.rotate()
```

**Favor composition when:**
- "Has-a" relationship (car has an engine)
- Need to change behavior at runtime
- Avoiding deep inheritance hierarchies

**Use inheritance when:**
- "Is-a" relationship (dog is an animal)
- Want to reuse interface and implementation
- Polymorphism is the goal

---

## Dataclasses (Python 3.7+)

Reduce boilerplate for data-holding classes:

```python
from dataclasses import dataclass, field

@dataclass
class Point:
    x: float
    y: float

@dataclass
class Player:
    name: str
    score: int = 0
    inventory: list = field(default_factory=list)

    def add_item(self, item):
        self.inventory.append(item)

# Auto-generates __init__, __repr__, __eq__
p1 = Point(3, 4)
p2 = Point(3, 4)
print(p1)           # Point(x=3, y=4)
print(p1 == p2)     # True

player = Player("Alice")
player.add_item("sword")
```

**Dataclass options:**
```python
@dataclass(frozen=True)      # Immutable (hashable)
@dataclass(order=True)       # Add comparison methods
@dataclass(slots=True)       # Use __slots__ for memory efficiency
```

---

## Key Principles

1. **Single Responsibility:** A class should have one reason to change.

2. **Open/Closed:** Open for extension, closed for modification.

3. **Liskov Substitution:** Subclasses should be substitutable for their parents.

4. **Interface Segregation:** Many specific interfaces > one general interface.

5. **Dependency Inversion:** Depend on abstractions, not concretions.

These are the **SOLID** principles—guidelines, not laws. Apply judgment.
