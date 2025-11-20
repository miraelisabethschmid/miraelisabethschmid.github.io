import os, json, sys

reg_path = ".system/registry.json"
workflows_dir = ".system/workflows"
modules_dir = ".system/modules"
generators_dir = ".system/generators"

# Load registry
if not os.path.exists(reg_path):
    print("Registry not found.")
    sys.exit(0)

with open(reg_path, "r") as f:
    reg = json.load(f)

# Ensure directories exist
os.makedirs(workflows_dir, exist_ok=True)
os.makedirs(modules_dir, exist_ok=True)
os.makedirs(generators_dir, exist_ok=True)

# Helper to write files
def write_if_missing(path, content):
    if not os.path.exists(path):
        with open(path, "w") as f:
            f.write(content)
        print(f"Created: {path}")
    else:
        print(f"Exists: {path}")

# Sync workflows
for w in reg.get("workflows", []):
    name = w["name"]
    file = w["file"]
    content = w["content"]
    path = os.path.join(workflows_dir, file)
    write_if_missing(path, content)

# Sync modules
for m in reg.get("modules", []):
    name = m["name"]
    file = m["file"]
    content = m["content"]
    path = os.path.join(modules_dir, file)
    write_if_missing(path, content)

# Sync generators
for g in reg.get("generators", []):
    name = g["name"]
    file = g["file"]
    content = g["content"]
    path = os.path.join(generators_dir, file)
    write_if_missing(path, content)

print("Sync complete.")
