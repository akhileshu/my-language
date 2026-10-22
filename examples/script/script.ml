// ============================================
// MyLang v1 — Project Scope
// ============================================

// ---------- Values ----------

let name = "world"
let age = 23
let active = true
let nothing = null

print(name)
print(age)
print(active)


// ---------- Expressions ----------

let a = 10
let b = 3

print(a + b)
print(a - b)
print(a * b)
print(a / b)
print(a % b)

print(a > b)
print(a == b)
print(a != b)

print(true && false)
print(true || false)
print(!true)


// ---------- Variables ----------

let x = 10

x = x + 5
x = x * 2

print(x)


// ---------- If / Else ----------

if (x > 20) {
    print("x is large")
} else {
    print("x is small")
}


// ---------- While ----------

let i = 0

while (i < 5) {
    print(i)
    i = i + 1
}


// ---------- Functions ----------

fn add(a, b) {
    return a + b
}

let result = add(10, 20)

print(result)


// ---------- Recursion ----------

fn factorial(n) {
    if (n <= 1) {
        return 1
    }

    return n * factorial(n - 1)
}

print(factorial(5))


// ---------- Combined Example ----------

fn greet(name, times) {
    let i = 0

    while (i < times) {
        print("Hello " + name)
        i = i + 1
    }
}

greet("world", 3)