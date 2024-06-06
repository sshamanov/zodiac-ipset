```
curl -s 127.0.0.1:3000/list|jq
```

```
{
  "ipsets": {
    "ipset": [
      {
        "@name": "BP",
        "type": "bitmap:ip",
        "revision": "3",
        "header": {
          "range": "192.168.0.0-192.168.255.255",
          "memsize": "8280",
          "references": "0",
          "numentries": "1"
        },
        "members": {
          "member": {
            "elem": "192.168.181.135"
          }
        }
      },
      {
        "@name": "HW",
        "type": "bitmap:ip",
        "revision": "3",
        "header": {
          "range": "192.168.0.0-192.168.255.255",
          "memsize": "8280",
          "references": "0",
          "numentries": "1"
        },
        "members": {
          "member": {
            "elem": "192.168.178.243"
          }
        }
      }
    ]
  }
}
```
