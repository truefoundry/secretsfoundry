from servicefoundry.secretsfoundry import SecretsFoundry

import os
import json

app = SecretsFoundry()

env_map = app.read_file('.env')
"""
Contents of .env were:
  DB_HOST=test
  APP_PACK=testing

"""
print('Parsed .env: \n' , json.dumps(env_map, indent=2))

print('Setting env values')
for key, value in env_map.items():
    os.environ[key] = value

print('fetching env values from os.environ')
print(os.environ.get('DB_HOST'))
print(os.environ.get('APP_PACK'))

