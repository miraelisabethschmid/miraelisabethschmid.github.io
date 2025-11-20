{
  "name": "agent",
  "content": "import os, json, datetime\n\n# Load registry\nreg_path = '.system/registry.json'\nwith open(reg_path) as f:\n    reg = json.load(f)\n\n# Agent generates a tiny new module on each run\nstamp = datetime.datetime.utcnow().strftime('%Y%m%d%H%M%S')\nnew_module_name = f\"auto_module_{stamp}.py\"\nnew_module_content = f\"print('Generated at {stamp}')\"\n\n# Append to registry\nreg['modules'].append({\n    'name': new_module_name.replace('.py',''),\n    'content': new_module_content\n})\n\n# Save registry\nwith open(reg_path, 'w') as f:\n    json.dump(reg, f, indent=2)\n\nprint('Agent added new module:', new_module_name)\n"
}
