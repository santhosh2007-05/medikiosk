import os

f = "sih/src/context/PatientSessionContext.jsx"
with open(f, "r", encoding="utf-8") as file:
    content = file.read()

content = content.replace("if (path === '/doctor') return 'doctor';", "if (path === '/admin') return 'admin';\n    if (path === '/doctor') return 'doctor';")

with open(f, "w", encoding="utf-8") as file:
    file.write(content)

