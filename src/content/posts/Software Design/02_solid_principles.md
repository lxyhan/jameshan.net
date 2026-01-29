---
title: 'SOLID Principles'
pubDate: '2025-01-28'
---

SOLID is an acronym for five design principles that make software more maintainable, flexible, and understandable.

---

## Single Responsibility Principle (SRP)

A class should have only one reason to change.

```python
# Bad: User class handles data AND email sending
class User:
    def __init__(self, name, email):
        self.name = name
        self.email = email

    def save(self):
        # save to database
        pass

    def send_welcome_email(self):
        # send email - different responsibility!
        pass

# Good: Separate responsibilities
class User:
    def __init__(self, name, email):
        self.name = name
        self.email = email

class UserRepository:
    def save(self, user):
        # save to database
        pass

class EmailService:
    def send_welcome_email(self, user):
        # send email
        pass
```

---

## Open/Closed Principle (OCP)

Software entities should be open for extension but closed for modification.

```python
# Bad: Must modify class to add new shapes
class AreaCalculator:
    def calculate(self, shape):
        if shape.type == "rectangle":
            return shape.width * shape.height
        elif shape.type == "circle":
            return 3.14 * shape.radius ** 2
        # Adding new shape requires modifying this class

# Good: Extend through abstraction
from abc import ABC, abstractmethod

class Shape(ABC):
    @abstractmethod
    def area(self) -> float:
        pass

class Rectangle(Shape):
    def __init__(self, width, height):
        self.width = width
        self.height = height

    def area(self) -> float:
        return self.width * self.height

class Circle(Shape):
    def __init__(self, radius):
        self.radius = radius

    def area(self) -> float:
        return 3.14 * self.radius ** 2

# Adding new shapes doesn't require modifying existing code
class Triangle(Shape):
    def __init__(self, base, height):
        self.base = base
        self.height = height

    def area(self) -> float:
        return 0.5 * self.base * self.height
```

---

## Liskov Substitution Principle (LSP)

Subtypes must be substitutable for their base types without altering correctness.

```python
# Bad: Square violates Rectangle's expected behavior
class Rectangle:
    def __init__(self, width, height):
        self._width = width
        self._height = height

    def set_width(self, width):
        self._width = width

    def set_height(self, height):
        self._height = height

    def area(self):
        return self._width * self._height

class Square(Rectangle):
    def set_width(self, width):
        self._width = width
        self._height = width  # Breaks expected behavior!

    def set_height(self, height):
        self._width = height
        self._height = height

# This fails unexpectedly:
def resize(rect: Rectangle):
    rect.set_width(5)
    rect.set_height(10)
    assert rect.area() == 50  # Fails for Square!

# Good: Use composition or separate hierarchies
class Shape(ABC):
    @abstractmethod
    def area(self) -> float:
        pass

class Rectangle(Shape):
    def __init__(self, width, height):
        self.width = width
        self.height = height

    def area(self) -> float:
        return self.width * self.height

class Square(Shape):
    def __init__(self, side):
        self.side = side

    def area(self) -> float:
        return self.side ** 2
```

---

## Interface Segregation Principle (ISP)

Clients should not be forced to depend on interfaces they don't use.

```python
# Bad: Fat interface forces unused implementations
class Worker(ABC):
    @abstractmethod
    def work(self):
        pass

    @abstractmethod
    def eat(self):
        pass

    @abstractmethod
    def sleep(self):
        pass

class Robot(Worker):
    def work(self):
        print("Working...")

    def eat(self):
        pass  # Robots don't eat!

    def sleep(self):
        pass  # Robots don't sleep!

# Good: Segregated interfaces
class Workable(ABC):
    @abstractmethod
    def work(self):
        pass

class Eatable(ABC):
    @abstractmethod
    def eat(self):
        pass

class Sleepable(ABC):
    @abstractmethod
    def sleep(self):
        pass

class Human(Workable, Eatable, Sleepable):
    def work(self):
        print("Working...")

    def eat(self):
        print("Eating...")

    def sleep(self):
        print("Sleeping...")

class Robot(Workable):
    def work(self):
        print("Working...")
```

---

## Dependency Inversion Principle (DIP)

High-level modules should not depend on low-level modules. Both should depend on abstractions.

```python
# Bad: High-level depends on low-level
class MySQLDatabase:
    def save(self, data):
        print(f"Saving {data} to MySQL")

class UserService:
    def __init__(self):
        self.db = MySQLDatabase()  # Tight coupling!

    def create_user(self, name):
        self.db.save(name)

# Good: Both depend on abstraction
class Database(ABC):
    @abstractmethod
    def save(self, data):
        pass

class MySQLDatabase(Database):
    def save(self, data):
        print(f"Saving {data} to MySQL")

class PostgresDatabase(Database):
    def save(self, data):
        print(f"Saving {data} to Postgres")

class UserService:
    def __init__(self, db: Database):  # Inject dependency
        self.db = db

    def create_user(self, name):
        self.db.save(name)

# Easy to swap implementations
service = UserService(MySQLDatabase())
service = UserService(PostgresDatabase())
```

---

## Summary

| Principle | Key Idea |
|-----------|----------|
| **SRP** | One class, one responsibility |
| **OCP** | Extend behavior without modifying existing code |
| **LSP** | Subclasses must honor parent contracts |
| **ISP** | Small, focused interfaces |
| **DIP** | Depend on abstractions, not concretions |

These principles work together. Following SRP makes OCP easier. ISP enables DIP. LSP ensures your abstractions are meaningful.
