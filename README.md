curl -XPUT "http://elasticsearch:9200/items" -H "kbn-xsrf: reporting" -H "Content-Type: application/json" -d'
{
  "mappings": {
    "properties": {
      "name": {
        "type": "text",
        "analyzer": "standard"
      },
      "linktoimg": {
        "type": "text",
        "index": false
      }
    }
  }
}'




curl -s -H "Content-Type: application/json" -X POST "localhost:9200/items/_bulk" --data-binary "@docsx.json"
