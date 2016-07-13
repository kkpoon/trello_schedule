#!/bin/sh

curl "https://api.trello.com/1/members/kkpoon?key=$TRELLO_APIKEY&token=$TRELLO_TOKEN&fields=username&boards=all" | \
  python parse_member_.py | \
  grep "Template Board" | \
  python get_board_curl.py | \
  sh

curl "https://api.trello.com/1/board/A4nYKXtm?key=$TRELLO_APIKEY&token=$TRELLO_TOKEN&lists=open"

curl -d"key=$TRELLO_APIKEY&token=$TRELLO_TOKEN&name=hello&idBoardSource=57863f239ba13b11c8daa4c5" -XPOST "https://api.trello.com/1/board"

curl "https://api.trello.com/1/board/A4nYKXtm?key=$TRELLO_APIKEY&token=$TRELLO_TOKEN&lists=open"
