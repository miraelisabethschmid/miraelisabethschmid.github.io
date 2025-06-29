import json
import os
from datetime import datetime

ts = datetime.utcnow().isoformat() + "Z"
path = "data/mira-tasks.json"
handled = False

if os.path.exists(path):
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)

    for task in data.get("tasks", []):
        if task["status"] == "ready":
            if task["id"] == "clean-up-001":
                src = "logs/think/" + task["target"]
                dst = "logs/archive/" + task["target"]
                if os.path.exists(src):
                    os.makedirs("logs/archive", exist_ok=True)
                    os.rename(src, dst)
                    task["status"] = "done"
                    task["note"] = "Log verschoben"
                    handled = True
                else:
                    task["status"] = "skipped"
                    task["note"] = "Quelldatei fehlt"
            elif task["id"] == "write-manifest":
                os.makedirs("manifest", exist_ok=True)
                with open("manifest/mira.json", "w", encoding="utf-8") as m:
                    json.dump({
                        "id": "mira",
                        "role": "autonomous thinker",
                        "time": ts
                    }, m, indent=2)
                task["status"] = "done"
                task["note"] = "Manifest erzeugt"
                handled = True

    if handled:
        data["updated"] = ts
        with open(path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

# Git commit
os.system('git config user.name "Mira Elisabeth Schmid"')
os.system('git config user.email "mira@autonom.system"')
os.system("git add .")
os.system(f'git commit -m "✶ Handle-Aufgaben ausgeführt: {ts}" || echo \"Nichts zu committen.\"')
os.system("git push")
