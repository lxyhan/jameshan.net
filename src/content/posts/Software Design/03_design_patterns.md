---
title: 'Design Patterns'
pubDate: '2025-01-28'
---

Common solutions to recurring software design problems. These patterns aren't code to copy, they're templates for solving problems in context.

---

## Creational Patterns

### Factory

Creates objects without exposing instantiation logic. Useful when the exact type isn't known until runtime.

```python
class Dog:
    def speak(self):
        return "Woof!"

class Cat:
    def speak(self):
        return "Meow!"

class AnimalFactory:
    @staticmethod
    def create(animal_type: str):
        if animal_type == "dog":
            return Dog()
        elif animal_type == "cat":
            return Cat()
        raise ValueError(f"Unknown animal: {animal_type}")

# Usage
animal = AnimalFactory.create("dog")
print(animal.speak())  # Woof!
```

### Abstract Factory

Creates families of related objects without specifying concrete classes.

```python
from abc import ABC, abstractmethod

class Button(ABC):
    @abstractmethod
    def render(self):
        pass

class Checkbox(ABC):
    @abstractmethod
    def render(self):
        pass

# Mac family
class MacButton(Button):
    def render(self):
        return "Mac button"

class MacCheckbox(Checkbox):
    def render(self):
        return "Mac checkbox"

# Windows family
class WinButton(Button):
    def render(self):
        return "Windows button"

class WinCheckbox(Checkbox):
    def render(self):
        return "Windows checkbox"

class GUIFactory(ABC):
    @abstractmethod
    def create_button(self) -> Button:
        pass

    @abstractmethod
    def create_checkbox(self) -> Checkbox:
        pass

class MacFactory(GUIFactory):
    def create_button(self):
        return MacButton()

    def create_checkbox(self):
        return MacCheckbox()

class WinFactory(GUIFactory):
    def create_button(self):
        return WinButton()

    def create_checkbox(self):
        return WinCheckbox()

# Usage
def create_ui(factory: GUIFactory):
    button = factory.create_button()
    checkbox = factory.create_checkbox()
    return button.render(), checkbox.render()
```

### Builder

Constructs complex objects step by step. Separates construction from representation.

```python
class Pizza:
    def __init__(self):
        self.size = None
        self.cheese = False
        self.pepperoni = False
        self.mushrooms = False

    def __str__(self):
        toppings = []
        if self.cheese:
            toppings.append("cheese")
        if self.pepperoni:
            toppings.append("pepperoni")
        if self.mushrooms:
            toppings.append("mushrooms")
        return f"{self.size} pizza with {', '.join(toppings)}"

class PizzaBuilder:
    def __init__(self):
        self.pizza = Pizza()

    def set_size(self, size):
        self.pizza.size = size
        return self

    def add_cheese(self):
        self.pizza.cheese = True
        return self

    def add_pepperoni(self):
        self.pizza.pepperoni = True
        return self

    def add_mushrooms(self):
        self.pizza.mushrooms = True
        return self

    def build(self):
        return self.pizza

# Usage - fluent interface
pizza = (PizzaBuilder()
    .set_size("large")
    .add_cheese()
    .add_pepperoni()
    .build())
```

### Singleton

Ensures a class has only one instance. Use sparingly, often a code smell.

```python
class Database:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.connection = "Connected"
        return cls._instance

# Both reference the same instance
db1 = Database()
db2 = Database()
assert db1 is db2
```

---

## Structural Patterns

### Facade

Provides a simplified interface to a complex subsystem.

```python
class CPU:
    def freeze(self):
        print("CPU frozen")

    def execute(self):
        print("CPU executing")

class Memory:
    def load(self, data):
        print(f"Memory loading: {data}")

class HardDrive:
    def read(self, sector):
        return f"data from sector {sector}"

# Facade simplifies the complex boot process
class ComputerFacade:
    def __init__(self):
        self.cpu = CPU()
        self.memory = Memory()
        self.hard_drive = HardDrive()

    def start(self):
        self.cpu.freeze()
        data = self.hard_drive.read(0)
        self.memory.load(data)
        self.cpu.execute()

# Usage - simple interface
computer = ComputerFacade()
computer.start()
```

### Adapter

Converts one interface to another that clients expect.

```python
class EuropeanPlug:
    def plug_in(self):
        return "220V power"

class USASocket:
    def provide_power(self):
        return "110V power"

# Adapter makes European plug work with USA socket
class PlugAdapter:
    def __init__(self, usa_socket: USASocket):
        self.socket = usa_socket

    def plug_in(self):
        power = self.socket.provide_power()
        return f"Converted: {power} -> 220V"

# Usage
adapter = PlugAdapter(USASocket())
print(adapter.plug_in())  # Works like EuropeanPlug
```

### Decorator

Adds behavior to objects dynamically without altering their class.

```python
from abc import ABC, abstractmethod

class Coffee(ABC):
    @abstractmethod
    def cost(self) -> float:
        pass

    @abstractmethod
    def description(self) -> str:
        pass

class SimpleCoffee(Coffee):
    def cost(self):
        return 2.0

    def description(self):
        return "Coffee"

class CoffeeDecorator(Coffee):
    def __init__(self, coffee: Coffee):
        self._coffee = coffee

class Milk(CoffeeDecorator):
    def cost(self):
        return self._coffee.cost() + 0.5

    def description(self):
        return self._coffee.description() + ", milk"

class Sugar(CoffeeDecorator):
    def cost(self):
        return self._coffee.cost() + 0.25

    def description(self):
        return self._coffee.description() + ", sugar"

# Usage - stack decorators
coffee = SimpleCoffee()
coffee = Milk(coffee)
coffee = Sugar(coffee)
print(f"{coffee.description()}: ${coffee.cost()}")
# Coffee, milk, sugar: $2.75
```

### Proxy

Controls access to another object.

```python
class Image(ABC):
    @abstractmethod
    def display(self):
        pass

class RealImage(Image):
    def __init__(self, filename):
        self.filename = filename
        self._load()

    def _load(self):
        print(f"Loading {self.filename}")

    def display(self):
        print(f"Displaying {self.filename}")

class ProxyImage(Image):
    def __init__(self, filename):
        self.filename = filename
        self._real_image = None

    def display(self):
        if self._real_image is None:
            self._real_image = RealImage(self.filename)
        self._real_image.display()

# Usage - lazy loading
image = ProxyImage("photo.jpg")  # No loading yet
image.display()  # Loads and displays
image.display()  # Just displays (already loaded)
```

---

## Behavioral Patterns

### Strategy

Defines a family of algorithms and makes them interchangeable.

```python
from abc import ABC, abstractmethod

class PaymentStrategy(ABC):
    @abstractmethod
    def pay(self, amount: float):
        pass

class CreditCard(PaymentStrategy):
    def __init__(self, number):
        self.number = number

    def pay(self, amount):
        print(f"Paid ${amount} with card {self.number[-4:]}")

class PayPal(PaymentStrategy):
    def __init__(self, email):
        self.email = email

    def pay(self, amount):
        print(f"Paid ${amount} via PayPal ({self.email})")

class ShoppingCart:
    def __init__(self):
        self.total = 0

    def checkout(self, payment: PaymentStrategy):
        payment.pay(self.total)

# Usage - swap algorithms at runtime
cart = ShoppingCart()
cart.total = 100
cart.checkout(CreditCard("1234567890123456"))
cart.checkout(PayPal("user@email.com"))
```

### Observer

Objects subscribe to events and get notified when they occur.

```python
class Subject:
    def __init__(self):
        self._observers = []

    def attach(self, observer):
        self._observers.append(observer)

    def detach(self, observer):
        self._observers.remove(observer)

    def notify(self, message):
        for observer in self._observers:
            observer.update(message)

class EmailSubscriber:
    def __init__(self, email):
        self.email = email

    def update(self, message):
        print(f"Email to {self.email}: {message}")

class SMSSubscriber:
    def __init__(self, phone):
        self.phone = phone

    def update(self, message):
        print(f"SMS to {self.phone}: {message}")

# Usage
newsletter = Subject()
newsletter.attach(EmailSubscriber("user@email.com"))
newsletter.attach(SMSSubscriber("555-1234"))
newsletter.notify("New article published!")
```

### Command

Encapsulates a request as an object, allowing parameterization and queuing.

```python
from abc import ABC, abstractmethod

class Command(ABC):
    @abstractmethod
    def execute(self):
        pass

    @abstractmethod
    def undo(self):
        pass

class Light:
    def on(self):
        print("Light is ON")

    def off(self):
        print("Light is OFF")

class LightOnCommand(Command):
    def __init__(self, light: Light):
        self.light = light

    def execute(self):
        self.light.on()

    def undo(self):
        self.light.off()

class RemoteControl:
    def __init__(self):
        self.history = []

    def execute(self, command: Command):
        command.execute()
        self.history.append(command)

    def undo(self):
        if self.history:
            self.history.pop().undo()

# Usage
light = Light()
remote = RemoteControl()
remote.execute(LightOnCommand(light))  # Light is ON
remote.undo()  # Light is OFF
```

---

## Summary

| Pattern | Purpose |
|---------|---------|
| **Factory** | Create objects without specifying exact class |
| **Abstract Factory** | Create families of related objects |
| **Builder** | Construct complex objects step by step |
| **Singleton** | Ensure single instance |
| **Facade** | Simplify complex subsystem |
| **Adapter** | Convert interface to another |
| **Decorator** | Add behavior dynamically |
| **Proxy** | Control access to object |
| **Strategy** | Swap algorithms at runtime |
| **Observer** | Subscribe to events |
| **Command** | Encapsulate requests as objects |

Don't force patterns where they don't fit. They're tools, not rules.
