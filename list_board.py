import json
import sys

for line in sys.stdin:
  account = json.loads(line.strip())
  for board in account["boards"]:
    print ",".join(
        [
          str(board["id"]),
          str(board["idOrganization"]),
          str(board["name"])
        ]
      )
